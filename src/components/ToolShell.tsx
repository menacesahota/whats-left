"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { btnSecondary } from "./ui";

type ToolShellProps = {
  title: string;
  description: string;
  onDemo: () => void;
  children: ReactNode;
};

export function ToolShell({
  title,
  description,
  onDemo,
  children,
}: ToolShellProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <nav className="no-print mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted">
          <li>
            <Link href="/" className="font-medium text-accent hover:text-accent-hover">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/tools" className="font-medium text-accent hover:text-accent-hover">
              Tools
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-foreground" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-pretty text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-muted">{description}</p>
        </div>
        <button type="button" onClick={onDemo} className={`${btnSecondary} no-print shrink-0`}>
          Try with demo numbers
        </button>
      </div>
      {children}
    </div>
  );
}
