---
version: alpha

colors:
  starbucks-green: '#006241'
  green-accent: '#00754A'
  house-green: '#1E3932'
  green-uplift: '#2b5148'
  green-light: '#d4e9e2'
  consent-green: '#008248'
  gold: '#cba258'
  gold-light: '#dfc49d'
  gold-lightest: '#faf6ee'
  rewards-green: '#33433d'
  white: '#ffffff'
  neutral-cool: '#f9f9f9'
  neutral-warm: '#f2f0eb'
  ceramic: '#edebe9'
  black: '#000000'
  text-black: 'rgba(0, 0, 0, 0.87)'
  text-black-soft: 'rgba(0, 0, 0, 0.58)'
  text-white: 'rgba(255, 255, 255, 1)'
  text-white-soft: 'rgba(255, 255, 255, 0.70)'
  input-border: '#d6dbde'
  hairline: '#e7e7e7'
  red: '#c82014'
  yellow: '#fbbc05'

typography:
  display-10:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 80px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.16px
  jumbo-9:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 58px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.16px
  hero-large-8:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 45px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.16px
  h1:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 24px
    fontWeight: 600
    lineHeight: 36px
    letterSpacing: -0.16px
  h2:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 36px
    letterSpacing: -0.16px
  body-large:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 19px
    fontWeight: 400
    lineHeight: 33.25px
    letterSpacing: -0.16px
  body-3:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: -0.01em
  small-2:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: -0.01em
  micro-1:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: -0.01em
  button-label:
    fontFamily: "SoDoSans, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  rewards-serif:
    fontFamily: "'Lander Tall', 'Iowan Old Style', Georgia, serif"
    fontSize: 45px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.16px
  careers-script:
    fontFamily: "'Kalam', 'Comic Sans MS', cursive"
    fontSize: 24px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  card: 12px
  pill: 50px
  full: 50%

spacing:
  space-1: 4px
  space-2: 8px
  space-3: 16px
  space-4: 24px
  space-5: 32px
  space-6: 40px
  space-7: 48px
  space-8: 56px
  space-9: 64px
  outer-gutter: 16px
  outer-gutter-md: 24px
  outer-gutter-lg: 40px

