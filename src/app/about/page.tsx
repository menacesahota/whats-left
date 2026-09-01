import Link from "next/link";
import { SITE_NAME } from "@/lib/brand";
import { pageMetadata } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";

export const metadata = pageMetadata({
  path: "/about",
  title: "About UK money calculators",
  description: `${SITE_NAME} is a set of free money calculators for UK individuals. Not a bank, not payroll software, and not financial advice.`,
});

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        About {SITE_NAME}
      </h1>
      <div id="how-it-works">
        <p className="mt-4 leading-relaxed text-muted">
          Free calculators for people paid a salary, paying rent, or thinking
          about a mortgage. Type numbers in. Get a straight answer.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          It is not a bank. There is no login, no Open Banking, and we do not
          look at your accounts. It is not for limited companies, sole-trader
          tax, payroll or invoices.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Figures are estimates. Tax rules change. Nothing here is financial
          advice.
        </p>
      </div>
      <h2 className="mt-10 font-serif text-2xl font-semibold tracking-tight">
        The tools
      </h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        {TOOLS.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="font-medium text-accent hover:text-accent-hover"
            >
              {tool.title}
            </Link>
            <span className="text-muted"> — {tool.blurb}</span>
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/tools" className="font-medium text-accent">
          See the tools
        </Link>
      </p>
    </article>
  );
}
