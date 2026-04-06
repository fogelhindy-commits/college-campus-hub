"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-10 text-foreground">
      <div className="max-w-xl rounded-3xl border border-border bg-panel p-8 shadow-[var(--shadow)]">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-semibold">The app hit an error.</h1>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted">
          {error.message}
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted">Digest: {error.digest}</p>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
