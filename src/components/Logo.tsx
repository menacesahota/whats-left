/** Leftover pie: stone spent, teal quarter remaining. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="16" fill="#D6D0C4" />
      <path d="M16 16L16 0A16 16 0 0 1 32 16Z" fill="#0F766E" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={compact ? "h-7 w-7" : "h-7 w-7 sm:h-9 sm:w-9"} />
      <span
        className={`inline-flex items-baseline whitespace-nowrap font-sans tracking-[-0.04em] ${
          compact ? "text-[0.98rem]" : "text-[0.95rem] sm:text-[1.1rem]"
        }`}
      >
        <span className="font-medium text-muted">What’s</span>
        <span className="ml-[0.28em] font-semibold text-foreground">Left</span>
      </span>
    </span>
  );
}
