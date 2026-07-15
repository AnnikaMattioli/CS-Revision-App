"use client";

import { ArrowRight, Clock3, LoaderCircle, Shuffle, Target } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type PracticeTopicOption = { slug: string; title: string; icon: string; practiceAvailable: boolean };

export function PracticeLauncher({ initialTopic = "mixed", initialMode = "adaptive", topics }: { initialTopic?: string; initialMode?: string; topics: PracticeTopicOption[] }) {
  const router = useRouter();
  const [topic, setTopic] = useState(initialTopic);
  const [mode, setMode] = useState(initialMode);
  const [difficulty, setDifficulty] = useState("mixed");
  const [timer, setTimer] = useState("untimed");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string>();
  const selectedTopic = topics.find((item) => item.slug === topic);
  const topicUnavailable = topic !== "mixed" && !selectedTopic?.practiceAvailable;

  async function start() {
    setStarting(true);
    setError(undefined);

    try {
      const response = await fetch("/api/practice/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic, difficulty, timer, mode }),
      });

      if (!response.ok) throw new Error("Could not start practice set");
      const { attemptId, questionIds } = (await response.json()) as { attemptId: string; questionIds?: string[] };
      const ids = questionIds?.length ? `&ids=${questionIds.join(",")}` : "";
      router.push(`/practise/session/${attemptId}?topic=${topic}&difficulty=${difficulty}&timer=${timer}${ids}`);
    } catch {
      setError("The set could not be started. Please try again.");
      setStarting(false);
    }
  }

  const selectClass = "mt-2 h-12 w-full rounded-xl border bg-[var(--surface)] px-4 font-bold";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl font-black">Build your set</h2>
        <p className="mt-2 text-muted">Choose a focus. Every set contains 10 original exam-style questions.</p>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          <label className="text-sm font-extrabold">
            Topic
            <select value={topic} onChange={(event) => setTopic(event.target.value)} className={selectClass}>
              <option value="mixed">Mixed topics</option>
              {topics.map((item) => <option key={item.slug} value={item.slug} disabled={!item.practiceAvailable}>{item.icon} {item.title}{item.practiceAvailable ? "" : " — questions coming soon"}</option>)}
            </select>
          </label>
          <label className="text-sm font-extrabold">
            Set style
            <select value={mode} onChange={(event) => setMode(event.target.value)} className={selectClass}>
              <option value="adaptive">Adaptive mix</option>
              <option value="weak">Weakest areas</option>
              <option value="unseen">Unseen questions</option>
              <option value="all">Balanced course mix</option>
            </select>
          </label>
          <label className="text-sm font-extrabold">
            Difficulty
            <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className={selectClass}>
              <option value="mixed">Balanced mix</option>
              <option value="foundation">Foundation</option>
              <option value="developing">Developing</option>
              <option value="secure">Secure</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
        </div>
        <fieldset className="mt-6">
          <legend className="text-sm font-extrabold">Timing</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ["untimed", "Untimed", "Work at your own pace"],
              ["15", "15 minute target", "A gentle pace reminder"],
            ].map(([value, label, detail]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 ${timer === value ? "border-[var(--violet)] bg-violet-50 dark:bg-violet-500/10" : ""}`}
              >
                <input type="radio" name="timer" value={value} checked={timer === value} onChange={(event) => setTimer(event.target.value)} />
                <span>
                  <span className="block font-black">{label}</span>
                  <span className="text-sm text-muted">{detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        {topicUnavailable ? <p role="status" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">This topic is available in Learn, but its practice questions are still being written. Choose Mixed topics or another available topic.</p> : null}
        {error ? <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p> : null}
        <button onClick={start} disabled={starting || topicUnavailable} className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--violet)] px-6 font-black text-white shadow-lg shadow-violet-500/20 disabled:opacity-60">
          {starting ? <LoaderCircle className="animate-spin" size={18} /> : <><span>Start 10-question set</span><ArrowRight size={18} /></>}
        </button>
      </section>
      <aside className="space-y-4">
        <InfoCard icon={<Target />} title="10 questions">A purposeful mix of recall, explanation and application.</InfoCard>
        <InfoCard icon={<Shuffle />} title="Multiple formats">Choices, written answers, calculations, ordering and matching.</InfoCard>
        <InfoCard icon={<Clock3 />} title="Autosaved">Refresh safely and continue the unfinished set.</InfoCard>
      </aside>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="soft-card p-5">
      <span className="text-[var(--violet)]">{icon}</span>
      <p className="mt-3 font-black">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted">{children}</p>
    </div>
  );
}
