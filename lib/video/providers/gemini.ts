import type { ImageProvider, TTSProvider, GeneratedAsset } from "@/lib/video/providers/types";

/**
 * Gemini implementations of the image + TTS providers (REST, no SDK).
 * The key is read from GEMINI_API_KEY and never logged.
 *
 * Model note (verified 2026-10-30 against the account's model list):
 *  - TTS  → gemini-3.8-flash-tts returns audio/wav directly.
 *  - Image → gemini-2.5-flash-image / gemini-3.x-image require billing; the call
 *    is correct and will work the moment billing is enabled.
 */

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

function b64ToBytes(b64: string): Uint8Array {
  return Uint8Array.from(Buffer.from(b64, "base64"));
}

function firstInlineData(json: any): { mime: string; data: string } | null {
  const parts = json?.candidates?.[0]?.content?.parts ?? [];
  for (const p of parts) {
    if (p.inlineData?.data) return { mime: p.inlineData.mimeType || "application/octet-stream", data: p.inlineData.data };
  }
  return null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Parse RetryInfo.retryDelay ("8.4s") from the error details → ms. */
function parseRetryDelay(err: any): number {
  const details = err?.details ?? [];
  for (const d of details) {
    if (typeof d?.["@type"] === "string" && d["@type"].includes("RetryInfo") && d.retryDelay) {
      const s = /([\d.]+)s/.exec(d.retryDelay);
      if (s) return Math.ceil(parseFloat(s[1]) * 1000);
    }
  }
  return 0;
}

/** True for temporary overload/rate issues worth retrying (NOT a billing block). */
function isTransient(e: GeminiError): boolean {
  if (e.httpCode === 503 || e.httpCode === 500) return true;
  if (e.retryDelayMs > 0) return true; // rate-limit with a server-suggested wait
  if (e.httpCode === 429 && /demand|overload|try again|temporar|per minute|rate/i.test(e.message)) return true;
  return false;
}

async function call(model: string, apiKey: string, body: unknown, retries = 6): Promise<any> {
  let lastErr: GeminiError | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${BASE}/${model}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) return json;
    const err = json?.error;
    lastErr = new GeminiError(err?.status || `HTTP_${res.status}`, err?.message || res.statusText, res.status, parseRetryDelay(err));
    if (attempt < retries && isTransient(lastErr)) {
      const wait = lastErr.retryDelayMs > 0 ? lastErr.retryDelayMs + 500 : 1000 * Math.pow(2, attempt);
      await sleep(Math.min(wait, 30000));
      continue;
    }
    throw lastErr;
  }
  throw lastErr!;
}

export class GeminiError extends Error {
  constructor(
    public status: string,
    message: string,
    public httpCode: number,
    /** Server-suggested wait before retry (ms), from RetryInfo; 0 if none. */
    public retryDelayMs = 0,
  ) {
    super(message);
    this.name = "GeminiError";
  }
  /** True for a hard billing block (no retry hint) — image gen on free tier. */
  get isBilling() {
    return this.httpCode === 429 && this.retryDelayMs === 0 && /billing/i.test(this.message) && !/per minute|rate/i.test(this.message);
  }
}

export function geminiImageProvider(apiKey: string, model = "gemini-2.5-flash-image"): ImageProvider {
  return {
    id: `gemini:${model}`,
    async generateImage(prompt, opts) {
      const parts: any[] = [];
      if (opts?.referenceImage) {
        // image-to-image: give the model the previous frame to keep the world consistent
        const b64 = Buffer.from(opts.referenceImage.bytes).toString("base64");
        parts.push({ inlineData: { mimeType: opts.referenceImage.mime, data: b64 } });
      }
      parts.push({ text: prompt });
      const body: any = {
        contents: [{ parts }],
        generationConfig: { responseModalities: ["IMAGE"] },
      };
      if (opts?.aspectRatio) body.generationConfig.imageConfig = { aspectRatio: opts.aspectRatio };
      // The image model occasionally returns a text-only response; retry a few times.
      let img: { mime: string; data: string } | null = null;
      for (let attempt = 0; attempt < 4 && !img; attempt++) {
        const json = await call(model, apiKey, body);
        img = firstInlineData(json);
        if (!img && attempt < 3) await new Promise((r) => setTimeout(r, 800));
      }
      if (!img) throw new GeminiError("NO_IMAGE", "Response contained no image part after retries", 200);
      return { bytes: b64ToBytes(img.data), mime: img.mime } satisfies GeneratedAsset;
    },
  };
}

export function geminiTTSProvider(apiKey: string, model = "gemini-3.8-flash-tts"): TTSProvider {
  return {
    id: `gemini:${model}`,
    async synthesize(text, opts) {
      const voice = opts?.voice || "Leda";
      const json = await call(model, apiKey, {
        contents: [{ parts: [{ text }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
        },
      });
      const audio = firstInlineData(json);
      if (!audio) throw new GeminiError("NO_AUDIO", "Response contained no audio part", 200);
      let bytes = b64ToBytes(audio.data);
      let mime = audio.mime;
      // Some TTS models return raw PCM (audio/L16); wrap it into a WAV container.
      if (/l16|pcm/i.test(mime)) {
        const rate = Number(/rate=(\d+)/.exec(mime)?.[1] || 24000);
        bytes = pcmToWav(bytes, rate);
        mime = "audio/wav";
      }
      return { bytes, mime } satisfies GeneratedAsset;
    },
  };
}

/** Wrap signed 16-bit mono PCM into a minimal WAV container. */
function pcmToWav(pcm: Uint8Array, sampleRate: number): Uint8Array {
  const header = Buffer.alloc(44);
  const dataSize = pcm.length;
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // fmt chunk size
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // byte rate (mono, 2 bytes/sample)
  header.writeUInt16LE(2, 32); // block align
  header.writeUInt16LE(16, 34); // bits per sample
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);
  return Uint8Array.from(Buffer.concat([header, Buffer.from(pcm)]));
}
