import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <div className="max-w-xl rounded-3xl border border-border bg-panel p-8 shadow-[var(--shadow)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">Not found</p>
        <h1 className="mt-3 text-3xl font-semibold">This page does not exist.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          The route you opened was not matched by the app.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
