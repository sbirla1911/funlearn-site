/**
 * Provider interfaces for the generation pipeline. The orchestrator depends only
 * on these, so swapping Gemini for another model (or a mock) is a one-line change.
 * Providers run server-/script-side only (they hold the API key).
 */

export type GeneratedAsset = {
  /** Raw bytes of the asset. */
  bytes: Uint8Array;
  /** MIME type, e.g. "image/png" or "audio/wav". */
  mime: string;
};

export interface ImageProvider {
  readonly id: string;
  /** Generate one still from a prompt. Throws on failure (e.g. quota).
   *  `referenceImage` keeps a consistent world across frames (image-to-image). */
  generateImage(prompt: string, opts?: { aspectRatio?: string; referenceImage?: GeneratedAsset }): Promise<GeneratedAsset>;
}

export interface TTSProvider {
  readonly id: string;
  /** Synthesize narration audio from text. Throws on failure. */
  synthesize(text: string, opts?: { voice?: string }): Promise<GeneratedAsset>;
}
