import type { ImageProvider, TTSProvider, GeneratedAsset } from "@/lib/video/providers/types";
import type { LessonManifest, ManifestScene } from "@/lib/video/types";
import { solveProjectile } from "@/lib/video/engine/projectile";
import { buildProjectileStoryboard } from "@/lib/video/storyboards/projectile";
import { GeminiError } from "@/lib/video/providers/gemini";

/**
 * Orchestrator: (concept, interest, grade) → engine → storyboard → assets → manifest.
 * Framework-agnostic. Asset writing is injected via `writeAsset` so this has no fs
 * dependency and could run in a script today or a server route later.
 */

export type GenerateRequest = {
  concept: "projectile";
  interest: string;
  grade: number;
  v?: number;
  theta?: number;
  voice?: string;
};

export type GenerateDeps = {
  image?: ImageProvider | null;
  tts?: TTSProvider | null;
  /** Persist an asset; returns the stored filename (relative to the lesson folder). */
  writeAsset: (filename: string, asset: GeneratedAsset) => Promise<string>;
  /** Wait this long before each TTS call (to respect free-tier rate limits). */
  ttsThrottleMs?: number;
  log?: (msg: string) => void;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Default launch inputs per interest (kept modest and realistic). */
const DEFAULT_INPUTS: Record<string, { v: number; theta: number }> = {
  football: { v: 20, theta: 55 },
  basketball: { v: 9, theta: 62 },
  skateboarding: { v: 11, theta: 35 },
};

const STYLE =
  "Flat 2D storybook illustration for a children's educational video. Warm and friendly, soft rounded shapes, gentle shading, thick clean outlines. Cream paper background (#FCFBF6). Colour palette: grass green #46B06A, sky blue #4E9BE6, sunny yellow #FBD24E, tangerine #F0994A, grape purple #8B7FE8. Wide 16:9 composition, lots of open space, NO text, NO numbers, NO words anywhere in the image.";

function characterSheet(interest: string): string {
  const base =
    "Keep the SAME main character in every scene — a cheerful kid about 12 years old with short dark hair, warm brown skin, big friendly eyes, cartoon proportions. Identical clothing and look across all scenes.";
  const kit: Record<string, string> = {
    football: "Wearing a red football jersey with a white number 7, white shorts, football boots. There is a classic black-and-white football.",
    basketball: "Wearing a purple basketball jersey number 7, shorts, high-top sneakers, holding/relating to an orange basketball.",
    skateboarding: "Wearing a yellow hoodie, cap, and a skateboard nearby.",
  };
  return `${base} ${kit[interest] || "Wearing simple colourful sporty clothes."}`;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Duration of a 16-bit mono WAV, from its header. */
function wavDurationMs(bytes: Uint8Array): number {
  try {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const byteRate = dv.getUint32(28, true);
    const dataSize = dv.getUint32(40, true);
    if (byteRate > 0) return Math.round((dataSize / byteRate) * 1000);
  } catch {
    /* ignore */
  }
  return 0;
}

export async function generateLesson(req: GenerateRequest, deps: GenerateDeps): Promise<LessonManifest> {
  const log = deps.log ?? (() => {});
  const interest = req.interest;
  const defaults = DEFAULT_INPUTS[interest] || DEFAULT_INPUTS.football;
  const v = req.v ?? defaults.v;
  const theta = req.theta ?? defaults.theta;
  const voice = req.voice ?? "Leda";

  const solution = solveProjectile({ v, theta });
  const storyboard = buildProjectileStoryboard(solution, req.grade, interest);
  const cacheKey = `${req.concept}__${slug(interest)}__g${req.grade}`;

  const style = STYLE;
  const character = characterSheet(interest);

  let imageAvailable = Boolean(deps.image);
  let imageStatus: LessonManifest["imageStatus"] = imageAvailable ? "ready" : "placeholder";

  const scenes: ManifestScene[] = [];
  let ttsCount = 0;
  let referenceImage: GeneratedAsset | undefined; // first frame → keeps the world consistent

  for (const scene of storyboard.scenes) {
    if (scene.type === "check") {
      scenes.push({ type: "check", beat: scene.beat, prompt: scene.prompt, answer: scene.answer, durationMs: 0 });
      continue;
    }

    const out: ManifestScene = {
      type: scene.type,
      beat: scene.beat,
      caption: scene.caption,
      narration: scene.narration,
      reveal: scene.reveal,
      equations: scene.equations,
      durationMs: scene.durationMs,
      art: scene.art,
    };

    // ── narration (works on free tier) ──
    if (deps.tts) {
      try {
        if (deps.ttsThrottleMs && ttsCount > 0) await sleep(deps.ttsThrottleMs);
        ttsCount++;
        log(`  tts  [${scene.beat}] …`);
        const audio = await deps.tts.synthesize(scene.narration, { voice });
        out.audio = await deps.writeAsset(`${scene.beat}.wav`, audio);
        out.audioMs = wavDurationMs(audio.bytes);
        if (out.audioMs) out.durationMs = Math.max(scene.durationMs, out.audioMs + 700);
      } catch (e) {
        log(`  tts  [${scene.beat}] FAILED: ${(e as Error).message}`);
      }
    }

    // ── still (needs billing) ──
    const refNote = referenceImage
      ? "\nMatch the provided reference image EXACTLY — same scene, same characters, same colours, same camera angle. Only move the ball to its new position."
      : "";
    const prompt = `${style}\n${character}\nScene to illustrate: ${scene.art}.${refNote}`;
    out.prompt = prompt;
    if (imageAvailable && deps.image) {
      try {
        log(`  img  [${scene.beat}] …`);
        const img = await deps.image.generateImage(prompt, { aspectRatio: "16:9", referenceImage });
        out.image = await deps.writeAsset(`${scene.beat}.png`, img);
        if (!referenceImage) referenceImage = img; // lock the world to the first frame
      } catch (e) {
        const billing = e instanceof GeminiError && e.isBilling;
        log(`  img  [${scene.beat}] ${billing ? "billing required — switching to placeholders" : "FAILED"}: ${(e as Error).message}`);
        imageAvailable = false; // stop hammering a blocked endpoint
        imageStatus = "placeholder";
      }
    }

    scenes.push(out);
  }

  return {
    cacheKey,
    concept: req.concept,
    interest,
    grade: req.grade,
    inputs: { v, theta, g: solution.inputs.g },
    derived: solution.derived,
    voice,
    generatedAt: new Date().toISOString(),
    imageStatus,
    providers: { image: deps.image?.id ?? null, tts: deps.tts?.id ?? null },
    scenes,
  };
}
