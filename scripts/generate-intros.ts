/**
 * Generate a ball-free intro background per lesson (so only the animated flying
 * ball shows during the intro clip). Uses image-to-image from the lesson's open.png
 * to keep the exact same world. Writes <lesson>/intro.png.
 *   npx tsx scripts/generate-intros.ts
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { geminiImageProvider } from "@/lib/video/providers/gemini";
import { LESSONS } from "@/lib/video/catalog";

async function loadKey(): Promise<string> {
  const txt = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf8");
  for (const line of txt.split("\n")) {
    const m = /^GEMINI_API_KEY=(.*)$/.exec(line.trim());
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("GEMINI_API_KEY not found");
}

const PROMPT =
  "Edit this image: REMOVE the ball completely from the scene (it has just been kicked/launched and flown away). Keep EVERYTHING else exactly the same — same field/court, same goal/hoop, same kid and players, same colours, same camera angle and composition. The kid is in a kicking/shooting follow-through pose. Just empty grass/ground where the ball was. Flat storybook style, 16:9, no text.";

async function main() {
  const key = await loadKey();
  const image = geminiImageProvider(key);
  for (const l of LESSONS) {
    const dir = path.join(process.cwd(), "public", "lessons", l.cacheKey);
    const openBuf = await fs.readFile(path.join(dir, "open.png"));
    console.log(`intro [${l.cacheKey}] …`);
    const img = await image.generateImage(PROMPT, {
      aspectRatio: "16:9",
      referenceImage: { bytes: new Uint8Array(openBuf), mime: "image/png" },
    });
    await fs.writeFile(path.join(dir, "intro.png"), Buffer.from(img.bytes));
    console.log(`  ✔ ${l.cacheKey}/intro.png`);
  }
  console.log("done");
}

main().catch((e) => {
  console.error("✖", e.message);
  process.exit(1);
});
