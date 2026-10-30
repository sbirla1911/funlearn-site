/** Client-safe catalog of the real generated lessons + a tiny request resolver.
 *  Keeps the showcase pages in sync with what actually exists in public/lessons. */

export type Accent = "sky" | "grape" | "grass" | "tangerine";

export type CatalogLesson = {
  cacheKey: string;
  title: string;
  subject: string;
  interest: string;
  grade: number;
  blurb: string;
  emoji: string;
  accent: Accent;
};

export const LESSONS: CatalogLesson[] = [
  {
    cacheKey: "projectile__football__g9",
    title: "Projectile motion",
    subject: "Physics",
    interest: "Football",
    grade: 9,
    blurb: "How a free kick arcs up and into the goal.",
    emoji: "⚽",
    accent: "sky",
  },
  {
    cacheKey: "projectile__basketball__g9",
    title: "Projectile motion",
    subject: "Physics",
    interest: "Basketball",
    grade: 9,
    blurb: "The arc of a jump shot to the hoop.",
    emoji: "🏀",
    accent: "grape",
  },
  {
    cacheKey: "projectile__football__g6",
    title: "Projectile motion",
    subject: "Physics",
    interest: "Football",
    grade: 6,
    blurb: "The kick, explained nice and simply.",
    emoji: "⚽",
    accent: "grass",
  },
];

/** Link to the watch player for a lesson (basePath is added by next/link). */
export const watchHref = (cacheKey: string) => `/watch/?lesson=${cacheKey}`;

/** Turn a free-text "make my lesson" request into the closest real lesson. */
export function resolveLesson(query: string): CatalogLesson {
  const q = (query || "").toLowerCase();
  const interest = /basket/.test(q) ? "basketball" : "football";
  const grade = /grade\s*[567]|year\s*[567]|\b[567]th\b/.test(q) ? 6 : 9;
  const want = `projectile__${interest}__g${grade}`;
  return LESSONS.find((l) => l.cacheKey === want) ?? LESSONS.find((l) => l.cacheKey === `projectile__${interest}__g9`) ?? LESSONS[0];
}
