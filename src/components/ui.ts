export const inputClass =
  "w-full rounded-xl border border-border bg-card px-3 py-2.5 text-base text-foreground shadow-sm outline-none transition-[box-shadow,border-color] focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30";

export const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

export const hintClass = "mt-1.5 text-sm leading-relaxed text-muted";

export const errorClass = "mt-1.5 text-sm text-danger";

export const btnPrimary =
  "inline-flex items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-accent-hover focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const btnSecondary =
  "inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-background focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const btnGhost =
  "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium text-muted hover:bg-card hover:text-foreground";

export const cardClass =
  "rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(28,25,23,0.04),0_8px_24px_-12px_rgba(28,25,23,0.12)]";

export const choiceGroupClass =
  "inline-flex flex-wrap gap-1 rounded-full border border-border bg-background p-1";

export const choiceClass = (active: boolean) =>
  `cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent has-[:focus-visible]:ring-offset-2 ${
    active
      ? "bg-accent text-white shadow-sm"
      : "text-muted hover:bg-card hover:text-foreground"
  }`;
