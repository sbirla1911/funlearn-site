"use client";

import { useMemo, useState } from "react";
import { solveProjectile } from "@/lib/video/engine/projectile";
import { projectileCard } from "@/lib/video/concepts/projectile";
import TrajectoryOverlay from "@/components/video/TrajectoryOverlay";

/**
 * Internal lab for Phase A: see the physics engine + overlay working, tweak the
 * inputs, and confirm the drawn geometry matches the computed truth. Not linked
 * from the public site.
 */
export default function LabPage() {
  const [v, setV] = useState(20);
  const [theta, setTheta] = useState(55);
  const [grade, setGrade] = useState(9);

  const solution = useMemo(() => solveProjectile({ v, theta }), [v, theta]);
  const showEquations = grade >= 9;

  const equations = useMemo(() => {
    const { range, hMax, tFlight } = solution.derived;
    return [
      `${projectileCard.equations.range}  =  ${range} m`,
      `${projectileCard.equations.hMax}  =  ${hMax} m`,
      `${projectileCard.equations.tFlight}  =  ${tFlight} s`,
    ];
  }, [solution]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-tangerine">FUNlearn · internal lab</p>
      <h1 className="mt-1 font-serif text-4xl font-black text-ink">Projectile engine + overlay</h1>
      <p className="mt-2 text-muted">
        The curve, vectors, angle and measurements are all drawn from the deterministic engine — the{" "}
        <span className="font-semibold text-ink">truth layer</span>. Drag the controls and watch the
        geometry stay correct.
      </p>

      {/* controls */}
      <div className="mt-8 grid gap-6 rounded-4xl border border-black/5 bg-white p-6 shadow-card sm:grid-cols-3">
        <Control label="Launch speed" value={`${v} m/s`}>
          <input type="range" min={5} max={40} value={v} onChange={(e) => setV(+e.target.value)} className="w-full accent-tangerine" />
        </Control>
        <Control label="Launch angle" value={`${theta}°`}>
          <input type="range" min={10} max={80} value={theta} onChange={(e) => setTheta(+e.target.value)} className="w-full accent-tangerine" />
        </Control>
        <Control label="Grade dial" value={grade >= 9 ? "Older (with equations)" : "Younger (plain)"}>
          <input type="range" min={5} max={11} value={grade} onChange={(e) => setGrade(+e.target.value)} className="w-full accent-grape" />
        </Control>
      </div>

      {/* the overlay */}
      <div className="mt-8">
        <TrajectoryOverlay solution={solution} showEquations={showEquations} equations={equations} />
      </div>

      {/* raw truth readout — proves what's drawn equals what's computed */}
      <div className="mt-6 rounded-4xl border border-sky/20 bg-sky-soft/50 p-5">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-sky">Engine output (truth)</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-sm text-ink sm:grid-cols-3">
          <span>range = {solution.derived.range} m</span>
          <span>hMax = {solution.derived.hMax} m</span>
          <span>tFlight = {solution.derived.tFlight} s</span>
          <span>tApex = {solution.derived.tApex} s</span>
          <span>vx = {solution.derived.vx} m/s</span>
          <span>vy0 = {solution.derived.vy0} m/s</span>
        </div>
      </div>
    </main>
  );
}

function Control({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-bold text-ink">{label}</span>
        <span className="text-xs font-semibold text-muted">{value}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
