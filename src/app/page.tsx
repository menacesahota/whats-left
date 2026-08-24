import type { Metadata } from "next";
import Link from "next/link";
import { ToolGrid } from "@/components/ToolGrid";
import { btnPrimary } from "@/components/ui";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Free UK money tools`,
  },
  description: `${SITE_TAGLINE} Take-home pay, budget, debt, emergency fund, rent versus buy, and bills. No bank login.`,
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <p className="text-sm font-medium text-accent">UK money tools</p>
      <h1 className="mt-2 max-w-2xl font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {SITE_NAME}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{SITE_TAGLINE}</p>
      <p className="mt-3 max-w-xl text-muted">
        Take-home pay, bills, debt, rent versus buy. Built for UK employees,
        renters and homeowners. No bank login. No account.
      </p>
      <p className="mt-6">
        <Link href="/tools" className={btnPrimary}>
          Browse tools
        </Link>
      </p>
      <ToolGrid />
    </div>
  );
}
