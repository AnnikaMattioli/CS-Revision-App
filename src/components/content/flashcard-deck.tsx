"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Brain, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { Flashcard } from "@/types/content";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";

const ratings = [
  { value: 1, label: "Again", note: "Soon", colour: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200" },
  { value: 2, label: "Hard", note: "Tomorrow", colour: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200" },
  { value: 3, label: "Good", note: "3 days", colour: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200" },
  { value: 4, label: "Easy", note: "1 week", colour: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200" },
];

export function FlashcardDeck({ cards, topicTitle }: { cards: Flashcard[]; topicTitle: string }) {
  const [index, setIndex] = useState(0); const [flipped, setFlipped] = useState(false); const [complete, setComplete] = useState(false); const [remembered, setRemembered] = useState(0); const [error, setError] = useState<string>();
  const card = cards[index];

  async function rate(value: number) {
    setError(undefined);
    try {
      if (hasSupabaseConfig()) {
        const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) throw new Error("Sign in to save reviews.");
        const days = [0, 1, 3, 7][value - 1]; const next = new Date(); next.setDate(next.getDate() + days);
        const { error: reviewError } = await supabase.from("flashcard_reviews").insert({ user_id: user.id, flashcard_id: card.id, rating: value, next_review_at: next.toISOString() }); if (reviewError) throw reviewError;
      } else {
        const reviews = JSON.parse(window.localStorage.getItem("bytewise:flashcard-reviews") ?? "[]") as Array<{ cardId: string; rating: number; reviewedAt: string }>;
        reviews.push({ cardId: card.id, rating: value, reviewedAt: new Date().toISOString() }); window.localStorage.setItem("bytewise:flashcard-reviews", JSON.stringify(reviews.slice(-100)));
      }
      if (value >= 3) setRemembered((count) => count + 1);
      if (index === cards.length - 1) setComplete(true); else { setIndex((current) => current + 1); setFlipped(false); }
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Review could not be saved."); }
  }

  function restart() { setIndex(0); setFlipped(false); setComplete(false); setRemembered(0); setError(undefined); }
  if (!cards.length) return <div className="card p-8 text-center"><Brain className="mx-auto text-[var(--violet)]" size={42} /><h2 className="mt-4 text-xl font-black">No cards in this deck yet</h2></div>;
  if (complete) return <section className="card mx-auto max-w-xl p-8 text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-100 text-4xl dark:bg-emerald-500/15">🎉</span><h2 className="mt-5 text-3xl font-black">Deck complete!</h2><p className="mt-3 text-lg text-muted">You rated {remembered} of {cards.length} cards Good or Easy.</p><button onClick={restart} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--violet)] px-6 font-black text-white"><RotateCcw size={18} />Review again</button></section>;

  return <div className="mx-auto max-w-2xl"><div className="mb-4 flex items-center justify-between text-sm font-extrabold"><span>{topicTitle}</span><span className="text-muted">Card {index + 1} of {cards.length}</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]"><div className="h-full rounded-full bg-[var(--violet)] transition-all" style={{ width: `${((index + 1) / cards.length) * 100}%` }} /></div><button type="button" onClick={() => setFlipped((value) => !value)} className="mt-6 block min-h-[20rem] w-full rounded-[1.75rem] text-left" aria-label={flipped ? "Showing answer. Flip to see question." : "Showing question. Flip to reveal answer."}><AnimatePresence mode="wait" initial={false}>{!flipped ? <motion.span key={`front-${card.id}`} initial={{ opacity: 0, rotateY: -8 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: 8 }} className="card flex min-h-[20rem] flex-col items-center justify-center p-8 text-center"><span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">QUESTION</span><span className="mt-6 text-2xl font-black leading-9 sm:text-3xl">{card.front}</span>{card.hint && <span className="mt-6 flex items-center gap-2 text-sm font-bold text-muted"><Lightbulb size={17} />Hint: {card.hint}</span>}<span className="mt-auto pt-6 text-sm font-black text-[var(--violet)]">Tap to reveal answer</span></motion.span> : <motion.span key={`back-${card.id}`} initial={{ opacity: 0, rotateY: 8 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -8 }} className="flex min-h-[20rem] flex-col items-center justify-center rounded-[1.75rem] border-2 border-[var(--teal)] bg-emerald-50 p-8 text-center shadow-xl dark:bg-emerald-500/10"><CheckCircle2 className="text-[var(--teal)]" size={34} /><span className="mt-5 text-xs font-black text-emerald-800 dark:text-emerald-200">ANSWER</span><span className="mt-4 text-xl font-black leading-8 sm:text-2xl">{card.back}</span><span className="mt-auto pt-6 text-sm font-black text-emerald-800 dark:text-emerald-200">How well did you remember?</span></motion.span>}</AnimatePresence></button>{flipped && <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{ratings.map((rating) => <button key={rating.value} onClick={() => rate(rating.value)} className={`min-h-14 rounded-xl px-3 py-2 font-black transition hover:-translate-y-0.5 ${rating.colour}`}><span className="block">{rating.label}</span><span className="block text-[10px] opacity-70">{rating.note}</span></button>)}</div>}{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700 dark:bg-red-950/30 dark:text-red-200">{error}</p>}</div>;
}
