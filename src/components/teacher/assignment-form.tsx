"use client";

import { Crown, LoaderCircle, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AssignmentForm({ classId, topics, classTests }: { classId: string; topics: Array<{ id: string; title: string }>; classTests: boolean }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [targetType, setTargetType] = useState<"topic" | "practice_set">("topic");
  const [topicId, setTopicId] = useState(topics[0]?.id ?? "");
  const [dueAt, setDueAt] = useState("");
  const [minutes, setMinutes] = useState(15);
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [upgrade, setUpgrade] = useState(false);
  useEffect(() => { const frame = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(frame); }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(undefined); setUpgrade(false);
    const payload = { title, instructions, targetType, topicId: targetType === "topic" ? topicId : undefined, timeLimitMinutes: targetType === "practice_set" ? minutes : undefined, dueAt: dueAt ? new Date(dueAt).toISOString() : undefined, status };
    const response = await fetch(`/api/classes/${classId}/assignments`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    const body = await response.json();
    if (!response.ok) { setBusy(false); setUpgrade(body.code === "resource_limit_reached" || body.code === "entitlement_required"); return setError(body.error ?? "The assignment could not be created."); }
    router.push(`/classes/${classId}/assignments/${body.assignmentId}`); router.refresh();
  }

  const field = "mt-2 h-12 w-full rounded-xl border bg-[var(--surface)] px-4 font-bold";
  return <form onSubmit={submit} className="card space-y-6 p-6 sm:p-8">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-black sm:col-span-2">Assignment title<input disabled={!ready} required minLength={2} maxLength={100} className={`${field} disabled:opacity-60`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Networks retrieval practice" /></label>
      <label className="text-sm font-black sm:col-span-2">Instructions<textarea maxLength={1000} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="mt-2 min-h-28 w-full rounded-xl border bg-[var(--surface)] p-4 font-medium" placeholder="What should students focus on?" /></label>
      <label className="text-sm font-black">Assignment type<select aria-label="Assignment type" className={field} value={targetType} onChange={(e) => setTargetType(e.target.value as "topic" | "practice_set")}><option value="topic">Course topic</option><option value="practice_set" disabled={!classTests}>Timed test{classTests ? "" : " — Teacher Pro"}</option></select></label>
      {targetType === "topic" ? <label className="text-sm font-black">Topic<select aria-label="Topic" className={field} value={topicId} onChange={(e) => setTopicId(e.target.value)}>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label> : <label className="text-sm font-black">Time limit<select aria-label="Time limit" className={field} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option></select></label>}
      <label className="text-sm font-black">Optional due date<input aria-label="Optional due date" type="datetime-local" className={field} value={dueAt} onChange={(e) => setDueAt(e.target.value)} /></label>
      <label className="text-sm font-black">Release<select aria-label="Release" className={field} value={status} onChange={(e) => setStatus(e.target.value as "draft" | "published")}><option value="published">Publish now</option><option value="draft">Save draft</option></select></label>
    </div>
    {!classTests ? <aside className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:bg-amber-500/10 dark:text-amber-100"><p className="flex items-center gap-2 font-black"><Crown size={18}/>Timed class tests are included with Teacher Pro</p><p className="mt-1 text-sm leading-6">Topic assignments, due dates and completion tracking remain available on Teacher Free.</p><Link href="/pricing?account=teacher" className="mt-2 inline-block font-black underline">Explore Teacher Pro</Link></aside> : null}
    {error ? <div role="alert" className="rounded-xl bg-red-50 p-3 font-bold text-red-700"><p>{error}</p>{upgrade?<Link href="/pricing?account=teacher" className="mt-2 inline-block underline">See Teacher Pro options</Link>:null}</div> : null}
    <button disabled={busy || !ready || (targetType === "topic" && !topicId)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--violet)] px-5 font-black text-white disabled:opacity-50">{busy ? <LoaderCircle className="animate-spin" /> : <><Send size={18} />{status === "published" ? "Publish assignment" : "Save draft"}</>}</button>
  </form>;
}
