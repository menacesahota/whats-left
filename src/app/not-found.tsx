import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-serif text-3xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted">That address is not one of the tools.</p>
      <p className="mt-6">
        <Link href="/tools" className="font-medium text-accent">
          Back to all tools
        </Link>
      </p>
    </div>
  );
}
