import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { FlashcardDeck } from "@/components/content/flashcard-deck";
import { getActiveCourseContent } from "@/lib/content/repository";

export const metadata: Metadata = { title: "Flashcards" };
export default async function FlashcardsPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic: requestedTopic } = await searchParams; const course = await getActiveCourseContent(); const topic = course.topics.find((item) => item.slug === requestedTopic) ?? course.topics[0];
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-5 pb-20 pt-20 sm:px-8 lg:pt-10"><Breadcrumbs items={[{ label: "Flashcards" }]} /><div className="mb-7 text-center"><p className="font-black text-[var(--violet)]">ACTIVE RECALL</p><h1 className="mt-2 text-4xl font-black tracking-tight">Train your memory</h1><p className="mx-auto mt-3 max-w-2xl leading-7 text-muted">Try to answer before flipping each card, then rate how easily you remembered it.</p></div>{course.topics.length > 1 && <nav aria-label="Choose flashcard topic" className="mb-7 flex gap-2 overflow-x-auto pb-2">{course.topics.map((item) => <a key={item.id} href={`/flashcards?topic=${item.slug}`} className={`min-w-max rounded-xl border px-4 py-2 text-sm font-black ${item.id === topic?.id ? "bg-[var(--violet)] text-white" : "bg-[var(--surface)]"}`}>{item.icon} {item.title}</a>)}</nav>}{topic ? <FlashcardDeck cards={topic.flashcards} topicTitle={topic.title} /> : <div className="card p-8 text-center"><h2 className="text-xl font-black">No flashcard topics are published yet</h2></div>}</main>;
}
