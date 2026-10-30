"use client";

import { useMemo, useState } from "react";
import { solveProjectile } from "@/lib/video/engine/projectile";

/**
 * "Hit the target" game — the player picks an angle and power, kicks, and the ball
 * flies the REAL computed trajectory. Pure physics from the engine, so it's a game
 * that actually teaches the concept.
 */

const VB = { w: 440, h: 230 };
const ORIGIN_X = 40;
const GROUND_Y = 188;
const MAX_R = 42; // metres mapped across the pitch
const MAX_H = 24;
const X = (420 - 60) / MAX_R;
const Y = (GROUND_Y - 24) / MAX_H;
const TOL = 2.5; // metres either side of the target counts as a hit

const sx = (xm: number) => Math.round((ORIGIN_X + xm * X) * 100) / 100;
const sy = (ym: number) => Math.round((GROUND_Y - ym * Y) * 100) / 100;

function randomTarget() {
  return Math.round(14 + Math.random() * 22); // 14–36 m
}

export default function ProjectileGame() {
  const [angle, setAngle] = useState(50);
  const [power, setPower] = useState(16);
  const [target, setTarget] = useState(22);
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [kickId, setKickId] = useState(0);
  const [shot, setShot] = useState<{ pathD: string; landed: number; result: "hit" | "miss" } | null>(null);
  const [revealed, setRevealed] = useState(false);

  const preview = useMemo(() => solveProjectile({ v: power, theta: angle }), [power, angle]);

  function kick() {
    const sol = solveProjectile({ v: power, theta: angle });
    const landed = sol.derived.range;
    const pathD = sol.arc.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`).join(" ");
    const result: "hit" | "miss" = Math.abs(landed - target) <= TOL ? "hit" : "miss";
    setShot({ pathD, landed, result });
    setRevealed(false);
    setKickId((k) => k + 1);
    setTries((t) => t + 1);
    if (result === "hit") setScore((s) => s + 1);
    window.setTimeout(() => setRevealed(true), 1400);
  }

  function newTarget() {
    setTarget(randomTarget());
    setShot(null);
    setRevealed(false);
  }

  return (
    <section className="rounded-4xl border border-black/[0.06] bg-white p-6 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-grass-soft text-lg">🎮</span>
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">The game — hit the target</h2>
            <p className="text-sm text-muted">Pick an angle and power, then shoot. The ball flies the real physics.</p>
          </div>
        </div>
        <span className="rounded-full bg-sunny/40 px-3 py-1 text-sm font-bold text-[#9a7a12]">
          {score}/{tries}
        </span>
      </div>

      {/* pitch */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-black/5 bg-sky-soft/40">
        <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="w-full">
          {/* ground */}
          <rect x="0" y={GROUND_Y} width={VB.w} height={VB.h - GROUND_Y} fill="#E4F5EA" />
          <line x1="0" y1={GROUND_Y} x2={VB.w} y2={GROUND_Y} stroke="#46B06A" strokeWidth="3" />

          {/* target zone */}
          <rect x={sx(target - TOL)} y={GROUND_Y - 4} width={(2 * TOL) * X} height="8" rx="3" fill="#FBD24E" />
          <g transform={`translate(${sx(target)}, ${GROUND_Y})`}>
            <line x1="0" y1="0" x2="0" y2="-34" stroke="#1F2A37" strokeWidth="2" />
            <path d="M0 -34 L18 -28 L0 -22 Z" fill="#EC8FB0" />
          </g>
          <text x={sx(target)} y={GROUND_Y + 18} textAnchor="middle" fontSize="11" fontWeight="700" className="fill-muted">
            {target} m
          </text>

          {/* player marker */}
          <circle cx={ORIGIN_X} cy={GROUND_Y} r="5" fill="#1F2A37" />

          {/* aim hint (faint predicted arc before kicking) */}
          {!shot && (
            <path
              d={preview.arc.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(Math.min(p.x, MAX_R))} ${sy(p.y)}`).join(" ")}
              fill="none"
              stroke="#4E9BE6"
              strokeWidth="2"
              strokeDasharray="4 6"
              opacity="0.6"
            />
          )}

          {/* the shot */}
          {shot && (
            <>
              <path d={shot.pathD} fill="none" stroke="#4E9BE6" strokeWidth="2.5" opacity="0.7" />
              <g key={kickId}>
                <circle r="7" fill="#fff" stroke="#1F2A37" strokeWidth="1.8" />
                <circle r="2" fill="#1F2A37" />
                <animateMotion dur="1.3s" fill="freeze" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.3 0 0.7 1">
                  <mpath href={`#gp-${kickId}`} />
                </animateMotion>
              </g>
              <path id={`gp-${kickId}`} d={shot.pathD} fill="none" stroke="none" />
            </>
          )}

          {/* result banner */}
          {shot && revealed && (
            <g>
              <rect x="150" y="18" width="140" height="30" rx="15" fill={shot.result === "hit" ? "#46B06A" : "#EC8FB0"} />
              <text x="220" y="38" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff">
                {shot.result === "hit" ? "GOAL! ⚽" : `Missed — ${shot.landed} m`}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* controls */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="flex items-baseline justify-between text-sm font-bold text-ink">
            Angle <span className="text-xs font-semibold text-muted">{angle}°</span>
          </span>
          <input type="range" min={25} max={65} value={angle} onChange={(e) => setAngle(+e.target.value)} className="mt-2 w-full accent-tangerine" />
        </label>
        <label className="block">
          <span className="flex items-baseline justify-between text-sm font-bold text-ink">
            Power <span className="text-xs font-semibold text-muted">{power} m/s</span>
          </span>
          <input type="range" min={8} max={20} value={power} onChange={(e) => setPower(+e.target.value)} className="mt-2 w-full accent-tangerine" />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={kick} className="rounded-full bg-grass px-6 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#3A9A5A] transition hover:-translate-y-0.5 hover:bg-grass-dark">
          ⚽ Shoot!
        </button>
        <button onClick={newTarget} className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-black/5">
          New target
        </button>
        <span className="text-xs text-muted">Tip: on flat ground, 45° reaches the farthest.</span>
      </div>
    </section>
  );
}