components:
  button-primary-filled:
    backgroundColor: '{colors.green-accent}'
    textColor: '{colors.white}'
    typography: '{typography.button-label}'
    rounded: '{rounded.pill}'
    padding: 7px 16px
    border: '1px solid #00754A'
  button-primary-outlined:
    backgroundColor: transparent
    textColor: '{colors.green-accent}'
    typography: '{typography.button-label}'
    rounded: '{rounded.pill}'
    padding: 7px 16px
    border: '1px solid #00754A'
  button-black-filled:
    backgroundColor: '{colors.black}'
    textColor: '{colors.white}'
    typography: '{typography.small-2}'
    rounded: '{rounded.pill}'
    padding: 7px 16px
    border: '1px solid #000000'
  button-dark-outlined:
    backgroundColor: transparent
    textColor: '{colors.text-black}'
    typography: '{typography.small-2}'
    rounded: '{rounded.pill}'
    padding: 7px 16px
    border: '1px solid rgba(0, 0, 0, 0.87)'
  button-green-on-green-inverted:
    backgroundColor: '{colors.white}'
    textColor: '{colors.green-accent}'
    typography: '{typography.button-label}'
    rounded: '{rounded.pill}'
    padding: 7px 16px
    border: '1px solid #ffffff'
  button-outlined-on-dark:
    backgroundColor: transparent
    textColor: '{colors.white}'
    typography: '{typography.button-label}'
    rounded: '{rounded.pill}'
    padding: 7px 16px
    border: '1px solid #ffffff'
  button-consent-agree:
    backgroundColor: '{colors.consent-green}'
    textColor: '{colors.white}'
    typography: '{typography.small-2}'
    rounded: '{rounded.pill}'
    padding: 7px 16px
  button-frap-floating:
    backgroundColor: '{colors.green-accent}'
    textColor: '{colors.white}'
    rounded: '{rounded.full}'
    height: 56px
    width: 56px
  button-frap-mini:
    backgroundColor: '{colors.green-accent}'
    textColor: '{colors.white}'
    rounded: '{rounded.full}'
    height: 40px
    width: 40px
  button-feedback-tab:
    backgroundColor: '{colors.green-accent}'
    textColor: '{colors.white}'
    typography: '{typography.small-2}'
    rounded: '12px 12px 0px 0px'
    padding: 8px 16px
  card-default:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-black}'
    typography: '{typography.body-3}'
    rounded: '{rounded.card}'
    padding: 24px
  card-gift:
    backgroundColor: transparent
    textColor: '{colors.text-black}'
    typography: '{typography.body-3}'
    rounded: '{rounded.card}'
  card-rewards-status:
    backgroundColor: '{colors.house-green}'
    textColor: '{colors.white}'
    typography: '{typography.body-3}'
    rounded: '{rounded.card}'
    padding: 24px
  card-partnership:
    backgroundColor: '{colors.gold-lightest}'
    textColor: '{colors.text-black}'
    typography: '{typography.body-3}'
    rounded: '{rounded.card}'
    padding: 24px
  dropdown-menu:
    backgroundColor: '{colors.neutral-cool}'
    textColor: '{colors.text-black}'
    typography: '{typography.h2}'
    rounded: '{rounded.card}'
  modal:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-black}'
    typography: '{typography.body-3}'
    rounded: '{rounded.card}'
    padding: 88px 24px 24px 24px
  floating-label-input:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-black}'
    typography: '{typography.body-3}'
    rounded: '{rounded.xs}'
    padding: 12px
    border: '1px solid #d6dbde'
  option-icon:
    backgroundColor: transparent
    textColor: '{colors.text-black}'
    padding: 3px
  global-nav:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-black}'
    typography: '{typography.button-label}'
    height: 99px
  sub-nav:
    backgroundColor: '{colors.neutral-warm}'
    textColor: '{colors.text-black}'
    typography: '{typography.small-2}'
    height: 53px
  feature-band:
    backgroundColor: '{colors.house-green}'
    textColor: '{colors.white}'
    typography: '{typography.body-large}'
    padding: 64px 40px
  size-options-cup:
    backgroundColor: transparent
    textColor: '{colors.starbucks-green}'
    typography: '{typography.button-label}'
    rounded: '{rounded.full}'
    padding: 16px 24px
  add-in-select:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-black}'
    typography: '{typography.body-3}'
    rounded: '{rounded.xs}'
    padding: 12px
    border: '1px solid #d6dbde'
  numeric-stepper-button:
    backgroundColor: '{colors.white}'
    textColor: '{colors.text-black}'
    rounded: '{rounded.full}'
    height: 32px
    width: 32px
    border: '1px solid #d6dbde'
  button-customize:
    backgroundColor: '{colors.white}'
    textColor: '{colors.green-accent}'
    typography: '{typography.button-label}'
    rounded: '{rounded.pill}'
    padding: 14px 40px
    border: '1.5px solid #00754A'
  button-add-to-order:
    backgroundColor: '{colors.green-accent}'
    textColor: '{colors.white}'
    typography: '{typography.button-label}'
    rounded: '{rounded.pill}'
    padding: 14px 32px
  rewards-cost-pill:
    backgroundColor: transparent
    textColor: '{colors.gold}'
    typography: '{typography.micro-1}'
    rounded: '{rounded.pill}'
    padding: 4px 12px
    border: '1px solid #cba258'
  product-description-band:
    backgroundColor: '{colors.house-green}'
    textColor: '{colors.white}'
    typography: '{typography.body-3}'
    padding: 32px
  nutrition-table-row:
    backgroundColor: transparent
    textColor: '{colors.text-black}'
    typography: '{typography.small-2}'
    padding: 12px 0
  store-availability-selector:
    backgroundColor: transparent
    textColor: '{colors.white}'
    typography: '{typography.small-2}'
    rounded: '{rounded.xs}'
    padding: 12px 16px
    height: 48px
  pdp-breadcrumb:
    backgroundColor: transparent
    textColor: '{colors.text-black-soft}'
    typography: '{typography.small-2}'
  back-chevron-link:
    backgroundColor: transparent
    textColor: '{colors.green-accent}'
    typography: '{typography.small-2}'
  cookie-consent:
    backgroundColor: '{colors.house-green}'
    textColor: '{colors.white}'
    typography: '{typography.body-3}'
    rounded: '{rounded.card}'
    padding: 24px
  expander-accordion:
    backgroundColor: transparent
    textColor: '{colors.text-black}'
    typography: '{typography.body-3}'
