import type { Metadata } from "next";
import { ToolGrid } from "@/components/ToolGrid";

export const metadata: Metadata = {
  title: "All tools",
  description:
    "Free UK calculators: take-home pay, monthly budget, debt payoff, emergency fund, rent versus buy, and a bills converter.",
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
        Tools
      </h1>
      <p className="mt-2 max-w-2xl leading-relaxed text-muted">
        Every tool is free. Numbers stay in your browser unless you email a
        summary to yourself.
      </p>
      <ToolGrid className="mt-8" />
    </div>
  );
}
