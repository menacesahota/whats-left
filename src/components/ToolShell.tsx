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
      <p className="no-print mb-6">
        <Link href="/tools" className="text-sm font-medium text-accent hover:text-accent-hover">
          ← All tools
        </Link>
      </p>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-base text-muted">{description}</p>
        </div>
        <button type="button" onClick={onDemo} className={`${btnSecondary} no-print shrink-0`}>
          Try with demo numbers
        </button>
      </div>
      {children}
    </div>
  );
}
