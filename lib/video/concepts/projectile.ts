import type { ConceptCard } from "@/lib/video/types";

/**
 * Vetted source of truth for projectile motion.
 * The storyboard LLM references these teachMoments/equations; it never invents numbers.
 */
export const projectileCard: ConceptCard = {
  id: "projectile-motion",
  subject: "physics",
  model: "projectile",
  variables: {
    v: "launch speed (m/s)",
    theta: "launch angle (degrees)",
    g: "gravity (9.81 m/s²)",
  },
  teachMoments: [
    { key: "launch", idea: "The kick gives the ball a force — speed in a direction.", values: ["v", "theta", "vx", "vy0"] },
    { key: "ascent", idea: "Gravity constantly pulls down, so the upward speed shrinks.", values: ["vy0", "g"] },
    { key: "apex", idea: "At the very top the upward speed is zero — only sideways motion is left.", values: ["tApex", "hMax", "vx"] },
    { key: "descent", idea: "The fall mirrors the climb — symmetric about the top.", values: ["tFlight", "vy0"] },
    { key: "recap", idea: "Range, height and flight time all come from just the speed and the angle.", values: ["range", "hMax", "theta", "tFlight"] },
  ],
  equations: {
    range: "R = v² · sin(2θ) / g",
    hMax: "H = v² · sin²(θ) / (2g)",
    tFlight: "T = 2v · sin(θ) / g",
  },
};
