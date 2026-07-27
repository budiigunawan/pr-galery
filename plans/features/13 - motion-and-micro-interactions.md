# Feature 13: Motion & Micro-interactions

## Overview

Adds restrained, purposeful motion to the revamped landing page: a scroll-triggered reveal for section content, and a small hover interaction on `DocketCard`. Deliberately minimal in scope — the design direction calls for one orchestrated, subtle touch rather than scattered animation effects, and `prefers-reduced-motion` must be respected throughout.

## Requirements

- **Scroll reveal**: section headings and card grids (product grid, FAQ grid, the new `TicketStep` row from feature 11) fade in and slide up slightly as they enter the viewport on scroll. Must not run on initial page load for above-the-fold content (the hero should be visible immediately, not fade in) — only applies to content that scrolls into view.
- Must respect `prefers-reduced-motion: reduce` — when set, content renders in its final state immediately with no animation, not just a faster/shorter one.
- **`DocketCard` hover**: on hover (pointer devices only — must not trigger on touch/tap in a way that breaks tap-to-read on mobile), the card's existing alternating rotation (`-rotate-1`/`rotate-1`) animates to `rotate-0`, then returns to its original rotation on hover-out. Short, subtle transition (e.g. 150–200ms ease-out) — this is a small delight detail, not a showpiece.
- No other new animations. Existing `active:scale-95` button press behavior is unchanged.
- No animation library dependency — implement with CSS transitions/`IntersectionObserver`, consistent with the project having no existing animation library.

## Technical Implementation

- New file: `components/ui/ScrollReveal.tsx` — a small client component (`"use client"`) wrapping `children`, using `IntersectionObserver` to add a "revealed" class/state once the element enters the viewport, combined with a CSS transition (opacity + translateY) defined either inline or as a new utility in `app/globals.css`. Check `window.matchMedia("(prefers-reduced-motion: reduce)")` (or the CSS `@media (prefers-reduced-motion: reduce)` equivalent) to skip the initial hidden state entirely when reduced motion is requested, so there's no flash of hidden content.
- Edit: `app/page.tsx` — wrap the product grid, FAQ grid, and `TicketStep` row (and their `SectionHeading`s, optionally) in `ScrollReveal`. Do not wrap the hero.
- Edit: `components/ui/DocketCard.tsx` — add a `hover:rotate-0` (or equivalent) Tailwind class with a `transition-transform` alongside the existing rotation class; guard with `@media (hover: hover)` semantics if using Tailwind's `hover:` variant directly is insufficient to exclude touch devices (Tailwind's `hover:` already compiles to a `@media (hover: hover)`-guarded rule in modern browsers via `:hover` + touch-behavior nuances — verify actual behavior on a touch device/emulator rather than assuming).

## Dependencies

- Loosely depends on features 09–12 having landed (there's more content to apply `ScrollReveal` to), but `ScrollReveal` and the `DocketCard` hover change are independently buildable and testable against the current page structure.

## Acceptance Criteria

- [ ] Scrolling down the page reveals section content (product cards, FAQ cards, ticket steps) with a fade/slide-up animation the first time each enters the viewport.
- [ ] Hero content is visible immediately on page load — no fade-in delay.
- [ ] With `prefers-reduced-motion: reduce` enabled (verified via browser devtools emulation), all content renders in place immediately with no animation and no flash of invisible content.
- [ ] Hovering a `DocketCard` on a desktop pointer straightens it to `rotate-0`; moving the pointer away returns it to its original tilt.
- [ ] Tapping a `DocketCard` on a touch device does not get stuck in a hover-triggered state.
- [ ] `npm run lint` and `npm run typecheck` pass.
