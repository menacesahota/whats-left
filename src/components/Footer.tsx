import Link from "next/link";

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Estimates only. Not financial advice. Tax rules change.</p>
        <nav className="flex gap-4" aria-label="Footer">
          <Link href="/about" className="hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
