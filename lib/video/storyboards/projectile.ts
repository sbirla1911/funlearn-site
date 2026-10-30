import type { ProjectileSolution, Storyboard, Scene } from "@/lib/video/types";
import { projectileCard } from "@/lib/video/concepts/projectile";

/**
 * Hand-authored projectile storyboard, parameterised by grade AND interest.
 * Grade flexes the reading level + the quantitative recap; interest swaps the
 * surface framing (verb/impactor/scene) while the physics stays identical.
 * This is the shape the storyboard LLM will eventually emit per request.
 */

type InterestProfile = {
  actor: string; // "young footballer"
  verb: string; // "kick"
  verbPast: string; // "kicked"
  impactor: string; // "boot"
  object: string; // "ball"
  /** Shared setting appended to every scene so the stills form one continuous world. */
  setting: string;
  openArt: string;
  closeArt: string;
};

const PROFILES: Record<string, InterestProfile> = {
  football: {
    actor: "young footballer",
    verb: "kick",
    verbPast: "kicked",
    impactor: "boot",
    object: "ball",
    setting:
      "ALWAYS the exact same scene: a sunny cartoon football pitch seen from the side, a white goalpost on the far right, a few other young players standing in the background, green grass, blue sky with soft clouds. Same field, same goal, same characters, same camera angle in every image — only the ball's position changes.",
    openArt: "the footballer on the left beginning a run-up to a ball resting on the grass, the goal on the right",
    closeArt: "a wide view showing the whole pitch, the player on the left and the goal on the right",
  },
  basketball: {
    actor: "young basketball player",
    verb: "shot",
    verbPast: "shot",
    impactor: "hands",
    object: "ball",
    setting:
      "ALWAYS the exact same scene: a cartoon outdoor basketball court seen from the side, a hoop on the far right, same player, same court and sky in every image — only the ball's position changes.",
    openArt: "the player on the left about to launch a shot, the hoop on the right",
    closeArt: "a wide view of the court, the player on the left and the hoop on the right",
  },
  skateboarding: {
    actor: "young skateboarder",
    verb: "launch",
    verbPast: "launched",
    impactor: "ramp",
    object: "skateboarder",
    setting:
      "ALWAYS the exact same scene: a cartoon skate park seen from the side, a ramp on the left, same skater and park in every image — only the position changes.",
    openArt: "the skateboarder launching off a ramp on the left",
    closeArt: "a wide view of the skate park and the full jump",
  },
};

export function buildProjectileStoryboard(
  solution: ProjectileSolution,
  grade: number,
  interest = "football",
): Storyboard {
  const older = grade >= 9;
  const { range, hMax } = solution.derived;
  const p = PROFILES[interest] || PROFILES.football;
  // Every still describes the same continuous world (only the ball moves).
  const inScene = (moment: string) => `${moment}. ${p.setting}`;

  const equations = older
    ? [
        `${projectileCard.equations.range} = ${range} m`,
        `${projectileCard.equations.hMax} = ${hMax} m`,
      ]
    : undefined;

  const scenes: Scene[] = [
    {
      type: "motion",
      beat: "open",
      art: inScene(p.openArt),
      caption: `Watch the ${p.verb}.`,
      narration: `Watch closely as the ${p.object} leaves the ${p.impactor}.`,
      durationMs: 3200,
      reveal: {},
    },
    {
      type: "teach",
      beat: "launch",
      art: inScene(`the same scene zoomed in close on the ${p.impactor} striking the ${p.object}`),
      caption: older
        ? `The ${p.verb} gives the ${p.object} a force — speed in a direction.`
        : `The ${p.verb} gives the ${p.object} a push — a force.`,
      narration: older
        ? `The ${p.impactor} gives the ${p.object} a force: a push with a size and a direction. Here that's ${solution.inputs.v} metres per second, aimed ${solution.inputs.theta} degrees above the ground.`
        : `When the ${p.impactor} meets the ${p.object}, it gives it a push. We call that push a force, and it sends the ${p.object} off in a direction.`,
      durationMs: 5200,
      reveal: { launch: true },
    },
    {
      type: "motion",
      beat: "ascent",
      art: inScene(`the ${p.object} rising up and forward through the air toward the right, a soft motion trail behind it`),
      caption: "That force sends it up and forward.",
      narration: `That one force sends the ${p.object} both upward and forward at the same time.`,
      durationMs: 3200,
      reveal: { launch: true, arc: true, ball: true },
    },
    {
      type: "teach",
      beat: "apex",
      art: inScene(`the ${p.object} at the very top of its arc, high above the middle of the pitch`),
      caption: older
        ? "Gravity pulls down the whole time. At the top, up-speed is zero."
        : "Gravity always pulls down. At the top, it stops rising.",
      narration: older
        ? `Gravity pulls down the entire flight, shrinking the upward speed until, at the very top, it reaches zero — only the sideways motion is left.`
        : `The whole time, gravity is pulling down. That's why it slows as it climbs, and at the very top it stops going up.`,
      durationMs: 5600,
      reveal: { launch: true, arc: true, gravity: true, height: true },
    },
    {
      type: "motion",
      beat: "descent",
      art: inScene(`the ${p.object} curving back down toward the goal on the right`),
      caption: "Then gravity wins — it curves back down.",
      narration: `With no more upward speed, gravity wins and the ${p.object} curves back down to the ground.`,
      durationMs: 3000,
      reveal: { launch: true, arc: true, gravity: true, height: true, ball: true },
    },
    {
      type: "teach",
      beat: "recap",
      art: inScene(p.closeArt),
      caption: "Angle + power decide how far and how high.",
      narration: older
        ? `Put it together: the launch speed and angle set everything. This ${p.verb} travels ${range} metres and peaks at ${hMax} metres.`
        : `So how hard and at what angle you ${p.verb} decide how far and how high it goes. This one went ${range} metres across and ${hMax} metres up.`,
      durationMs: 6000,
      reveal: { launch: true, arc: true, gravity: true, height: true, range: true },
      equations,
    },
    {
      type: "check",
      beat: "check",
      prompt: `If the ${p.object} went up at a flatter angle, would it travel farther or land sooner?`,
      answer:
        "A flatter angle usually lands sooner and reaches a lower peak. The farthest distance comes at about 45°.",
      durationMs: 0,
    },
  ];

  return { conceptId: projectileCard.id, interest, grade, scenes };
}
