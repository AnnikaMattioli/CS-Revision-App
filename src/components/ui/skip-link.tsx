"use client";

export function SkipLink() {
  return <a href="#main-content" onClick={(event) => { const target = document.getElementById("main-content"); if (!target) return; event.preventDefault(); target.focus(); target.scrollIntoView(); }} className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-lg bg-[var(--violet)] px-4 py-2 font-bold text-white focus:translate-y-0">Skip to content</a>;
}
