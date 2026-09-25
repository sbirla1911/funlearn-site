"use client";

import type { Example } from "@/lib/content";
import AnimatedLesson from "./AnimatedLesson";
import LessonLauncher from "./LessonLauncher";

const accentBadge: Record<string, string> = {
  sky: "bg-sky text-white",
  tangerine: "bg-tangerine text-white",
  grass: "bg-grass text-white",
  grape: "bg-grape text-white",
};
const interestText: Record<string, string> = {
  sky: "text-sky",
  tangerine: "text-tangerine",
  grass: "text-grass-dark",
  grape: "text-grape",
};

/** A playable lesson card (poster + play → opens the animated player). */
export default function LessonCard({ example }: { example: Example }) {
  return (
    <LessonLauncher lessonId={example.id}>
      {(open) => (
        <button
          onClick={open}
          className="group block w-full overflow-hidden rounded-4xl border border-black/[0.06] bg-white text-left shadow-card transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="relative">
            <div className="lesson-stage">
              <AnimatedLesson id={example.id} />
            </div>
            <span className="absolute inset-0 flex items-center justify-center bg-ink/5 transition group-hover:bg-ink/[0.12]">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5 text-ink" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
            <span className="absolute bottom-2 right-2 rounded-full bg-ink/80 px-2 py-0.5 text-xs font-semibold text-white">
              {example.duration}
            </span>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${accentBadge[example.accent]}`}>
                {example.subject}
              </span>
              <span className="text-xs font-semibold text-muted">{example.grade}</span>
            </div>
            <h3 className="mt-2 font-serif text-xl font-bold text-ink">{example.title}</h3>
            <p className="text-sm text-muted">
              for a kid who loves{" "}
              <span className={`font-serif italic ${interestText[example.accent]}`}>{example.interest}</span>
            </p>
          </div>
        </button>
      )}
    </LessonLauncher>
  );
}
