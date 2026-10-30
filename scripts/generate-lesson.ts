/**
 * Generate a lesson's assets (narration audio now; stills when billing is on) and
 * write them to public/lessons/<cacheKey>/. The folder is the cache.
 *
 * Usage:
 *   npx tsx scripts/generate-lesson.ts --interest football --grade 9
 *   npx tsx scripts/generate-lesson.ts --interest basketball --grade 6 --no-image
 *   (add --voice Leda  --v 20  --theta 55)
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { generateLesson, type GenerateRequest } from "@/lib/video/generate";
import { geminiImageProvider, geminiTTSProvider } from "@/lib/video/providers/gemini";
import type { GeneratedAsset } from "@/lib/video/providers/types";
import type { LessonManifest } from "@/lib/video/types";

/** Duration (ms) of a 16-bit WAV from its header. */
function wavDurationMs(buf: Buffer): number {
  try {
    const byteRate = buf.readUInt32LE(28);
    const dataSize = buf.readUInt32LE(40);
    if (byteRate > 0) return Math.round((dataSize / byteRate) * 1000);
  } catch {
    /* ignore */
  }
  return 0;
}

/** Attach any <beat>.wav/.png already on disk to the manifest — no API calls. */
async function relinkExisting(manifest: LessonManifest, dir: string): Promise<LessonManifest> {
  let anyAudio = false;
  let anyImage = false;
  for (const s of manifest.scenes) {
    if (s.type === "check") continue;
    const wav = path.join(dir, `${s.beat}.wav`);
    const png = path.join(dir, `${s.beat}.png`);
    try {
      const buf = await fs.readFile(wav);
      s.audio = `${s.beat}.wav`;
      s.audioMs = wavDurationMs(buf);
      if (s.audioMs) s.durationMs = Math.max(s.durationMs, s.audioMs + 700);
      anyAudio = true;
    } catch {
      /* no audio for this beat */
    }
    try {
      await fs.access(png);
      s.image = `${s.beat}.png`;
      anyImage = true;
    } catch {
      /* no image */
    }
  }
  if (anyImage) manifest.imageStatus = "ready";
  manifest.providers.tts = anyAudio ? "gemini:gemini-3.8-flash-tts (relinked)" : null;
  return manifest;
}

const ROOT = process.cwd();
const LESSONS_DIR = path.join(ROOT, "public", "lessons");

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  if (i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) return process.argv[i + 1];
  return fallback;
}
const flag = (name: string) => process.argv.includes(`--${name}`);

async function loadKey(): Promise<string> {
  const txt = await fs.readFile(path.join(ROOT, ".env.local"), "utf8");
  for (const line of txt.split("\n")) {
    const m = /^GEMINI_API_KEY=(.*)$/.exec(line.trim());
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("GEMINI_API_KEY not found in .env.local");
}

async function updateIndex(manifest: LessonManifest) {
  const indexPath = path.join(LESSONS_DIR, "index.json");
  let index: any[] = [];
  try {
    index = JSON.parse(await fs.readFile(indexPath, "utf8"));
  } catch {
    /* new index */
  }
  const entry = {
    cacheKey: manifest.cacheKey,
    concept: manifest.concept,
    interest: manifest.interest,
    grade: manifest.grade,
    imageStatus: manifest.imageStatus,
  };
  index = index.filter((e) => e.cacheKey !== entry.cacheKey);
  index.push(entry);
  index.sort((a, b) => a.cacheKey.localeCompare(b.cacheKey));
  await fs.writeFile(indexPath, JSON.stringify(index, null, 2));
}

async function main() {
  const interest = arg("interest", "football")!;
  const grade = Number(arg("grade", "9"));
  const voice = arg("voice", "Leda");
  const v = arg("v") ? Number(arg("v")) : undefined;
  const theta = arg("theta") ? Number(arg("theta")) : undefined;
  const noImage = flag("no-image");

  const noAudio = flag("no-audio");
  const key = await loadKey();
  const image = noImage ? null : geminiImageProvider(key);
  const tts = noAudio ? null : geminiTTSProvider(key);

  const req: GenerateRequest = { concept: "projectile", interest, grade, v, theta, voice };
  const cacheKey = `projectile__${interest.toLowerCase().replace(/[^a-z0-9]+/g, "-")}__g${grade}`;
  const outDir = path.join(LESSONS_DIR, cacheKey);
  await fs.mkdir(outDir, { recursive: true });

  console.log(`\n▶ Generating ${cacheKey}  (interest=${interest}, grade=${grade}, voice=${voice}, images=${!noImage})`);

  const writeAsset = async (filename: string, asset: GeneratedAsset) => {
    await fs.writeFile(path.join(outDir, filename), Buffer.from(asset.bytes));
    return filename;
  };

  // Free-tier TTS allows ~3 requests/minute, so space calls ~21s apart.
  const ttsThrottleMs = Number(arg("throttle", "21000"));
  const relink = flag("relink");
  let manifest = await generateLesson(
    req,
    relink
      ? { image: null, tts: null, writeAsset, log: (m) => console.log(m) }
      : { image, tts, writeAsset, ttsThrottleMs, log: (m) => console.log(m) },
  );
  if (relink) {
    manifest = await relinkExisting(manifest, outDir);
    console.log("  relinked existing assets on disk (no API calls)");
  }
  await fs.writeFile(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  await updateIndex(manifest);

  const audioCount = manifest.scenes.filter((s) => "audio" in s && s.audio).length;
  console.log(`✔ Wrote ${outDir}`);
  console.log(`  scenes=${manifest.scenes.length}  audio=${audioCount}  images=${manifest.imageStatus}`);
}

main().catch((e) => {
  console.error("✖ generation failed:", e.message);
  process.exit(1);
});
