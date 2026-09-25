import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:px-8">
        <Logo className="text-xl" />
        <p>Concept page. Examples are illustrative.</p>
      </div>
    </footer>
  );
}
