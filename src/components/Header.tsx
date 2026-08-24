"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME } from "@/lib/brand";

export function Header() {
  const pathname = usePathname();
  const toolsActive = pathname === "/tools" || pathname.startsWith("/tools/");

  return (
    <header className="no-print border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-serif text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>
        <nav aria-label="Main">
          <Link
            href="/tools"
            className={`text-sm font-medium ${toolsActive ? "text-accent" : "text-muted hover:text-foreground"}`}
          >
            Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}
