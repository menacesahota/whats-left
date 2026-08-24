import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { cardClass } from "./ui";

export function ToolGrid() {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2">
      {TOOLS.map((tool) => (
        <li key={tool.href}>
          <Link
            href={tool.href}
            className={`${cardClass} block h-full transition-colors hover:border-accent`}
          >
            <h2 className="font-serif text-xl font-semibold">{tool.title}</h2>
            <p className="mt-2 text-sm text-muted">{tool.blurb}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
