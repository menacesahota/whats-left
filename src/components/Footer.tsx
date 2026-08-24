import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SALVY_NAME, SALVY_URL } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo compact />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Estimates only. Not financial advice. Tax rules change.
          </p>
          <p className="mt-3 text-sm text-muted">
            From{" "}
            <a
              href={SALVY_URL}
              className="font-medium text-foreground hover:text-accent"
            >
              {SALVY_NAME}
            </a>
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"
          aria-label="Footer"
        >
          <Link href="/tools" className="hover:text-foreground">
            Tools
          </Link>
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
