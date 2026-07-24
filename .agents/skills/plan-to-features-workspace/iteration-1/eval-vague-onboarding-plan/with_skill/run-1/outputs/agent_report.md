## What the skill says (Step 1: Gather the plan)

> "If the plan is missing key decisions (tech stack, target users, what's explicitly out of scope), ask clarifying questions now rather than guessing... Resolve ambiguity before writing files, not by hedging inside them."

This plan is missing essentially every category the skill flags as a stop condition, not just one:

- **The actual onboarding steps** — "we haven't picked exact steps yet" is the core content every feature file would need (each step is likely its own feature). Nothing to decompose without inventing it.
- **Tech stack** — explicitly deferred ("no backend/tech stack details yet"), so the "Technical Implementation" section of every feature file would be pure fabrication.
- **Target users** — unclear if onboarding applies uniformly to all signups or varies by user/account type.
- **Success metric / "done" definition** — "faster to first meaningful action" and "quick and not annoying" aren't measurable; acceptance criteria can't be written without a concrete target.
- **Scope boundaries** — skippable vs. mandatory, resumable vs. one-time, whether it's blocking access to the dashboard, aren't stated.

Given how many of these are unresolved simultaneously — not one gap to patch, but the entire shape of the feature list — I judged that even a lightweight draft breakdown would mean guessing the one thing the skill explicitly forbids guessing (scope/steps), rather than sketching structure around a plan that's otherwise clear. So I did not write a draft, and I did not create `plans/` or any files in the output directory.

## Clarifying questions I would ask before writing anything

1. **What are the candidate onboarding steps** (or at least the "first meaningful action" you want users to reach)? E.g., is it profile setup, creating a first project/item, connecting an integration, inviting teammates — something else? This determines the entire feature list.
2. **Is onboarding the same for every new user, or does it vary** by account type, role, or plan (e.g., individual vs. team)?
3. **What's the concrete success signal** for "faster to first meaningful action" — a specific event/action we consider "activated," and any target (e.g., % completing within N minutes)?
4. **Is the flow skippable/dismissible**, or mandatory before reaching the dashboard? If skipped, can users resume later, and from where?
5. **Where does progress live** — persisted server-side (needs a data model/API), or client-side/session state only? This affects whether "Technical Implementation" sections can be written at all.
6. **Tech stack / existing app context** — is this being built into an existing codebase (none was provided here), and if so which framework/auth system? Or should the plan stay conceptual/stack-agnostic for now?
7. **Non-goals** — should this explicitly exclude things like personalization logic, A/B testing infrastructure, localization, or admin-configurable onboarding content, so scope doesn't creep later?

## Outcome

No files were written (no `plans/REQUIREMENTS.md`, no `plans/features/*`). Per the skill's Step 1, the agent stopped to get answers to the questions above before identifying features or drafting any implementation-ready content, since doing so now would mean fabricating the very decisions (steps, stack, scope, success definition) the skill says must be resolved first.
