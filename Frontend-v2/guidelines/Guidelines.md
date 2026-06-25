# Guidelines — "AI দিয়ে ফ্রিল্যান্সিং" ebook landing page

## Stance
High-converting, mobile-first Bangla sales page. Modern, trustworthy, premium-but-approachable. Full commitment to a dark-navy ground with vibrant green (primary action) and warm orange (urgency/accent). No SaaS-gray hedging.

## Palette (tokens in `src/styles/theme.css`)
- `--navy` #0A1628 — dark section ground
- `--navy-soft` #0F2036 — raised navy surfaces
- `--green` #00D084 / `--green-deep` #00A86B — primary CTAs, checks, success
- `--orange` #FF6B35 — urgency, badges, ratings (use sparingly)
- White / `#F5F5F5` (`--secondary`) — light sections
Sections alternate navy ↔ light to create rhythm.

## Typography
- Display (headings): **Anek Bangla** (`--font-display`), weights 700–800.
- Body: **Hind Siliguri** (`--font-body`), excellent Bangla readability.
- Set font sizes/weights via inline `style` for display headings (theme keeps Tailwind size classes off by default).

## Layout & craft
- Section padding `py-12` mobile / `py-20` desktop.
- All CTAs ≥56px tall (thumb-friendly) via `CtaButton`.
- One `~md` breakpoint for grid collapse.
- Sticky mobile CTA bar (`StickyCta`) visible only below `md`.
- Micro-interactions: hover lift + green glow on CTAs, accordion expand, floating book cover.

## Components
All sections live in `src/app/components/landing/`. Shared bits (`CtaButton`, `Pill`, `Section`, `BookCover`) are in `primitives.tsx` — reuse these instead of re-styling.

## Content
All copy is real Bengali from the brief. Bengali numerals throughout (use the `toBn` pattern for dynamic numbers like the countdown). No lorem ipsum.
