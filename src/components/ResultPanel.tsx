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
    <aside className={`${cardClass} print-result h-fit`}>
      <h2 className="font-serif text-xl font-semibold">{title}</h2>
      {warning ? (
        <p
          className="mt-3 rounded-md bg-danger-bg px-3 py-2 text-sm text-danger"
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
    <div className="flex items-baseline justify-between gap-4 border-b border-border py-2 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd
        className={
          emphasise
            ? "font-serif text-xl font-semibold"
            : "text-base font-medium"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export function EmptyResult({ message }: { message: string }) {
  return <p className="text-sm text-muted">{message}</p>;
}
