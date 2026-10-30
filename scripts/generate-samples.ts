/**
 * Generate polished sample still images for the landing page (one per example).
 * These are marketing visuals only — not the real lessons. Writes to public/samples/.
 *   npx tsx scripts/generate-samples.ts
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { geminiImageProvider } from "@/lib/video/providers/gemini";

const STYLE =
  "Flat 2D storybook illustration for a children's education brand. Warm and friendly, soft rounded shapes, gentle shading, thick clean outlines, cream background (#FCFBF6). Palette: grass green #46B06A, sky blue #4E9BE6, sunny yellow #FBD24E, tangerine #F0994A, grape purple #8B7FE8. Wide 16:9 composition, cheerful kid about 11, NO text, NO numbers, NO words anywhere.";

const SAMPLES: Record<string, string> = {
  projectile:
    "A happy kid in a red kit kicking a football on a sunny pitch; the ball arcs through the air toward a goal, a dotted curved path showing the arc.",
  stoichiometry:
    "A happy kid baking in a cosy kitchen, cracking eggs and pouring flour into a bowl, a stack of pancakes nearby, measuring cups on the counter.",
  photosynthesis:
    "A happy kid in a cartoon farm/garden watering a glowing green sprout as the sun shines down, friendly farm-game vibe.",
  exponential:
    "A happy kid cheering while climbing glowing rising stair-step blocks that get taller and taller, video-game level-up feeling with sparkles.",
};

async function loadKey(): Promise<string> {
  const txt = await fs.readFile(path.join(process.cwd(), ".env.local"), "utf8");
  for (const line of txt.split("\n")) {
    const m = /^GEMINI_API_KEY=(.*)$/.exec(line.trim());
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("GEMINI_API_KEY not found");
}

async function main() {
  const key = await loadKey();
  const image = geminiImageProvider(key);
  const outDir = path.join(process.cwd(), "public", "samples");
  await fs.mkdir(outDir, { recursive: true });

  for (const [id, scene] of Object.entries(SAMPLES)) {
    console.log(`img [${id}] …`);
    const img = await image.generateImage(`${STYLE}\nScene: ${scene}`, { aspectRatio: "16:9" });
    await fs.writeFile(path.join(outDir, `${id}.png`), Buffer.from(img.bytes));
    console.log(`  ✔ ${id}.png`);
  }
  console.log("done");
}

main().catch((e) => {
  console.error("✖", e.message);
  process.exit(1);
});
