# Portfolio — Sandeep Reddy Bijavemula

A production-grade personal portfolio built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and Framer Motion. Dark-first, fully responsive, SEO- and accessibility-conscious, and deployable to Vercel with zero configuration.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the site runs without any of it
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm run start   # production build
npm run lint                     # ESLint (flat config)
npm run format                   # Prettier + Tailwind class sorting
```

## Where the content comes from

- **GitHub** ([sandeepreddy1606](https://github.com/sandeepreddy1606)) — repository metadata,
  languages, READMEs and commit dates. Fetched live at runtime for the Activity section.
- **LeetCode** ([BSReddy1606](https://leetcode.com/u/BSReddy1606/)) — solved counts, difficulty
  split, language breakdown, topic strengths, badges, streak and the university name. Also fetched
  live.
- **Supplied directly** — email, phone.

**LinkedIn could not be read.** `linkedin.com/in/sandeepreddy1606` returns `HTTP 999` to every
automated client, with and without a browser User-Agent — that is how LinkedIn blocks scraping.
Its certifications list and profile photo are therefore missing, and nothing was invented to fill
the gap. See [Fill in the gaps](#fill-in-the-gaps).

## Editing content

All copy lives in `src/constants/` as typed data. No component needs to be touched to update the
site.

| File                    | Contains                                                                |
| ----------------------- | ----------------------------------------------------------------------- |
| `site.ts`               | Name, role, email, phone, location, socials, nav, avatar + resume paths |
| `skills.ts`             | Skill categories, the tech-wall marquee, core strengths                 |
| `experience.ts`         | Career timeline (includes a commented template for new roles)           |
| `projects.ts`           | Project catalogue and the AI pipeline breakdowns                        |
| `achievements.ts`       | Achievements and testimonials                                           |
| `src/content/blog/*.md` | Blog posts — frontmatter + markdown                                     |

Types are enforced in `src/types/index.ts`, so a malformed entry is a build error rather than a
broken layout.

### Fill in the gaps

Three things need you, none of them require touching a component:

1. **`public/profile.jpg` — your photo.** Currently a generated monogram placeholder. LinkedIn
   blocks automated reads and both the GitHub and LeetCode avatars are default silhouettes, so no
   real photo could be fetched. Save your LinkedIn photo over this file (square, ~800×800) and it
   appears in the hero immediately — no code change. `ProfileImage` also falls back to a designed
   monogram if the file is ever missing.
2. **`public/resume.pdf`** — a placeholder PDF so the download button never 404s. Overwrite it.
3. **LinkedIn certifications** — unreadable for the reason above. Add them to `ACHIEVEMENTS` in
   `src/constants/achievements.ts` with `kind: "certification"`; the two LeetCode badges are already
   in there as a pattern to copy.

Optional, and worth doing:

- **Employment and education dates.** `src/constants/experience.ts` holds a timeline reconstructed
  from repository history plus the JPMorgan Chase Forage program (evidenced by three public repos).
  Vellore Institute of Technology, Chennai is referenced in the About copy and in JSON-LD
  `alumniOf`, but with no degree or dates — a commented template at the top of the file shows the
  shape for a real role or education entry.
- **Testimonials.** `TESTIMONIALS` in `achievements.ts` is intentionally empty and the section does
  not render. Add real, attributable quotes and it appears automatically.
- **Birthday.** Present on the LinkedIn contact card but deliberately left off the site — a public
  date of birth alongside a full name, phone and email is an identity-theft vector, not a portfolio
  credential. Add it to `SITE` if you disagree.

## Architecture

```
src/
├── app/              routes, API handler, sitemap/robots/manifest, OG + favicon generation
├── components/
│   ├── layout/       navbar, mobile drawer, footer, scroll progress, intro loader
│   ├── providers/    theme, Lenis, custom cursor, command palette
│   ├── sections/     one directory or file per page section
│   ├── seo/          JSON-LD structured data
│   └── ui/           primitives — button, badge, card, marquee, backgrounds, text effects
├── constants/        all site content as typed data
├── content/blog/     markdown posts
├── hooks/            scroll-spy, media queries, spotlight, clipboard, mounted
├── lib/              utils, motion variants, GitHub + LeetCode clients, blog parser, Zod schemas
├── styles/           long-form article typography
└── types/            shared type definitions
```

**Server components by default.** Only the pieces that need browser APIs are client components. The
Activity section fetches GitHub (`src/lib/github.ts`) and LeetCode (`src/lib/leetcode.ts`) on the
server — both marked `server-only` — behind two independent Suspense boundaries, so a slow or
failing LeetCode request cannot hold back the GitHub panel, and no token or request logic ever
reaches the browser.

**Code splitting.** The hero, about, skills and activity sections render immediately; everything below
is loaded through `next/dynamic` in `src/app/page.tsx`.

**Theming.** Tokens are defined three times in `globals.css` — a light base on `:root`, a dark
override under `prefers-color-scheme` guarded by `:not([data-theme="light"])`, and a dark override
under `[data-theme="dark"]` — so the toggle wins in both directions and no colour is defined only
inside a media query. `next-themes` writes the `data-theme` attribute.

## Features

Command palette (`⌘K` / `Ctrl+K`) · light/dark/system theming · Lenis smooth scroll with anchor
interception · scroll-spy nav indicator · scroll progress bar · desktop custom cursor · project
search and technology filtering · shared-layout case-study modals · live GitHub and LeetCode stats ·
generated project artwork and OG images · markdown blog · validated contact form with rate limiting
and a honeypot · 404, loading, route and global error boundaries · toast notifications.

**Accessibility.** Skip link, keyboard-navigable everywhere, ARIA labels on all icon-only controls,
visible focus rings, `aria-current` / `aria-pressed` state, and full `prefers-reduced-motion`
support — the cursor, particle field, magnetic buttons and intro loader all disable themselves.

**Performance.** The decorative particle field is a 2D canvas rather than WebGL, it pauses via
`IntersectionObserver` when scrolled away, and pointer tracking writes transforms inside a single
`requestAnimationFrame` instead of React state.

## Contact form

`POST /api/contact` validates with Zod, rate limits to 3 requests per minute per IP, drops honeypot
submissions silently, escapes all HTML, and sends through [Resend](https://resend.com).

Without `RESEND_API_KEY` it returns a `503` and a message telling visitors to email directly — the
form is never silently broken. The `to` address defaults to `SITE.email`.

## Ask assistant

`POST /api/ask` answers visitor questions about the work. The whole portfolio (built from the
constants in `src/constants`, see `src/lib/knowledge.ts`) goes into a cached system prompt — no
vector store, so retrieval can't pick the wrong chunk. Answers cite entries as `[[work:slug]]`,
which the client renders as links.

- `ANTHROPIC_API_KEY` — enables the assistant. Without it, the route answers from a deterministic
  keyword search and says so.
- `ASK_MODEL` — optional, defaults to `claude-opus-5-5`. `claude-haiku-5-5` is far cheaper and is
  usually enough for short Q&A over a fixed corpus.

Set a monthly spend limit on the API key: the in-route rate limit is per serverless instance and
caps bursts, not total spend.

## Fit check

The Proof section's fit check matches a pasted job description against evidence on the site
(`src/lib/fit.ts`). It runs in the browser and never uses a model, so it reports only what a
project or role actually mentions, and lists the requirements it could not find.

## Deployment

Push to GitHub, import into [Vercel](https://vercel.com/new), and add the environment variables from
`.env.example`. No build configuration required.

Set `NEXT_PUBLIC_SITE_URL` to the production origin before launch — canonical URLs, the sitemap,
Open Graph tags and JSON-LD all derive from it.

## Licence

Code is free to reuse. The written content, project descriptions and personal details are not.
