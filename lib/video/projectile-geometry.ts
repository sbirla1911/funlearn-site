import type { ProjectileSolution } from "@/lib/video/types";

/**
 * Shared screen-space layout for the projectile diagram. Both the lab overlay and
 * the story player render from this, so the "truth" mapping (world metres → SVG)
 * lives in exactly one place. Everything is rounded to 2 dp so server/client SVG
 * is byte-identical (no hydration drift).
 */

export const VB = { w: 760, h: 440 };
export const PAD = { left: 74, right: 74, top: 54, bottom: 66 };
export const GROUND_Y = VB.h - PAD.bottom;
export const ORIGIN_X = PAD.left;
const USABLE_W = VB.w - PAD.left - PAD.right;
const USABLE_H = GROUND_Y - PAD.top;

const r = (n: number) => Math.round(n * 100) / 100;

export type Pt = { x: number; y: number };

export type ProjectileLayout = {
  scale: number;
  pathD: string;
  origin: Pt;
  apex: Pt;
  landing: Pt;
  launchVector: { tip: Pt; dir: Pt };
  angleArcD: string;
  gravityTip: Pt;
  labels: {
    v: string;
    theta: string;
    range: string;
    hMax: string;
    rangeMidX: number;
    hMidY: number;
  };
};

export function layoutProjectile(solution: ProjectileSolution): ProjectileLayout {
  const { range, hMax } = solution.derived;
  const scale = Math.min(USABLE_W / Math.max(range, 0.01), USABLE_H / Math.max(hMax, 0.01));

  const sx = (xm: number) => r(ORIGIN_X + xm * scale);
  const sy = (ym: number) => r(GROUND_Y - ym * scale);

  const pathD = solution.arc
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x)} ${sy(p.y)}`)
    .join(" ");

  const rad = (solution.inputs.theta * Math.PI) / 180;
  const vLen = 96;
  const launchVector = {
    tip: { x: r(ORIGIN_X + vLen * Math.cos(rad)), y: r(GROUND_Y - vLen * Math.sin(rad)) },
    dir: { x: r(Math.cos(rad)), y: r(-Math.sin(rad)) },
  };

  const arcR = 46;
  const angleArcD = `M ${ORIGIN_X + arcR} ${GROUND_Y} A ${arcR} ${arcR} 0 0 0 ${r(
    ORIGIN_X + arcR * Math.cos(rad)
  )} ${r(GROUND_Y - arcR * Math.sin(rad))}`;

  const apex = { x: sx(solution.markers.apex.x), y: sy(solution.markers.apex.y) };
  const landing = { x: sx(solution.markers.landing.x), y: sy(solution.markers.landing.y) };

  return {
    scale,
    pathD,
    origin: { x: ORIGIN_X, y: GROUND_Y },
    apex,
    landing,
    launchVector,
    angleArcD,
    gravityTip: { x: apex.x, y: r(apex.y + 58) },
    labels: {
      v: `v = ${solution.inputs.v} m/s`,
      theta: `θ = ${solution.inputs.theta}°`,
      range: `R = ${range} m`,
      hMax: `H = ${hMax} m`,
      rangeMidX: r((ORIGIN_X + landing.x) / 2),
      hMidY: r((apex.y + GROUND_Y) / 2),
    },
  };
}
