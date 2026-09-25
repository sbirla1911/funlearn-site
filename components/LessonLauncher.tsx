"use client";

import { useEffect, useState, type ReactNode } from "react";
import AnimatedLesson from "./AnimatedLesson";
import { examples } from "@/lib/content";

const DURATION = 7.6; // seconds — matches the caption track in AnimatedLesson

const accentText: Record<string, string> = {
  sky: "bg-sky text-white",
  tangerine: "bg-tangerine text-white",
  grass: "bg-grass text-white",
  grape: "bg-grape text-white",
};

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function LessonModal({ lessonId, onClose }: { lessonId: string; onClose: () => void }) {
  const ex = examples.find((e) => e.id === lessonId) ?? examples[0];
  const [started, setStarted] = useState(false);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const play = () => {
    setStarted(true);
    setRunKey((k) => k + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${ex.title} lesson`}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-4xl bg-white shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${accentText[ex.accent]}`}>
              {ex.subject}
            </span>
            <p className="font-serif text-lg font-bold text-ink">{ex.title}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-black/5 hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* stage */}
        <div className="relative">
          <div className={`lesson-stage ${started ? "is-playing" : ""}`}>
            <AnimatedLesson key={runKey} id={lessonId} />
          </div>
          {!started && (
            <button
              onClick={play}
              aria-label="Play lesson"
              className="absolute inset-0 flex items-center justify-center bg-ink/10 transition hover:bg-ink/[0.16]"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105">
                <PlayIcon className="h-7 w-7 translate-x-0.5 text-ink" />
              </span>
            </button>
          )}
        </div>

        {/* controls */}
        <div className="flex items-center gap-3 bg-ink px-5 py-3.5 text-white">
          <button
            onClick={play}
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/95 text-ink transition hover:scale-105"
            aria-label={started ? "Replay" : "Play"}
          >
            {started ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <PlayIcon className="h-4 w-4 translate-x-px" />
            )}
          </button>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/20">
            <span
              key={runKey}
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white/85"
              style={{
                transform: started ? undefined : "scaleX(0)",
                animation: started ? `lp-grow-x ${DURATION}s linear forwards` : "none",
              }}
            />
          </span>
          <span className="text-xs font-medium text-white/70">
            {started ? "playing" : `0:0${Math.round(DURATION)}`.slice(0, 4)}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Render-prop launcher: renders a trigger and, on open, the animated lesson
 * player. Use anywhere a video should play.
 *   <LessonLauncher lessonId="projectile">{(open) => <button onClick={open}>…</button>}</LessonLauncher>
 */
export default function LessonLauncher({
  lessonId,
  children,
}: {
  lessonId: string;
  children: (open: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {children(() => setOpen(true))}
      {open && <LessonModal lessonId={lessonId} onClose={() => setOpen(false)} />}
    </>
  );
}
