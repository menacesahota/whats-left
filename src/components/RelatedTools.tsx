import Link from "next/link";
import { getTool, TOOLS } from "@/lib/tools";

export function RelatedTools({ currentHref }: { currentHref: string }) {
  const current = getTool(currentHref);
  const related = TOOLS.filter((tool) => current?.related.includes(tool.href));

  return (
    <nav
      className="mx-auto max-w-5xl px-4 pb-12"
      aria-label="Related tools"
    >
      <h2 className="font-serif text-xl font-semibold tracking-tight">
        Related tools
      </h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        <li>
          <Link
            href="/tools"
            className="font-medium text-accent hover:text-accent-hover"
          >
            All tools
          </Link>
        </li>
        {related.map((tool) => (
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
    </nav>
  );
}
