import Link from "next/link";
import Logo from "./Logo";
import Avatar from "./Avatar";

type HeaderProps = { variant?: "landing" | "minimal" | "app" | "sub" };

const navLink = "rounded-full px-3 py-2 hover:text-ink";
const cta =
  "rounded-full bg-grass px-5 py-2.5 text-white shadow-[0_3px_0_#3A9A5A] transition hover:-translate-y-0.5 hover:bg-grass-dark";

/** Top bar. Changes shape per page per the wireframes. */
export default function Header({ variant = "landing" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/[0.05] bg-paper/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />

        {variant === "landing" && (
          <nav className="flex items-center gap-1 text-sm font-semibold text-ink/75 sm:gap-3">
            <a href="#how-it-works" className={`hidden sm:inline-block ${navLink}`}>
              How it works
            </a>
            <Link href="/lessons" className={`hidden sm:inline-block ${navLink}`}>
              Lessons
            </Link>
            <Link href="/dashboard" className={navLink}>
              Log in
            </Link>
            <Link href="/get-started" className={cta}>
              Get started
            </Link>
          </nav>
        )}

        {variant === "sub" && (
          <nav className="flex items-center gap-1 text-sm font-semibold text-ink/75 sm:gap-3">
            <Link href="/lessons" className={`hidden sm:inline-block ${navLink}`}>
              Lessons
            </Link>
            <Link href="/dashboard" className={navLink}>
              Log in
            </Link>
            <Link href="/get-started" className={cta}>
              Get started
            </Link>
          </nav>
        )}

        {variant === "minimal" && (
          <p className="text-sm font-medium text-muted">
            Already have an account?{" "}
            <Link href="/dashboard" className="font-semibold text-ink underline decoration-sunny decoration-2 underline-offset-2">
              Log in
            </Link>
          </p>
        )}

        {variant === "app" && (
          <div className="flex items-center gap-4">
            <Link href="/lessons" className="hidden text-sm font-semibold text-ink/75 hover:text-ink sm:inline-block">
              Lessons
            </Link>
            <span className="text-sm font-semibold text-ink">Maya</span>
            <Avatar initial="M" color="sunny" className="h-9 w-9 text-sm" />
          </div>
        )}
      </div>
    </header>
  );
}
