export function LeftoverSketch() {
  return (
    <figure className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_8px_24px_-12px_rgba(28,25,23,0.12)]">
      <figcaption className="mb-5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">A month, boiled down</span>
        <span className="text-xs text-muted">Example</span>
      </figcaption>
      <dl className="space-y-4">
        <Bar label="Take-home" amount="£2,840" width="100%" tone="muted" />
        <Bar label="Bills and spending" amount="£2,050" width="72%" tone="mid" />
        <div className="-mx-2 rounded-xl bg-accent/10 px-2 py-3">
          <Bar label="What's left" amount="£790" width="28%" tone="accent" />
        </div>
      </dl>
    </figure>
  );
}

function Bar({
  label,
  amount,
  width,
  tone,
}: {
  label: string;
  amount: string;
  width: string;
  tone: "muted" | "mid" | "accent";
}) {
  const fill =
    tone === "accent"
      ? "bg-accent"
      : tone === "mid"
        ? "bg-foreground/20"
        : "bg-foreground/10";

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <dt
          className={
            tone === "accent" ? "font-medium text-foreground" : "text-muted"
          }
        >
          {label}
        </dt>
        <dd
          className={
            tone === "accent"
              ? "font-serif text-lg font-semibold tracking-tight text-accent"
              : "tabular-nums text-foreground"
          }
        >
          {amount}
        </dd>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div className={`h-full rounded-full ${fill}`} style={{ width }} />
      </div>
    </div>
  );
}
