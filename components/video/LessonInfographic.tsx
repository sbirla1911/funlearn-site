"use client";

import type { ProjectileSolution } from "@/lib/video/types";
import { projectileCard } from "@/lib/video/concepts/projectile";
import ProjectileDiagram from "@/components/video/ProjectileDiagram";

const ALL = { arc: true, launch: true, gravity: true, height: true, range: true } as const;

/** A one-glance cheat-sheet for the lesson. Every number comes from the engine. */
export default function LessonInfographic({ solution, interest }: { solution: ProjectileSolution; interest: string }) {
  const d = solution.derived;
  const stats = [
    { label: "Launch speed", value: `${solution.inputs.v} m/s`, accent: "tangerine" },
    { label: "Launch angle", value: `${solution.inputs.theta}°`, accent: "tangerine" },
    { label: "Distance (range)", value: `${d.range} m`, accent: "ink" },
    { label: "Max height", value: `${d.hMax} m`, accent: "grape" },
    { label: "Time in the air", value: `${d.tFlight} s`, accent: "sky" },
  ];
  const valueColor: Record<string, string> = {
    tangerine: "text-tangerine",
    grape: "text-grape",
    sky: "text-sky",
    ink: "text-ink",
  };

  return (
    <section className="rounded-4xl border border-black/[0.06] bg-white p-6 shadow-card">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grape-soft text-lg">📊</span>
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">The infographic</h2>
          <p className="text-sm text-muted">Projectile motion through {interest.toLowerCase()} — the whole idea on one page.</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-black/5">
        <ProjectileDiagram solution={solution} reveal={ALL} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-black/5 bg-paper px-3 py-3 text-center">
            <p className={`font-serif text-xl font-black ${valueColor[s.accent]}`}>{s.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl bg-grass-soft/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-grass-dark">The big idea</p>
          <p className="mt-1 text-sm text-ink/85">
            The sideways speed stays the same the whole time, while gravity steadily slows the ball on
            the way up and speeds it up on the way down. That tug-of-war is what makes the arc.
          </p>
        </div>
        <div className="rounded-2xl bg-sky-soft/60 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-sky">How it&apos;s calculated</p>
          <ul className="mt-1 space-y-1 font-mono text-[13px] text-ink">
            <li>{projectileCard.equations.range}</li>
            <li>{projectileCard.equations.hMax}</li>
            <li>{projectileCard.equations.tFlight}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
