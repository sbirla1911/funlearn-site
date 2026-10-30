/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/funlearn-site" : "";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: isProd ? "/funlearn-site/" : "",
  trailingSlash: true,
  // Exposed to the client so we can prefix public asset URLs (lesson audio/images).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
