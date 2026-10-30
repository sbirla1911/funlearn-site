# FUNlearn — Video Vision

> Status: first pass captured from Saumya's spoken vision (2026-10-30). Items marked **OPEN** still
> need a decision before/while we build the pipeline.

---

## 0. One-sentence pitch of a FUNlearn video
A short, aesthetic, narrated "animated-slideshow" that teaches one hard concept by playing it out
inside the kid's own interest — gently animating the scene, then **pausing on beautiful generated
stills** where arrows, diagrams and on-screen text (plus a friendly voiceover) explain each sub-idea
exactly as it happens.

---

## 1. Medium
**Illustrated narrated slideshow — "motion → freeze-frame → motion".**

The base is gentle motion (the kick, the ball arcing). At each teaching moment it **pauses and zooms
onto a generated still** annotated with arrows/diagrams/text while the voiceover explains, then
resumes motion. Not fully text-to-video (too hard to keep accurate), not a static slideshow — a
controlled hybrid that *feels* animated.

**Visual style:** stills should feel close to a polished animated film — aesthetic, attractive to a
young kid, and using the **same color palette as the website** (paper/ink + grass/sunny/sky/tangerine/
grape pastels, Fraunces/Inter type feel).

---

## 2. Anatomy of a video (the repeatable skeleton)
A repeating cycle, driven by the concept rather than a fixed beat count:

1. **Hook (motion):** open inside the kid's world — e.g. a kid kicks a football in slow motion.
2. **Teach-pause (still + voiceover + text):** zoom onto the key moment, freeze on a generated still,
   overlay the diagram/arrows, and explain the sub-concept.
3. **Resume (motion):** play the consequence of what was just explained.
4. **Repeat 2–3** at every point where a new concept appears along the way.
5. **Grand recap still:** at the end, one full annotated diagram of the whole event tying all the
   sub-concepts together.
6. **Check it landed:** a question / recap / mini-challenge.

The number of teach-pauses flexes with the concept — however many it takes to teach it well.

---

## 3. Length & pacing
**Length is whatever it takes to explain the concept well** — no fixed ceiling. Pedagogy drives
duration, not a target runtime. (Pacing/energy: calm, clear, kid-friendly; younger = slower, more
repetition.)

> Soft upper bound per age can be tuned later from real examples.

---

## 4. How deep does personalization go?
Two independent dials:
- **Interest** drives the whole **scene and the examples** (football pitch vs. skate ramp vs. kitchen).
- **Grade/age** is a **depth dial** applied at render time — reading level of narration & text, how
  much math is shown (qualitative arrows → full equations with trig), which teach-pauses appear, and
  pacing. The physics engine always computes the full truth; grade only controls how much is revealed.

**Stays identical regardless of either dial:** the underlying concept and its correct physics/values.

---

## 5. Accuracy guardrails — **top-priority KPI**
Accuracy is of utmost importance and is treated as a primary success metric.

**DECIDED — split art from truth.** The **numbers, angles, distances, max-height and diagram geometry
are computed by a deterministic physics/math engine**, never drawn freehand by the image model. The
image model renders the *scene*; a code layer draws the *correct* arrows, values and curve on top. The
science stays exact even though the art is AI-generated.
- Source of truth per concept: a vetted **"concept card"** per topic (formulas + correct values + the
  teach-pause list). _Exact schema TBD in the spec._
- Must-never-ship failure: a video that teaches a real misconception or a wrong calculation.
- Pre-watch check: _OPEN — human review for v1? automated check against the concept card?_

---

## 6. Fresh vs. consistent
**Reuse when the kids are close enough; generate fresh otherwise.**
- A *very similar* kid (similar interest) asking the *same topic* → serve the same cached video.
- Different interest / different topic / unrelated → generate fresh.

**DECIDED — cache key = `concept + interest + grade band`.** When all three match, serve the cached
video; any difference generates fresh.

---

## 7. Delivery expectation
**Short wait** (~a nice ~1-minute loading moment is acceptable; not instant, not "come back later").

---

## 8. The three outputs (video / infographic / game)
OPEN. Working assumption: **video ships first** (this doc is about it); infographic/game follow.
_Confirm._

---

## 9. Reference case — Projectile motion × football (end to end)
- **Concept:** projectile motion (force, launch angle, trajectory, range, max height)
- **Interest:** football
- **Grade / age:** flexible — the same concept renders simpler or more advanced per the §4 grade dial.

**The video, start to finish:**
1. **Open (motion):** a kid — boy or girl — strikes a football in **slow motion**.
2. **Teach-pause #1 — the kick:** zoom onto the legs; freeze on a generated still of the **foot
   contacting the ball**. Voiceover + on-screen text explain **force** (and the relevant ideas at the
   moment of contact).
3. **Resume:** the ball moves off, pushed by that force, rising into the air.
4. **Teach-pause #2 — mid-air:** pause and focus on the ball in flight; generated still showing the
   **forces and their directions, and the launch angle** — and how the projectile's path is
   calculated. Voiceover + text.
5. **Continue the journey:** keep playing the arc, pausing/zooming to introduce each new concept
   wherever it naturally arises along the ball's path.
6. **Teach-pause #3 — landing / grand recap:** the instant the ball hits the ground, pause on a
   generated still of the **entire trajectory** — the horizontal **distance** from the feet to the
   landing point, the **maximum height**, the full path drawn with **arrows**. Explain how distance,
   launch angle and max height are calculated from the force and the angle of the kick, with a full
   **projectile-motion diagram**, voiceover and text.
7. **Check it landed:** a closing question / recap / mini-challenge.

---

## 10. Taste / tone references
OPEN — links/names of videos or creators whose feel to match (and to avoid).

---

## 11. Open questions to resolve before/while building
Resolved: grade dial (§4), split art/truth (§5), cache key (§6), character-consistency acceptable if
"slightly different" (§9 note). Still open:
- §3 soft length cap per age — tune from real examples.
- §5 concept-card schema + the pre-watch accuracy check (human vs. automated for v1).
- §8 confirm video ships first (infographic/game later).
- Character consistency is acceptable loose for v1, but we'll keep the kid "close enough" via a fixed
  character description + seed reused across stills.
