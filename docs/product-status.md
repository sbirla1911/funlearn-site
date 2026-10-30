# FUNlearn product — build status

Companion to [video-vision.md](./video-vision.md) and [video-pipeline-spec.md](./video-pipeline-spec.md).
Built autonomously through Phases A–D. Everything is **local** — nothing committed or deployed yet.

## What's built and working ✅

| Piece | Where | Status |
|---|---|---|
| Deterministic physics engine (truth) | `lib/video/engine/projectile.ts` | ✅ |
| Concept card (vetted truth) | `lib/video/concepts/projectile.ts` | ✅ |
| Animated diagram / overlay (truth-on-art) | `components/video/ProjectileDiagram.tsx`, `lib/video/projectile-geometry.ts` | ✅ |
| Storyboard (grade- **and** interest-aware) | `lib/video/storyboards/projectile.ts` | ✅ |
| Provider interface + Gemini image + TTS | `lib/video/providers/*` | ✅ built |
| Orchestrator (engine→storyboard→assets→manifest) | `lib/video/generate.ts` | ✅ |
| Generator CLI (throttle, retry, relink) | `scripts/generate-lesson.ts` | ✅ |
| Cache (folder keyed by concept+interest+grade) | `public/lessons/<key>/` + `index.json` | ✅ |
| Watch page + lesson picker + audio playback | `app/watch/page.tsx`, `components/video/StoryPlayer.tsx` | ✅ |
| Grade dial (reading level + equations) | storyboard + player | ✅ proven |
| Interest variants (football / basketball) | storyboard + engine | ✅ proven |
| Internal labs | `/lab` (engine), `/lab/story` (storyboard) | ✅ |
| Static export builds & deploys | `npm run build` → `out/` | ✅ |

**Generated lessons** (in `public/lessons/`) — all now with **real AI stills + full Gemini voice** (billing enabled 2026-10-30):
- `projectile__football__g9` — 6 stills + 6 voice clips, grade-9 (with equations).
- `projectile__basketball__g9` — own physics (R=6.85 m, H=3.22 m), purple-kit character, "shot/hands" wording.
- `projectile__football__g6` — younger cut (simpler narration, no equations).

**Player layout:** motion beats show the full-bleed AI still; teach beats show the precise diagram (top caption) with the beat's still as a corner thumbnail. (Pinning the arrows *onto* the still — aligned to the drawn ball — is the next art refinement; needs the image generated with a known ball position.)

## Blockers — RESOLVED ✅
Image billing is on, so both the image and voice limits are lifted. Image gen works (1344×768, 16:9),
voice works at full rate. Re-run the generator any time with `npx tsx scripts/generate-lesson.ts
--interest <x> --grade <n>`.

## How to generate / regenerate lessons

```bash
# full lesson (voice + stills) — needs quota/billing available
npx tsx scripts/generate-lesson.ts --interest football --grade 9

# voice only (skip stills until billing is on)
npx tsx scripts/generate-lesson.ts --interest football --grade 9 --no-image

# structure only, instant, no API calls (good for new variants)
npx tsx scripts/generate-lesson.ts --interest basketball --grade 9 --no-audio --no-image

# rebuild a manifest from audio/images already on disk (no API calls)
npx tsx scripts/generate-lesson.ts --interest football --grade 9 --relink
```
Flags: `--voice Leda`, `--v 20 --theta 55` (override inputs), `--throttle 21000` (ms between TTS calls).

## What's left for you when you're back
1. **Taste pass** — watch `/watch`, react to the voice (voice name is `Leda`; easy to swap), pacing, captions, diagram style.
2. **Enable image billing** (or hand me a billed key) → I regenerate with real stills.
3. **Approve deploy** — it builds static and ships to the existing GitHub Pages infra. Decide whether this lives in `funlearn-site` or a split-out product repo.

## Known follow-ups (noted, not blocking)
- Server-side on-demand generation (vs the current build-time generator) when you want instant fresh lessons — the orchestrator is already framework-agnostic for this.
- More concepts (only projectile has an engine + card today).
- Character consistency across stills (fixed description is in place; a seed lock can be added once image gen runs).
