"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" tabIndex={-1} className="grid min-h-screen place-items-center px-5 text-center"><div><p className="text-5xl" aria-hidden="true">🛠️</p><h1 className="mt-4 text-3xl font-black">Something didn&apos;t quite compile</h1><p className="mt-3 text-muted">Your work is safe. Try loading this part again.</p><button onClick={reset} className="mt-7 min-h-11 rounded-xl bg-[var(--violet)] px-6 font-black text-white">Try again</button></div></main>;
}
