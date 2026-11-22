# Design system: Signal cabin

The portfolio's argument is "I build AI systems you can trust to act". The visual
world is a railway signal box, because interlocking is that argument made
physical: the clever part proposes, a deterministic guard decides, and nothing
irreversible moves until the signal clears.

Explored and rejected (see `.impeccable/lab/` screenshots, kept locally): India
Post inland letter, kitchen order rail, split-flap departure board, and a plain
light portfolio as control.

## Faces

Two material faces, one token set. A component works on either without changes.

| Token      | Panel (`:root`, `.panel`)          | Enamel (`.enamel`)     |
| ---------- | ---------------------------------- | ---------------------- |
| canvas     | `#2c3b35` painted signal-box green | `#ece7d6` cream enamel |
| surface-2  | `#1f2a25` instrument face          | `#d9d2bb`              |
| ink        | `#ece7d6`                          | `#1f2a25`              |
| ink-muted  | `#b8b4a6`                          | `#4a5550`              |
| ink-subtle | `#a9a99b`                          | `#56605a`              |
| brass      | `#c9a66b` nameplates, rules        | `#7d5f2c`              |

All text pairs meet WCAG AA (checked: the lowest is amber or brass text on
enamel, 4.79:1).
Colour tokens are declared with `@theme inline`, so `.enamel` overrides reach
every utility. Without `inline`, Tailwind resolves the variables at `:root`
and the enamel sections lose their text colour.

The page alternates faces: hero (panel) → register (enamel) → work (panel) →
rule book (enamel) → experience (panel) → proof (enamel) → contact (panel).

## Lamps

Colour carries meaning, the same everywhere:

- **Amber** (`accent`, lamp `#f4b731`): occupied. Something is acting, or the
  action the visitor can take. Primary buttons.
- **Green** (`verify`, lamp `#4cc27a`): cleared. A guard passed, a claim with
  evidence.
- **Red** (`danger`, lamp `#e3402d`): held at danger. A guard that stops the
  flow. The lamp colour is for lamps and large marks only; text uses
  `danger` (`#ff7a63` on panel).

## Type

- **Big Shoulders**, 800, uppercase: headings, as painted signage. Tight
  leading (0.86–0.92), tracking near 0.
- **Public Sans**: all reading text and UI. Lead paragraphs use `prose-lead`.
- **Geist Mono**: only for counts, dates, serials, code. Never for decoration.

## Components

- **Mimic diagram** (`components/work/mimic.tsx`): every system is drawn as
  rail on sleepers with a train (amber locomotive, headlamp) that runs it.
  Guards are signal heads, red until the train passes; the stretch into the
  action lights amber; station labels brighten as the train reaches them. A
  train-describer readout above the track names where it is. In the Work
  section the train follows the scroll and dwells at each station, longest at
  guards; on case studies it runs once. `holdAt` stops it at a guard until the
  visitor pulls the lever (Auto Apply in the Work section).
- **Lever frame**: the navigation. Numbered levers; the current section's
  lever is pulled over and lit amber. The footer repeats the numbers.
- **Register**: the Ask assistant as numbered ledger entries.
- **Interlocking table**: decisions as a table, guard and why it holds.
- **Edmondson tickets** (experience): one cream card ticket per role or
  phase on the green panel. Class band across the top (amber role, green
  independent, brass program), serial number, the period in a dating-press
  box, a tear line with notches, then role, organisation and summary. "Turn
  over" expands the highlights in place. The current role is a full-width
  season ticket and the first entry a full-width platform ticket; both open.
- **Timetable rows**: other lists (archive, achievements) are ruled rows, not
  card grids.

## Rules

- No eyebrow labels above headings, no gradient text, no glass, no glow, no
  one-sided accent bars on boxes.
- Radii: 14px for plates and panels, 6px for controls, round only for lamps
  and the portrait.
- Motion: one authored moment per view (the hero headline's entrance; the
  trains running in the Work diagrams).
  Content is visible by default; reveals only shift position slightly.
  Reduced motion skips the run entirely.
- Numbers on the page are real and static. Nothing counts up from zero.
