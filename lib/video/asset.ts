/** Client-safe URL helpers for lesson assets (prefixed with the deploy basePath). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const lessonsIndexUrl = () => `${BASE_PATH}/lessons/index.json`;
export const lessonManifestUrl = (cacheKey: string) => `${BASE_PATH}/lessons/${cacheKey}/manifest.json`;
export const lessonAsset = (cacheKey: string, file: string) => `${BASE_PATH}/lessons/${cacheKey}/${file}`;
