"use client";

import type { CSSProperties } from "react";
import type { ProjectileSolution, DiagramReveal } from "@/lib/video/types";
import { layoutProjectile, VB, GROUND_Y } from "@/lib/video/projectile-geometry";

/**
 * Presentational projectile diagram (the TRUTH-on-ART overlay). Annotations are
 * revealed progressively via the `reveal` flags so the story player can build the
 * explanation up scene by scene. No internal timeline — the caller drives it.
 */

export type Reveal = DiagramReveal;

const ARROW = (tip: { x: number; y: number }, dir: { x: number; y: number }, size: number) => {
  const perp = { x: -dir.y, y: dir.x };
  const base = { x: tip.x - dir.x * size, y: tip.y - dir.y * size };
  return `${tip.x},${tip.y} ${base.x + perp.x * size * 0.6},${base.y + perp.y * size * 0.6} ${
    base.x - perp.x * size * 0.6
  },${base.y - perp.y * size * 0.6}`;
};

const fade = (on?: boolean): CSSProperties => ({
  opacity: on ? 1 : 0,
  transition: "opacity 0.6s ease",
});

export default function ProjectileDiagram({
  solution,
  reveal = {},
  backdrop = true,
}: {
  solution: ProjectileSolution;
  reveal?: Reveal;
  /** Draw the sky/ground backdrop. Set false to overlay annotations on a real still. */
  backdrop?: boolean;
}) {
  const L = layoutProjectile(solution);

  return (
    <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img" aria-label="Projectile motion diagram">
      {/* sky + ground (omitted when overlaying a generated still) */}
      {backdrop && (
        <>
          <rect x="0" y="0" width={VB.w} height={GROUND_Y} fill="#E8F2FC" opacity="0.5" />
          <rect x="0" y={GROUND_Y} width={VB.w} height={VB.h - GROUND_Y} fill="#E4F5EA" />
          <line x1="0" y1={GROUND_Y} x2={VB.w} y2={GROUND_Y} stroke="#46B06A" strokeWidth="3" />
        </>
      )}

      {/* range */}
      <g style={fade(reveal.range)}>
        <line x1={L.origin.x} y1={GROUND_Y + 22} x2={L.landing.x} y2={GROUND_Y + 22} stroke="#5B6673" strokeWidth="1.5" strokeDasharray="5 5" />
        <line x1={L.origin.x} y1={GROUND_Y + 16} x2={L.origin.x} y2={GROUND_Y + 28} stroke="#5B6673" strokeWidth="1.5" />
        <line x1={L.landing.x} y1={GROUND_Y + 16} x2={L.landing.x} y2={GROUND_Y + 28} stroke="#5B6673" strokeWidth="1.5" />
        <text x={L.labels.rangeMidX} y={GROUND_Y + 42} textAnchor="middle" className="fill-ink" fontSize="15" fontWeight="700">
          {L.labels.range}
        </text>
      </g>

      {/* height */}
      <g style={fade(reveal.height)}>
        <line x1={L.apex.x} y1={L.apex.y} x2={L.apex.x} y2={GROUND_Y} stroke="#8B7FE8" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x={L.apex.x + 10} y={L.labels.hMidY} className="fill-grape" fontSize="15" fontWeight="700">
          {L.labels.hMax}
        </text>
      </g>

      {/* trajectory (draws when revealed) */}
      <path
        d={L.pathD}
        fill="none"
        stroke="#4E9BE6"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: reveal.arc ? 0 : 1,
          transition: "stroke-dashoffset 1.6s ease, opacity 0.4s ease",
          opacity: reveal.arc ? 1 : 0,
        }}
      />

      {/* launch vector + angle */}
      <g style={fade(reveal.launch)}>
        <path d={L.angleArcD} fill="none" stroke="#F0994A" strokeWidth="2.5" />
        <text x={L.origin.x + 56} y={GROUND_Y - 14} className="fill-tangerine" fontSize="15" fontWeight="700">
          {L.labels.theta}
        </text>
        <line x1={L.origin.x} y1={L.origin.y} x2={L.launchVector.tip.x} y2={L.launchVector.tip.y} stroke="#F0994A" strokeWidth="4" strokeLinecap="round" />
        <polygon points={ARROW(L.launchVector.tip, L.launchVector.dir, 13)} fill="#F0994A" />
        <text x={L.launchVector.tip.x + 8} y={L.launchVector.tip.y - 6} className="fill-tangerine" fontSize="15" fontWeight="700">
          {L.labels.v}
        </text>
      </g>

      {/* gravity at apex */}
      <g style={fade(reveal.gravity)}>
        <line x1={L.apex.x} y1={L.apex.y} x2={L.gravityTip.x} y2={L.gravityTip.y} stroke="#8B7FE8" strokeWidth="4" strokeLinecap="round" />
        <polygon points={ARROW(L.gravityTip, { x: 0, y: 1 }, 13)} fill="#8B7FE8" />
        <text x={L.gravityTip.x + 10} y={L.gravityTip.y} className="fill-grape" fontSize="15" fontWeight="700">g</text>
      </g>

      {/* ball */}
      <circle cx={L.origin.x} cy={L.origin.y} r="4" fill="#1F2A37" />
      {reveal.ball && (
        <circle
          r="11"
          fill="#1F2A37"
          style={{ offsetPath: `path('${L.pathD}')`, animation: "lp-ball 2s cubic-bezier(.4,0,.7,1) forwards" } as CSSProperties}
        />
      )}
    </svg>
  );
}
