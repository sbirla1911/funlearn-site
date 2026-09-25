import Link from "next/link";

/** The FUNlearn wordmark: "FUN" in a yellow highlight box, "learn" in ink. */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-1.5 font-serif text-2xl font-black tracking-tight text-ink ${className}`}
      aria-label="FUNlearn home"
    >
      <span className="rounded-lg bg-sunny px-2 py-0.5 leading-none text-ink shadow-[0_2px_0_#E9B93A]">
        FUN
      </span>
      <span className="font-semibold">learn</span>
    </Link>
  );
}
