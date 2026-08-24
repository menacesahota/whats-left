import Link from "next/link";
import { TOOLS, type ToolMeta } from "@/lib/tools";
import { cardClass } from "./ui";

export function ToolGrid({ className = "mt-10" }: { className?: string }) {
  return (
    <ul className={`${className} grid gap-4 sm:grid-cols-2`}>
      {TOOLS.map((tool) => (
        <li key={tool.href}>
          <Link
            href={tool.href}
            className={`${cardClass} group block h-full transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-[0_12px_28px_-16px_rgba(15,118,110,0.35)]`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <ToolGlyph name={tool.icon} />
              </span>
              <span className="text-sm font-medium text-muted transition-colors group-hover:text-accent">
                Open
              </span>
            </div>
            <h2 className="mt-4 font-serif text-xl font-semibold tracking-tight">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{tool.blurb}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ToolGlyph({ name }: { name: ToolMeta["icon"] }) {
  const props = {
    className: "h-5 w-5",
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "pay":
      return (
        <svg {...props}>
          <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
          <path d="M3.5 10h17M8 14h4" />
        </svg>
      );
    case "budget":
      return (
        <svg {...props}>
          <path d="M5 20V9.5L12 4l7 5.5V20" />
          <path d="M9.5 20v-6h5v6" />
        </svg>
      );
    case "debt":
      return (
        <svg {...props}>
          <path d="M4 16.5l4.5-8 3 5 3.2-4.2L20 17" />
        </svg>
      );
    case "fund":
      return (
        <span className="text-[1.15rem] font-semibold leading-none" aria-hidden="true">
          £
        </span>
      );
    case "home":
      return (
        <svg {...props}>
          <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M6 11h12M11 6v12" />
        </svg>
      );
  }
}
