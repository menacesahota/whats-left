import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SALVY_NAME, SALVY_URL } from "@/lib/brand";
import { TOOLS } from "@/lib/tools";

export function Footer() {
  return (
    <footer className="no-print mt-auto border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
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
        <div className="flex flex-wrap gap-x-16 gap-y-6">
          <nav className="flex flex-col gap-2 text-sm text-muted" aria-label="Footer">
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
          <nav className="flex flex-col gap-2 text-sm text-muted" aria-label="Calculators">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="hover:text-foreground">
                {tool.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
