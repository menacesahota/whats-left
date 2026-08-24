import type { ReactNode } from "react";
import { cardClass } from "./ui";

type ResultPanelProps = {
  title?: string;
  children: ReactNode;
  warning?: string;
};

export function ResultPanel({
  title = "Result",
  children,
  warning,
}: ResultPanelProps) {
  return (
    <aside
      className={`${cardClass} print-result relative h-fit overflow-hidden sm:p-6`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
      <p className="text-xs font-medium tracking-wide text-accent uppercase">
        Result
      </p>
      <h2 className="mt-1 font-serif text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {warning ? (
        <p
          className="mt-3 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger"
          role="status"
        >
          {warning}
        </p>
      ) : null}
      <div className="mt-4">{children}</div>
    </aside>
  );
}

export function ResultRow({
  label,
  value,
  emphasise,
}: {
  label: string;
  value: string;
  emphasise?: boolean;
}) {
  return (
    <div
      className={
        emphasise
          ? "-mx-2 mb-1 flex items-baseline justify-between gap-4 rounded-xl bg-accent/10 px-2 py-3"
          : "flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-b-0"
      }
    >
      <dt className="text-sm text-muted">{label}</dt>
      <dd
        className={
          emphasise
            ? "font-serif text-2xl font-semibold tracking-tight text-accent"
            : "text-base font-medium tabular-nums"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export function EmptyResult({ message }: { message: string }) {
  return <p className="text-sm leading-relaxed text-muted">{message}</p>;
}