---

**Key Characteristics:**

- Four-tier green brand system (`{colors.starbucks-green}` / `{colors.green-accent}` / `{colors.house-green}` / `{colors.green-uplift}`) each mapped to a distinct surface role — not a single "brand green".
- Gold (`{colors.gold}` — #cba258) reserved exclusively for Rewards-status ceremony; never a general-purpose accent.
- Warm-neutral canvas (`{colors.neutral-warm}` — #f2f0eb / `{colors.ceramic}` — #edebe9) instead of cold white — references café materials.
- Custom proprietary typeface (SoDoSans) with tight `-0.16px` letter-spacing as the universal voice.
- Context-specific type swaps: serif (Lander Tall) for Rewards, script (Kalam) for Careers cup-names.
- Full-pill buttons (`{rounded.pill}` — 50px radius) universal; `transform: scale(0.95)` active press is the signature micro-interaction.
- Floating Frap circular CTA (`{component.button-frap-floating}` — 56px, Green Accent fill, layered shadow stack) — the product's signature elevation element.
- Gift-card surfaces designed as **photographed physical product** — every card is a distinct illustrated photograph rather than a generated graphic.
- 12px card radius (`{rounded.card}`) plus whisper-soft shadows keep content cards flat-plus-hint-of-lift.
- Rem-based spacing scale anchored at 1.6rem / 16px (`{spacing.space-3}`), stepping to 6.4rem / 64px (`{spacing.space-9}`).
- Color-block page rhythm: cream hero → white content sections → dark-green (`{colors.house-green}` — #1E3932) feature band with white text → cream utility zone → dark-green footer with gold and white text. An espresso-dark bookend around the bright body.

## Colors

### Primary Greens

- **Starbucks Green** (`{colors.starbucks-green}` — #006241): The historic brand green. Used on h1 headings, primary section headers on the Rewards page, and as the main brand signal wherever a single dominant color is needed.
- **Green Accent** (`{colors.green-accent}` — #00754A): A slightly brighter, more luminous green. The primary filled-CTA color ("Explore our afternoon menu", "See the spring menu") and the fill of the floating Frap circular button.
- **House Green** (`{colors.house-green}` — #1E3932): The deep near-black brand green. Footer surface, feature-band backgrounds, Rewards-status dark surfaces, and the "Free coffee is just the beginning" hero band on Rewards.
- **Green Uplift** (`{colors.green-uplift}` — #2b5148): A secondary mid-dark green used sparingly on decorative accents and dark-gradient moments.
- **Green Light** (`{colors.green-light}` — #d4e9e2): A pale mint wash used for form-valid-state tints and light green utility surfaces.
- **Consent Green** (`{colors.consent-green}` — #008248): A specific variant green used only in the cookie-consent module's Agree button.

### Gold (Rewards only)

- **Gold** (`{colors.gold}` — #cba258): Reserved almost exclusively for Rewards-status ceremony — Gold-tier callouts, partnership badges (SkyMiles, Bonvoy), and premium-feeling accents. Never a general-purpose brand color.
- **Gold Light** (`{colors.gold-light}` — #dfc49d): Softer gold for background washes on gold-tier sections.
- **Gold Lightest** (`{colors.gold-lightest}` — #faf6ee): Cream-gold page-surface wash used under partnership sections on the Rewards page — ties the gold accent back into the warm neutral system.

### Surface & Background

- **White** (`{colors.white}` — #ffffff): Primary card and modal surface. Also card fill on gift-card tiles.
- **Neutral Cool** (`{colors.neutral-cool}` — #f9f9f9): Subtle cool-gray surface used on dropdown menus (Account dropdown), form-card wraps, and quiet utility containers.
- **Neutral Warm** (`{colors.neutral-warm}` — #f2f0eb): The warm cream **primary page canvas** for Rewards utility zones and hero bands.
- **Ceramic** (`{colors.ceramic}` — #edebe9): A slightly warmer/darker cream for zone separators, soft page-section washes, and the Rewards partnership band.
- **Black** (`{colors.black}` — #000000): Deep ink reserved for the dark top-of-page CTA strip ("Join now") and high-contrast top-nav sign-in buttons.

### Text

- **Text Black** (`{colors.text-black}` — rgba(0, 0, 0, 0.87)): Primary heading and body text color on light surfaces. Not pure black — an 87%-opacity black that reads warmer.
- **Text Black Soft** (`{colors.text-black-soft}` — rgba(0, 0, 0, 0.58)): Secondary / metadata text on light surfaces.
- **Text White** (`{colors.text-white}` — rgba(255, 255, 255, 1)): Primary heading / body text on dark green surfaces.
- **Text White Soft** (`{colors.text-white-soft}` — rgba(255, 255, 255, 0.70)): Secondary text on dark-green surfaces — footer link descriptions, caption text.
- **Rewards Green** (`{colors.rewards-green}` — #33433d): A dedicated muted slate-green used only on Rewards-page text blocks — slightly "dustier" than Text Black to signal "reward surface" without using full Starbucks Green.

### Semantic & Borders

- **Red** (`{colors.red}` — #c82014): Error and destructive state (form invalid, destructive actions).
- **Yellow** (`{colors.yellow}` — #fbbc05): Warning state, legacy brand touch.
- **Input Border** (`{colors.input-border}` — #d6dbde): The default 1px outline color on form inputs and PDP Add-in selectors.
- **Hairline** (`{colors.hairline}` — #e7e7e7): The 1px row divider used inside nutrition tables and long-form lists.

## Typography

### Font Family

The system runs **SoDoSans** for nearly every surface — Starbucks' proprietary corporate typeface licensed from House Industries. Fallbacks walk `"Helvetica Neue", Helvetica, Arial, sans-serif`. Two context-specific swaps exist: **Lander Tall** (with `"Iowan Old Style", Georgia, serif` fallback) for warm editorial moments on the Rewards page, and **Kalam** (with `"Comic Sans MS", cursive` fallback) for hand-written "cup name" touches on Careers pages.

There is no OpenType stylistic set explicitly activated at `:root`.

### Hierarchy

| Token                         | Size | Weight | Line Height | Letter Spacing | Use                                              |
| ----------------------------- | ---- | ------ | ----------- | -------------- | ------------------------------------------------ |
| `{typography.display-10}`     | 80px | 600    | 1.2         | -0.16px        | Largest Rewards / hero display                   |
| `{typography.jumbo-9}`        | 58px | 600    | 1.2         | -0.16px        | Secondary hero headings                          |
| `{typography.hero-large-8}`   | 45px | 600    | 1.2         | -0.16px        | Landing section headlines                        |
| `{typography.h1}`             | 24px | 600    | 36px        | -0.16px        | Starbucks-Green primary heading                  |
| `{typography.h2}`             | 24px | 400    | 36px        | -0.16px        | Regular-weight section title in Text Black       |
| `{typography.body-large}`     | 19px | 400    | 33.25px     | -0.16px        | Hero intro copy, feature-band body               |
| `{typography.body-3}`         | 16px | 400    | 24px        | -0.01em        | Default body copy                                |
| `{typography.small-2}`        | 14px | 600    | 1.5         | -0.01em        | Button label, metadata, form labels              |
| `{typography.micro-1}`        | 13px | 400    | 1.5         | -0.01em        | Active float-label state, caption micro-copy     |
| `{typography.button-label}`   | 16px | 600    | 1.2         | -0.01em        | All pill-button labels                           |
| `{typography.rewards-serif}`  | 45px | 400    | 1.2         | -0.16px        | Lander Tall serif on Rewards editorial headlines |
| `{typography.careers-script}` | 24px | 400    | 1.2         | 0              | Kalam script for Careers "cup name" moments      |

### Principles

- **Tight negative tracking (`-0.01em` / `-0.16px`)** is applied almost universally — the whole product reads slightly compressed, which gives SoDoSans its confident presence without feeling squeezed.
- **Weight shifts carry hierarchy, not size shifts.** `{typography.h1}` and `{typography.h2}` share the same 24px / 36px size; only weight (600 vs 400) and color (Starbucks Green vs Text Black) separate them.
- **Size tokens are rem-based, anchored to `1rem = 10px`** on the live site via a `font-size: 62.5%` root trick. So 1.6rem = 16px, 2.4rem = 24px. The scale is semantic (textSize-1 through textSize-10), not arbitrary pixel values.
- **Context-specific typeface swaps** — Lander Tall serif on Rewards, Kalam script on Careers — are deliberate and localized. Never mix them with the primary sans within the same surface.
- **Body text never goes pure black.** It sits at `{colors.text-black}` (`rgba(0, 0, 0, 0.87)`) to match the warm-neutral canvas temperature.

### Note on Font Substitutes

SoDoSans is proprietary to Starbucks (licensed from House Industries, not publicly available). Reasonable open-source substitutes are **Inter** (Google Fonts — similar humanist geometric proportions), **Manrope** (slightly rounder, similar confident feel), or **Nunito Sans** (warmer, good "café" feel). If substituting, verify the tight `-0.01em` / `-0.16px` tracking still reads well; some open-source fonts need `-0.005em` instead. Lander Tall is custom — substitute with **Iowan Old Style**, **Lora**, or **Source Serif Pro**. Kalam is available on Google Fonts directly.

## Layout

### Spacing System

Rem-based semantic scale anchored at `1rem = 10px`:

- **Tokens:** `{spacing.space-1}` 4px · `{spacing.space-2}` 8px · `{spacing.space-3}` 16px · `{spacing.space-4}` 24px · `{spacing.space-5}` 32px · `{spacing.space-6}` 40px · `{spacing.space-7}` 48px · `{spacing.space-8}` 56px · `{spacing.space-9}` 64px.
- **Outer gutter:** `{spacing.outer-gutter}` 16px on mobile, `{spacing.outer-gutter-md}` 24px on tablet, `{spacing.outer-gutter-lg}` 40px on desktop.
- **Universal rhythm constant:** 16px (`{spacing.space-3}`) appears across every page as the default outer gutter, card padding baseline, and text size 3 body — the system's most frequent spacing unit.

### Grid & Container

- **Column widths:** Small 343px, Medium 500px, Large 720px, XLarge 1440px.
- **Gift-card grid:** 3-up to 5-up responsive grid of ~343px tiles.
- **Rewards status section:** 3-up dark-green panels at lg+ breakpoints, stacking to single column on mobile.
- **Hero:** asymmetric 40% (image) / 60% (content) split — image crate and content crate proportions.

### Whitespace Philosophy

Whitespace carries the feeling of "plenty of space in the café." Section padding leans generous (40–64px). Content blocks are separated by whitespace rather than dividers. The cream canvas (`{colors.neutral-warm}` — #f2f0eb) is itself a visual breath between white cards and green feature bands.

### Border Radius Scale

- `{rounded.card}` (12px): Cards, modals, menu-item tiles.
- `12px 12px 0 0`: Full-width feedback tab (top-rounded only).
- `{rounded.pill}` (50px): All buttons — full-pill radius without exception.
- `{rounded.full}` (50%): Circular icons, Frap floating button, avatar thumbnails.
- `{rounded.xs}` (4px): PDP Add-in select, Store Availability Selector.

## Elevation

| Level                | Treatment                                                                         | Use                                                   |
| -------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Card                 | `0 0 0.5px rgba(0,0,0,0.14), 0 1px 1px rgba(0,0,0,0.24)`                          | Default content cards — a whisper-soft dual-shadow    |
| Global Nav           | `0 1px 3px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.06), 0 0 2px rgba(0,0,0,0.07)` | Triple-layer soft lift on the fixed top bar           |
| Frap Base            | `0 0 6px rgba(0,0,0,0.24)`                                                        | Base halo around the floating circular CTA            |
| Frap Ambient         | `0 8px 12px rgba(0,0,0,0.14)`                                                     | Stacked directional ambient — floats the Frap forward |
| Gift Card            | Light drop shadow around illustrated photograph                                   | Physical-card feel for gift tiles                     |
| Starbucks Card (SVC) | `drop-shadow(0 4px 1px rgba(0,0,0,0.11)) drop-shadow(0 0 2px rgba(0,0,0,0.24))`   | Stacked SVG drop shadows on Starbucks Card visuals    |

**Shadow philosophy:** Whisper-soft, layered over solid — the system never reaches for a single heavy drop shadow. Instead, it stacks 2–3 low-alpha shadows with different offsets to simulate real-world ambient + direct lighting. The Frap button is the most elevated element on any page. There are no gradient fills — color-block banding carries perceived depth (dark-green bands read as "recessed feature zones" between cream / white body sections).

## Components

### Buttons

**`button-primary-filled`** — Green Accent (`{colors.green-accent}` — #00754A) fill, white text, 50px full-pill, `7px 16px` padding, SoDoSans 16/600 with `-0.01em` letter-spacing. The most common CTA: "Explore our afternoon menu", "Sign up for free". Active state: `transform: scale(0.95)` with a `0.2s ease` transition.

**`button-primary-outlined`** — Transparent fill, Green Accent text, 1px Green Accent border. Same pill / padding / active behavior as the filled variant. Used for "Give them a try", "Start an order".

**`button-black-filled`** — Black (`{colors.black}`) fill, white text, 50px pill. 14/600. Used on the top-of-page "Join now" strip and high-conversion moments.

**`button-dark-outlined`** — Transparent with Text Black border and Text Black label. 14/600. Used for "Sign in" in the top nav.

**`button-green-on-green-inverted`** — White fill with Green Accent text and white border. Used when the surface behind the button is the dark-green House Green band — white pill with green text instead of a green pill on green.

**`button-outlined-on-dark`** — Transparent fill with white text and white 1px border. Used on dark-green feature bands as the secondary action paired with a white filled CTA.

**`button-consent-agree`** — Consent Green (`{colors.consent-green}` — #008248) fill with white text, no border, 14/400. A slightly brighter green reserved for the cookie-consent banner's Agree action.

**`button-frap-floating`** — The product's signature elevation element. 56px circular Green Accent fill with white shopping-bag icon centered. Fixed bottom-right with a `-0.8rem` touch offset. Layered shadow: `0 0 6px rgba(0,0,0,0.24)` base + `0 8px 12px rgba(0,0,0,0.14)` ambient. Active state collapses the ambient shadow to `0 8px 12px rgba(0,0,0,0)` with `scale(0.95)`. A 40px mini variant (`button-frap-mini`) is used in tighter contexts.

**`button-feedback-tab`** — Full-width Green Accent tab pinned to the viewport bottom-right edge. Top-rounded only (`12px 12px 0 0`), 14/400 white text, `8px 16px` padding.

### Cards & Containers

**`card-default`** — White fill at 12px radius with the layered card shadow. Used for feature cards, menu-item tiles, and Rewards utility panels.

**`card-gift`** — A photographed illustrated card filling the entire surface (no solid background), grouped under a category label ("Spring", "Thank You", "Birthday") in SoDoSans 24/400 above the grid. Each card is a distinct hand-drawn watercolor — never a generic generated graphic.

**`card-rewards-status`** — A House Green (`{colors.house-green}` — #1E3932) panel with a colored gradient top stripe (Bronze / Silver / Gold tier), numbered "Level" badge, status title in SoDoSans 24/600 white, benefits list in white / translucent-white text, and a "As you earn more stars…" progression caption at the bottom.

**`card-partnership`** — Gold Lightest (`{colors.gold-lightest}` — #faf6ee) warm-cream surface with partner logos centered (SkyMiles, Bonvoy) and descriptive text below. Default 12px radius + card shadow.

**`dropdown-menu`** — Neutral Cool (`{colors.neutral-cool}` — #f9f9f9) surface with 24/400 Text Black menu items. No border — the background surface shift against the white nav carries the boundary.

**`modal`** — Default card shadow and 12px radius. `2.4rem` padding with a heavier `8.8rem` top padding to leave room for the close button / header. Combined vertical padding hits `11.2rem`.

### Forms

**`floating-label-input`** — White surface with a 1px Input Border (`{colors.input-border}` — #d6dbde) outline at 4px radius. Label floats above the input border when focused or filled — desktop label animates from 1.9rem → 1.4rem; mobile label animates from 1.6rem → 1.3rem. Active label translate: up to `-12px` with `-50%` Y. Validation: valid field gets a `rgba(green-light, 0.33)` tint, invalid field gets a `rgba(red, 0.05)` tint. Transition uses a springy `cubic-bezier(0.32, 2.32, 0.61, 0.27)` overshoot curve on checked inputs.

**`option-icon`** — Checkbox / radio with `3px` inner padding, using the same springy cubic-bezier on selection.

### Navigation

**`global-nav`** — Fixed top bar with progressive heights: 64px (xs) → 72px (mobile) → 83px (tablet) → 99px (desktop). Three-layer soft shadow stack. Left: Starbucks wordmark, offset 99px (md) / 131px (lg) from the left edge. Center: primary links in SoDoSans 400–600 (Menu · Rewards · Gift Cards). Right: Find a store link + Sign in (outlined) + Join now (black filled).

**`sub-nav`** — A second bar (e.g., Rewards internal). 53px height for global subnav, 48px for internal subnav. Horizontal tab group beneath the global nav.

### Feature Band

**`feature-band`** — Full-width House Green (`{colors.house-green}` — #1E3932) section with left column carrying a white headline + Text White Soft (`{colors.text-white-soft}` — rgba(255,255,255,0.70)) subhead + CTA row (Green-on-Green Inverted primary + Outlined-on-Dark secondary), and right column with product photography. Split ratio ~40 / 60 or 50 / 50 depending on section. Stacks vertically below 768px.

### Product Detail (PDP)

**`size-options-cup`** — A horizontal row of 4 cup-icon buttons (Tall / Grande / Venti / Trenta). Each item: cup silhouette icon on top, size name below (16/700 Starbucks Green), fluid-ounce caption (13/400 Text Black Soft). Active state wraps the cup icon in a 2px solid Green Accent circular ring. Inactive: no ring, same typography.

**`add-in-select`** — Full-width white rectangle with 1px Input Border outline, 4px radius. Floating label above top border ("Add-ins", "Milk") in 13/700 Text Black uppercase with 0.325px letter-spacing. Value centered (e.g., "Ice", "Coconut", "Strawberry Fruit Inclusions scoop") in 16/400 Text Black. Chevron-down icon on the right in Text Black Soft. Focus: border shifts to Green Accent.

**`numeric-stepper-button`** — Circular 32×32px button with 1px Input Border outline and neutral gray icon. Embedded inside an Add-in row when a quantity is required. The count number sits 16/700 Text Black between the `−` and `+` buttons.

**`button-customize`** — White fill, Green Accent text, 1.5px Green Accent border, 50px pill, `14px 40px` padding (generously larger than default pills). Label: "Customize" with a gold sparkle icon inset left. Used for entering the drink-customization flow.

**`button-add-to-order`** — Green Accent fill, white text, 50px pill, `14px 32px` padding. Pinned top-right of the product card. Same `scale(0.95)` active behavior as other primary CTAs.

**`rewards-cost-pill`** — Transparent fill, Gold (`{colors.gold}` — #cba258) text and 1px Gold border. 50px pill, `4px 12px` padding. Content: "200★ item" where `★` is a small filled star glyph — indicates Rewards Stars required to redeem. Used only on products that are Rewards-redeemable.

**`product-description-band`** — Full-width House Green band beneath the product header. Stacks: Rewards Cost Pill (gold) if applicable → product description body copy in white 16/400/1.5 → nutritional inline summary in white 14/700 ("140 calories, 25g sugar, 2.5g fat") with info-icon tooltip → "Full nutrition & ingredients list" outlined-white-on-green pill. 32px vertical padding.

**`nutrition-table-row`** — Two-column layout inside a white card. Left: "Ingredients" header + list (or "Not available for this item" placeholder paragraph in 14/400 Text Black Soft). Right: "Nutrition" header + label / value rows separated by 1px Hairline (`{colors.hairline}` — #e7e7e7) below. Footnote markers in 13/400 Text Black Soft at the bottom.

**`store-availability-selector`** — Full-width rounded rectangle on the dark-green feature band above the size-options row. Transparent-white interior, white 14/400 text ("For item availability, choose a store"), chevron-down + shopping-bag SVG icon on the right. 4px radius, ~48px height.

**`pdp-breadcrumb`** — "Menu / Refreshers / Pink Energy Drink" trail above the product title in 14/400 Proxima Nova. Separator: `/` slash in Text Black Soft. Current page unlinked, prior pages underlined green-accent links.

**`back-chevron-link`** — "← Back" text link above section headings on the nutrition page. Green Accent 14/700 Proxima Nova with a left chevron `<` in the same green. An alternative to the full breadcrumb on deep sub-pages.

### System Modules

**`cookie-consent`** — Dark-green modal card at the top of the page with "Agree" (Consent Green filled) and "Manage preferences" (outlined) buttons. Appears on first visit; dismissible.

**`expander-accordion`** — 300ms duration with a `cubic-bezier(0.25, 0.46, 0.45, 0.94)` measured ease-out curve. Used for FAQ sections on Rewards and gift pages.

## Responsive Behavior

| Name    | Width       | Key Changes                                                                      |
| ------- | ----------- | -------------------------------------------------------------------------------- |
| xs      | < 480px     | Global nav 64px; hamburger menu; single-column layouts; pill buttons full-width. |
| Mobile  | 480–767px   | Global nav 72px; gift-card grid 2-up; card padding tightens.                     |
| Tablet  | 768–1023px  | Global nav 83px; gift-card grid 3-up; hero split begins to appear.               |
| Desktop | 1024–1439px | Global nav 99px; gift-card grid 4-up; full 40 / 60 asymmetric hero.              |
| XLarge  | 1440px+     | Content caps at 1440px; gift-card grid 5-up; extra cream margin.                 |

### Touch Targets

- Pill buttons at `7px 16px` padding measure ~32px tall — below the 44px WCAG AAA minimum for touch-only surfaces. On mobile, button padding may visually expand to meet the minimum.
- Frap floating circular button at 56px is well above minimum.
- Frap uses `--frapTouchOffset: calc(-1 * .8rem)` to extend the tap area 8px beyond the visual edge.
- Form float-label inputs grow their label font size on mobile (1.6rem base vs 1.9rem desktop) — easier to tap and read at arm's length.

### Collapsing Strategy

- Global nav height scales progressively: 64 → 72 → 83 → 99px across breakpoints.
- Hero split collapses from 40 / 60 asymmetric → stacked (image top, content below) on mobile.
- Gift-card grid: 5-up → 4-up → 3-up → 2-up → 1-up across breakpoints with adjusted card widths.
- Feature bands stay full-width but text + imagery stack vertically on mobile.
- Outer gutter scales: 16px → 24px → 40px as the viewport grows.
- Rewards 3-column status panels stack to a single column on mobile.
- Frap floating button persists at bottom-right regardless of nav state.

### Image Behavior

- Hero product photography crops tighter vertically on mobile; content becomes the visual anchor.
- Gift-card illustrations preserve aspect ratio; the card grid reflows.
- `opacity 0.3s ease-in` fade-in transition on image load (prevents jarring pop-in).
- Rewards app-in-hand photography scales proportionally; never stretches.

## Known Gaps

- **SoDoSans is proprietary** — not available on Google Fonts (licensed from House Industries). When implementing publicly, use Inter or Manrope as a substitute and document the swap. Lander Tall (Rewards serif) is also custom — substitute with Iowan Old Style, Lora, or Source Serif Pro.
- **Specific per-component animation timings** beyond the few documented (`--duration: 0.4s`, `--iconTransition: all ease-out 0.2s`, `--expanderDuration: 300ms`) are not captured for every interactive surface.
- **Form error-state full styling** (red border weight, icon placement) is visible on the tint token but not exhaustively extracted.
- **Careers-page specific components** (cup-name card, search radio grid) are referenced in token names but not covered by this extraction.
- **Starbucks Visa Card / Starbucks-Card (SVC) detailed mockup specs** are hinted at by `--svcRoundedCorners` and `--svcShadowFilter` tokens but not fully documented.
- **Gradient system** — none observed; the system is solid color-block throughout, so no gradient tokens are documented.
