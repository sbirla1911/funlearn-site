# FUnlearn — Landing Site

A single-page marketing/vision site for **FUnlearn**, an AI tool that generates short,
personalized explainer videos for hard K-12 concepts (math, physics, chemistry) — teaching each
one through an analogy pulled from a student's own interests (football → projectile motion,
cooking → stoichiometry, and so on).

This site is purely presentational: no backend, no API keys, no real AI. The interactive analogy
demo uses hand-authored content in [`lib/analogies.ts`](lib/analogies.ts) to illustrate the idea.

## Stack

- Next.js (App Router) with **static export** (`output: 'export'`)
- Tailwind CSS + TypeScript
- Deployed to GitHub Pages via GitHub Actions

## Local development

```bash
npm install
npm run dev      # http://localhost:3200
```

## Build (static export)

```bash
npm run build    # outputs a static site to ./out
```

## Deploy (GitHub Pages)

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds the static export and publishes it to GitHub Pages.

One-time setup on GitHub:

1. Create a repo named **`funlearn-site`** under the `sbirla1911` account.
2. In **Settings → Pages**, set **Source = GitHub Actions**.
3. Push to `main`. The site goes live at
   `https://sbirla1911.github.io/funlearn-site/`.

> The repo name matters: it drives `basePath`/`assetPrefix` in
> [`next.config.mjs`](next.config.mjs). If you rename the repo, update those values to match.

## Pages

Five routes:

- **`/`** — landing: hero with an interactive video preview (click an interest to swap the
  "Now playing" concept; press play to watch), the "four kids, four ways in" example grid,
  and the "learn / play / remember" band.
- **`/get-started`** — "Make your profile": interactive form + a playable first-lesson peek.
- **`/dashboard`** — Maya's home: communities + friends sidebar, a "Create something new" panel
  (Make my lesson / Snap the homework open a lesson), and playable saved-content rows.
- **`/lessons`** — a library of the example animated lessons; press play on any.
- **`/community`** — a sample "Football + Physics" community: banner, members, shared lessons.

Flow: **Get started → `/get-started` → Start learning → `/dashboard`**; **Log in → `/dashboard`**
directly (no auth — this is a showcase). Pre-loaded with illustrative content.

## Illustrations & animated lessons

- **Static artwork** comes from the offline **unDraw** set (`react-undraw-illustrations`, MIT),
  recoloured to the FUNlearn palette via each illustration's `primaryColor`. See
  [`components/Art.tsx`](components/Art.tsx).
- **The "videos" are real animated SVG scenes** ([`components/AnimatedLesson.tsx`](components/AnimatedLesson.tsx)),
  driven by CSS keyframes in [`app/globals.css`](app/globals.css). They play in a modal
  ([`components/LessonLauncher.tsx`](components/LessonLauncher.tsx)) with play/replay + a progress bar.

## Structure

```
app/            layout, page.tsx (landing), get-started/, dashboard/, lessons/, community/, globals.css
components/     Header, Footer, Logo, Avatar, HeroPreview, ExampleCard,
                Art (unDraw wrappers), AnimatedLesson, LessonLauncher, LessonCard,
                Reveal, Illustrations (decorative inline SVG)
lib/            content.ts — hand-authored example/showcase data
types/          undraw.d.ts — deep-import declarations for the unDraw package
public/         .nojekyll (keeps Pages from processing _next/)
```
