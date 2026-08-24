import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LeftoverSketch } from "@/components/LeftoverSketch";
import { ToolGrid } from "@/components/ToolGrid";
import { btnPrimary, btnSecondary } from "@/components/ui";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/brand";
import { homeJsonLd, pageMetadata } from "@/lib/seo";
import { TAX_YEAR } from "@/lib/uk-tax";

export const metadata = pageMetadata({
  path: "/",
  title: `${SITE_NAME} — Free UK money tools`,
  description: `${SITE_TAGLINE} Take-home pay, budget, debt, emergency fund, rent versus buy, and bills. No bank login.`,
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <JsonLd data={homeJsonLd()} />
      <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <p className="text-sm font-medium tracking-wide text-accent">
            Free UK money tools
          </p>
          <h1 className="mt-3 max-w-xl font-serif text-4xl font-semibold tracking-tight text-pretty sm:text-5xl sm:leading-[1.12]">
            Type numbers in. Get a straight answer.
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">
            Take-home pay, bills, debt, rent versus buy. For employees, renters
            and homeowners. No bank login. No account.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tools" className={btnPrimary}>
              Browse tools
            </Link>
            <Link href="/about#how-it-works" className={btnSecondary}>
              How it works
            </Link>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-muted">
            No bank login · Numbers stay on this device · {TAX_YEAR} tax year
          </p>
        </div>
        <LeftoverSketch />
      </section>

      <section className="mt-16 sm:mt-20">
        <h2 className="mb-6 font-serif text-2xl font-semibold tracking-tight">
          The tools
        </h2>
        <ToolGrid className="mt-0" />
      </section>
    </div>
  );
}
