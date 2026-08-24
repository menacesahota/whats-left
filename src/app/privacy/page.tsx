import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Privacy",
  description: `${SITE_NAME} does not create accounts. Calculator numbers stay in your browser. Email summaries are sent from your own mail app.`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        Privacy
      </h1>
      <p className="mt-4 text-muted">
        There are no user accounts. You do not need to give us an email address
        to use the tools.
      </p>
      <p className="mt-4 text-muted">
        Some tools save what you type in your browser with localStorage so it is
        still there when you come back. That data does not leave your device
        unless you copy it or use “Email me this”.
      </p>
      <p className="mt-4 text-muted">
        “Email me this” opens your own mail app with a summary in the message.
        We do not send that email, and we do not receive a copy.
      </p>
      <p className="mt-4 text-muted">
        This site does not connect to your bank.
      </p>
    </article>
  );
}
