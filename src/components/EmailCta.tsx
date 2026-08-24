"use client";

import { btnPrimary, btnSecondary } from "./ui";

type EmailCtaProps = {
  subject: string;
  body: string;
  disabled?: boolean;
};

export function EmailCta({ subject, body, disabled }: EmailCtaProps) {
  // TODO: paid PDF export (Stripe) later
  const href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="no-print mt-6 flex flex-wrap gap-3">
      {disabled ? (
        <span className={`${btnPrimary} cursor-not-allowed opacity-50`}>
          Email me this
        </span>
      ) : (
        <a href={href} className={btnPrimary}>
          Email me this
        </a>
      )}
      <button
        type="button"
        className={btnSecondary}
        onClick={() => window.print()}
      >
        Print summary
      </button>
    </div>
  );
}
