/**
 * Shared types for the FUNlearn video pipeline.
 * See docs/video-pipeline-spec.md. v1 is built around projectile motion but the
 * shapes are intended to generalise to other concepts.
 */

/** A vetted, hand-authored source of truth for one concept. */
export type ConceptCard = {
  id: string;
  subject: "physics" | "chemistry" | "biology" | "math";
  /** Selects which physics/math engine function runs. */
  model: "projectile";
  variables: Record<string, string>;
  /** Ordered teaching beats; the engine and storyboard both honour this order. */
  teachMoments: TeachMoment[];
  /** Rendered verbatim for higher grades. */
  equations: Record<string, string>;
};

export type TeachMoment = {
  key: string;
  idea: string;
  /** Which derived/input values are relevant at this beat. */
  values: string[];
};

/** Which annotations the diagram shows at a given scene (progressive reveal). */
export type DiagramReveal = {
  arc?: boolean;
  ball?: boolean;
  launch?: boolean; // velocity vector + angle
  gravity?: boolean;
  height?: boolean;
  range?: boolean;
};

/** One beat of a video. The storyboard LLM produces these; it references engine
 *  values by meaning (via `reveal`/captions) and never invents numbers. */
export type Scene =
  | {
      type: "motion" | "teach";
      /** Stable id for the beat, e.g. "launch", "apex". */
      beat: string;
      /** Prompt for the generated still/scene art (what the image model will draw). */
      art: string;
      /** Short on-screen text. */
      caption: string;
      /** Voiceover line (narration). */
      narration: string;
      durationMs: number;
      reveal: DiagramReveal;
      /** Quantitative equations to show (older grades only). */
      equations?: string[];
    }
  | {
      type: "check";
      beat: string;
      prompt: string;
      answer: string;
      durationMs: number;
    };

export type Storyboard = {
  conceptId: string;
  interest: string;
  grade: number;
  scenes: Scene[];
};

/** A generated lesson, written to public/lessons/<cacheKey>/manifest.json.
 *  The folder itself is the cache (keyed by concept + interest + grade). */
export type LessonManifest = {
  cacheKey: string;
  concept: string;
  interest: string;
  grade: number;
  inputs: { v: number; theta: number; g: number };
  derived: ProjectileSolution["derived"];
  voice: string;
  generatedAt: string;
  /** "ready" when stills generated, "placeholder" when image gen was unavailable. */
  imageStatus: "ready" | "placeholder";
  providers: { image: string | null; tts: string | null };
  scenes: ManifestScene[];
};

export type ManifestScene =
  | {
      type: "motion" | "teach";
      beat: string;
      caption: string;
      narration: string;
      reveal: DiagramReveal;
      equations?: string[];
      durationMs: number;
      /** Short human description of the scene art (for the placeholder note). */
      art?: string;
      /** Asset filenames relative to the lesson folder. */
      audio?: string;
      audioMs?: number;
      image?: string;
      /** The exact prompt used for the still (for auditing / regen). */
      prompt?: string;
    }
  | {
      type: "check";
      beat: string;
      prompt: string;
      answer: string;
      durationMs: 0;
    };

/** A point in world units (metres). Ground is y = 0, up is +y. */
export type WorldPoint = { x: number; y: number };

/** Deterministic engine output — the truth for ONE video. */
export type ProjectileSolution = {
  inputs: { v: number; theta: number; g: number };
  derived: {
    vx: number; // horizontal speed (m/s)
    vy0: number; // initial vertical speed (m/s)
    range: number; // horizontal distance (m)
    hMax: number; // max height (m)
    tFlight: number; // total time of flight (s)
    tApex: number; // time to apex (s)
  };
  /** Sampled trajectory, origin → landing, in metres. */
  arc: WorldPoint[];
  /** Key annotated positions in world units. */
  markers: {
    launch: WorldPoint;
    apex: WorldPoint;
    landing: WorldPoint;
  };
};
