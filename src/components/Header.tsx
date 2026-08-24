"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { SITE_NAME } from "@/lib/brand";

export function Header() {
  const pathname = usePathname();
  const toolsActive = pathname === "/tools" || pathname.startsWith("/tools/");
  const aboutActive = pathname === "/about";

  return (
    <header className="no-print sticky top-0 z-20 border-b border-border/80 bg-card/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Link href="/" aria-label={`${SITE_NAME} home`} className="min-w-0">
          <Logo />
        </Link>
        <nav
          className="flex shrink-0 items-center gap-0.5 text-[13px] font-medium sm:text-sm"
          aria-label="Main"
        >
          <NavLink href="/tools" active={toolsActive}>
            Tools
          </NavLink>
          <NavLink href="/about" active={aboutActive}>
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-full bg-accent/10 px-3 py-1.5 text-accent sm:px-3.5"
          : "rounded-full px-3 py-1.5 text-muted hover:bg-background hover:text-foreground sm:px-3.5"
      }
    >
      {children}
    </Link>
  );
}
