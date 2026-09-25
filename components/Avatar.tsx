const colorMap: Record<string, string> = {
  blossom: "bg-blossom/25 text-blossom",
  grass: "bg-grass/20 text-grass-dark",
  sunny: "bg-sunny/40 text-[#9a7a12]",
  grape: "bg-grape/25 text-grape",
  sky: "bg-sky/20 text-sky",
};

/** Simple round initial avatar used for friends and the profile chip. */
export default function Avatar({
  initial,
  color = "grass",
  className = "",
}: {
  initial: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${
        colorMap[color] ?? colorMap.grass
      } ${className}`}
    >
      {initial}
    </span>
  );
}
