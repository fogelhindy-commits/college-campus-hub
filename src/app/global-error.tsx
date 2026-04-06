"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <main className="flex min-h-screen items-center justify-center px-6 py-10">
          <div className="max-w-xl rounded-3xl border border-border bg-panel p-8 shadow-[var(--shadow)]">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              Global error
            </p>
            <h1 className="mt-3 text-3xl font-semibold">The app could not render.</h1>
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
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
