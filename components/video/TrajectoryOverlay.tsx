"use client";

import { useEffect, useState } from "react";
import type { ProjectileSolution } from "@/lib/video/types";

/**
 * The TRUTH-on-ART overlay: given a deterministic ProjectileSolution, draw the
 * correct trajectory, launch vector, angle, gravity and measurements as animated
 * SVG. Every number/arrow comes from the engine — nothing here is guessed.
 *
 * Reuses the house animation classes (.is-playing / .anim-* / lp-* keyframes).
 */

const VB = { w: 760, h: 440 };
const PAD = { left: 74, right: 74, top: 54, bottom: 66 };
const GROUND_Y = VB.h - PAD.bottom;
const ORIGIN_X = PAD.left;
const USABLE_W = VB.w - PAD.left - PAD.right;
const USABLE_H = GROUND_Y - PAD.top;

type Props = {
  solution: ProjectileSolution;
  /** Show the quantitative equations (higher grades). */
  showEquations?: boolean;
  equations?: string[];
};

export default function TrajectoryOverlay({ solution, showEquations = false, equations = [] }: Props) {
  const [playing, setPlaying] = useState(false);
  // Remount on replay so the CSS animations restart cleanly.
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPlaying(true), 250);
    return () => clearTimeout(t);
  }, []);

  function replay() {
    setPlaying(false);
    setRunId((n) => n + 1);
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
  }

  // Uniform scale keeps the geometry (and the angle) truthful.
  const { range, hMax } = solution.derived;
  const scale = Math.min(USABLE_W / Math.max(range, 0.01), USABLE_H / Math.max(hMax, 0.01));

  // Round to 2 dp so server and client render byte-identical SVG (no hydration drift).
  const r = (n: number) => Math.round(n * 100) / 100;
  const sx = (xm: number) => r(ORIGIN_X + xm * scale);
  const sy = (ym: number) => r(GROUND_Y - ym * scale);

  const pathD =
    solution.arc
      .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
      .join(" ");

  const apex = solution.markers.apex;
  const landing = solution.markers.landing;
  const rad = (solution.inputs.theta * Math.PI) / 180;

  // Launch velocity vector (fixed on-screen length for legibility).
  const vLen = 96;
  const vTip = { x: r(ORIGIN_X + vLen * Math.cos(rad)), y: r(GROUND_Y - vLen * Math.sin(rad)) };
  const vDir = { x: r(Math.cos(rad)), y: r(-Math.sin(rad)) };

  // Angle arc from the ground up to the launch vector.
  const arcR = 46;
  const angleArc = `M ${ORIGIN_X + arcR} ${GROUND_Y} A ${arcR} ${arcR} 0 0 0 ${r(
    ORIGIN_X + arcR * Math.cos(rad)
  )} ${r(GROUND_Y - arcR * Math.sin(rad))}`;

  // Gravity vector at the apex (straight down).
  const gTip = { x: sx(apex.x), y: r(sy(apex.y) + 58) };

  return (
    <div>
      <div
        key={runId}
        className={`lesson-stage relative overflow-hidden rounded-4xl border border-black/5 bg-paper shadow-card ${
          playing ? "is-playing" : ""
        }`}
      >
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full" role="img" aria-label="Projectile motion diagram">
          {/* soft sky wash */}
          <rect x="0" y="0" width={VB.w} height={GROUND_Y} fill="#E8F2FC" opacity="0.5" />
          {/* ground */}
          <rect x="0" y={GROUND_Y} width={VB.w} height={VB.h - GROUND_Y} fill="#E4F5EA" />
          <line x1="0" y1={GROUND_Y} x2={VB.w} y2={GROUND_Y} stroke="#46B06A" strokeWidth="3" />

          {/* ── Range measurement (along ground) ── */}
          <g className="anim anim-fade" style={{ animationDelay: "2.9s" }}>
            <line x1={ORIGIN_X} y1={GROUND_Y + 22} x2={sx(landing.x)} y2={GROUND_Y + 22} stroke="#5B6673" strokeWidth="1.5" strokeDasharray="5 5" />
            <TickV x={ORIGIN_X} y={GROUND_Y + 22} />
            <TickV x={sx(landing.x)} y={GROUND_Y + 22} />
            <text x={r((ORIGIN_X + sx(landing.x)) / 2)} y={GROUND_Y + 42} textAnchor="middle" className="fill-ink" fontSize="15" fontWeight="700">
              R = {range} m
            </text>
          </g>

          {/* ── Max-height measurement ── */}
          <g className="anim anim-fade" style={{ animationDelay: "2.4s" }}>
            <line x1={sx(apex.x)} y1={sy(apex.y)} x2={sx(apex.x)} y2={GROUND_Y} stroke="#8B7FE8" strokeWidth="1.5" strokeDasharray="5 5" />
            <text x={sx(apex.x) + 10} y={r((sy(apex.y) + GROUND_Y) / 2)} className="fill-grape" fontSize="15" fontWeight="700">
              H = {hMax} m
            </text>
          </g>

          {/* ── Trajectory curve (draws in) ── */}
          <path
            d={pathD}
            fill="none"
            stroke="#4E9BE6"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength={1}
            className="anim anim-draw"
            style={{ strokeDasharray: 1, strokeDashoffset: 1, animationDuration: "2.2s" }}
          />

          {/* ── Launch angle arc + label ── */}
          <g className="anim anim-fade" style={{ animationDelay: "0.3s" }}>
            <path d={angleArc} fill="none" stroke="#F0994A" strokeWidth="2.5" />
            <text x={ORIGIN_X + arcR + 10} y={GROUND_Y - 14} className="fill-tangerine" fontSize="15" fontWeight="700">
              θ = {solution.inputs.theta}°
            </text>
          </g>

          {/* ── Launch velocity vector ── */}
          <g className="anim anim-fade" style={{ animationDelay: "0.3s" }}>
            <line x1={ORIGIN_X} y1={GROUND_Y} x2={vTip.x} y2={vTip.y} stroke="#F0994A" strokeWidth="4" strokeLinecap="round" />
            <ArrowHead tip={vTip} dir={vDir} size={13} color="#F0994A" />
            <text x={vTip.x + 8} y={vTip.y - 6} className="fill-tangerine" fontSize="15" fontWeight="700">
              v = {solution.inputs.v} m/s
            </text>
          </g>

          {/* ── Gravity vector at apex ── */}
          <g className="anim anim-fade" style={{ animationDelay: "1.9s" }}>
            <line x1={sx(apex.x)} y1={sy(apex.y)} x2={gTip.x} y2={gTip.y} stroke="#8B7FE8" strokeWidth="4" strokeLinecap="round" />
            <ArrowHead tip={gTip} dir={{ x: 0, y: 1 }} size={13} color="#8B7FE8" />
            <text x={gTip.x + 10} y={gTip.y} className="fill-grape" fontSize="15" fontWeight="700">
              g
            </text>
          </g>

          {/* ── The ball, travelling the real arc ── */}
          <circle
            r="11"
            fill="#1F2A37"
            className="anim anim-ball"
            style={{ offsetPath: `path('${pathD}')`, offsetRotate: "0deg", animationDuration: "2.2s" } as React.CSSProperties}
          />
          <circle cx={ORIGIN_X} cy={GROUND_Y} r="4" fill="#1F2A37" />
        </svg>

        {/* replay */}
        <button
          onClick={replay}
          className="absolute bottom-4 right-4 rounded-full bg-ink/90 px-4 py-2 text-sm font-semibold text-paper shadow-card transition hover:bg-ink"
        >
          ↻ Replay
        </button>
      </div>

      {showEquations && equations.length > 0 && (
        <div className="mt-4 rounded-4xl border border-grape/20 bg-grape-soft/50 p-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-grape">How it's calculated</p>
          <ul className="space-y-1 font-mono text-sm text-ink">
            {equations.map((eq) => (
              <li key={eq}>{eq}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Small filled triangle at `tip`, pointing along unit vector `dir`. */
function ArrowHead({ tip, dir, size, color }: { tip: { x: number; y: number }; dir: { x: number; y: number }; size: number; color: string }) {
  const perp = { x: -dir.y, y: dir.x };
  const base = { x: tip.x - dir.x * size, y: tip.y - dir.y * size };
  const a = `${tip.x},${tip.y}`;
  const b = `${base.x + perp.x * size * 0.6},${base.y + perp.y * size * 0.6}`;
  const c = `${base.x - perp.x * size * 0.6},${base.y - perp.y * size * 0.6}`;
  return <polygon points={`${a} ${b} ${c}`} fill={color} />;
}

/** Short vertical tick for a measurement line. */
function TickV({ x, y }: { x: number; y: number }) {
  return <line x1={x} y1={y - 6} x2={x} y2={y + 6} stroke="#5B6673" strokeWidth="1.5" />;
}
