"use client";

import { useState } from "react";
import { examples, heroInterests } from "@/lib/content";
import { sampleAsset } from "@/lib/video/asset";
import LessonLauncher from "./LessonLauncher";

const annotations: Record<string, string> = {
  projectile: "the arc is the physics",
  stoichiometry: "keep the ratio",
  photosynthesis: "light becomes energy",
  exponential: "double every level",
};

export default function HeroPreview() {
  const [exampleId, setExampleId] = useState("projectile");
  const ex = examples.find((e) => e.id === exampleId) ?? examples[0];

  return (
    <div className="relative">
      {/* taped sticky note */}
      <div className="absolute -right-3 -top-5 z-20 rotate-6">
        <div className="mx-auto mb-[-10px] h-4 w-16 rounded-sm bg-sunny/70 shadow-sm" />
        <div className="rounded-xl bg-sunny px-4 py-2 text-center font-hand text-xl font-bold leading-tight text-ink shadow-card">
          K–12
          <br />
          math + science
        </div>
      </div>

      <LessonLauncher lessonId={ex.id}>
        {(open) => (
          <>
            {/* video card / poster */}
            <div className="overflow-hidden rounded-[26px] border-2 border-ink/10 bg-white shadow-soft">
              <button
                onClick={open}
                aria-label={`Play the ${ex.title} lesson`}
                className="group relative block w-full text-left"
              >
                {/* polished sample still = the poster */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sampleAsset(ex.id)} alt={ex.title} className="aspect-video w-full object-cover" />
                {/* handwriting annotation */}
                <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rotate-[-4deg] font-hand text-2xl font-bold text-ink/85">
                  {annotations[ex.id]}
                </span>
                {/* play overlay */}
                <span className="absolute inset-0 flex items-center justify-center bg-ink/5 transition group-hover:bg-ink/[0.12]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition group-hover:scale-105">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5 text-ink" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </button>

              {/* control bar */}
              <button onClick={open} className="flex w-full items-center gap-3 bg-ink px-4 py-3 text-left text-white">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-white/90 text-ink">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-px" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-xs font-medium tabular-nums text-white/80">0:00 / {ex.duration}</span>
                <span className="relative h-1.5 flex-1 rounded-full bg-white/20">
                  <span className="absolute inset-y-0 left-0 w-[6%] rounded-full bg-white/80" />
                </span>
                <span className="text-xs font-semibold text-white/80">Watch ▸</span>
              </button>
            </div>
          </>
        )}
      </LessonLauncher>

      {/* now playing + interest chips */}
      <p className="mt-4 text-sm text-muted">
        <span className="text-muted/80">Now playing</span>{" "}
        <span className="font-semibold text-ink">{ex.title}</span>
        <span className="text-muted"> · {ex.subject.toLowerCase()}</span>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted">for a kid who loves:</span>
        {heroInterests.map((i) => {
          const active = i.exampleId === exampleId;
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => setExampleId(i.exampleId)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                active
                  ? "border-grass bg-grass-soft text-grass-dark"
                  : "border-black/10 bg-white text-ink/70 hover:border-grass/50"
              }`}
            >
              <span aria-hidden>{i.emoji}</span>
              {i.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
