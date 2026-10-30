import type { ProjectileSolution, WorldPoint } from "@/lib/video/types";

const DEG = Math.PI / 180;

export type ProjectileInputs = {
  /** Launch speed in m/s. */
  v: number;
  /** Launch angle in degrees (0–90). */
  theta: number;
  /** Gravity in m/s². Defaults to Earth. */
  g?: number;
  /** Number of sampled arc points (higher = smoother curve). */
  samples?: number;
};

/**
 * Deterministic projectile solver — launch from the origin over flat ground.
 * This is the TRUTH layer: every number the video shows comes from here, never
 * from a model. Pure function, fully testable.
 */
export function solveProjectile({
  v,
  theta,
  g = 9.81,
  samples = 48,
}: ProjectileInputs): ProjectileSolution {
  const rad = theta * DEG;
  const vx = v * Math.cos(rad);
  const vy0 = v * Math.sin(rad);

  const tFlight = (2 * vy0) / g;
  const tApex = vy0 / g;
  const range = vx * tFlight;
  const hMax = (vy0 * vy0) / (2 * g);

  const arc: WorldPoint[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (tFlight * i) / samples;
    const x = vx * t;
    const y = vy0 * t - 0.5 * g * t * t;
    arc.push({ x, y: Math.max(0, y) });
  }

  return {
    inputs: { v, theta, g },
    derived: {
      vx: round(vx),
      vy0: round(vy0),
      range: round(range),
      hMax: round(hMax),
      tFlight: round(tFlight),
      tApex: round(tApex),
    },
    arc,
    markers: {
      launch: { x: 0, y: 0 },
      apex: { x: round(vx * tApex), y: round(hMax) },
      landing: { x: round(range), y: 0 },
    },
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
