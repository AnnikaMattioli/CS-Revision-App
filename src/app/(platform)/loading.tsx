export default function Loading() {
  return <main id="main-content" tabIndex={-1} aria-busy="true" aria-live="polite" className="mx-auto max-w-6xl px-5 pb-16 pt-20 sm:px-8 lg:pt-12"><span className="sr-only">Loading page</span><div className="h-4 w-28 animate-pulse rounded bg-[var(--surface-soft)]" /><div className="mt-5 h-10 w-2/3 max-w-xl animate-pulse rounded-xl bg-[var(--surface-soft)]" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((item)=><div key={item} className="card h-44 animate-pulse bg-[var(--surface-soft)]" />)}</div></main>;
}
