"use client";

import { ArrowRight, BookOpenCheck, Clock3, FileStack, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ExamConfig, ExamKind } from "@/types/exam";
import type { PracticeTopicOption } from "@/lib/practice/course-topics";

const kinds: Array<{ id: ExamKind; title: string; text: string; icon: React.ReactNode }> = [
  { id: "topic", title: "Topic test", text: "Focus on one area", icon: <BookOpenCheck /> },
  { id: "mixed", title: "Mixed test", text: "Balanced course retrieval", icon: <FileStack /> },
  { id: "custom", title: "Custom test", text: "Choose your settings", icon: <SlidersHorizontal /> },
  { id: "full_mock", title: "Full exam paper", text: "Complete timed component", icon: <Clock3 /> },
];

export function ExamSetup({ qualification, examBoard, topics }: { qualification: string; examBoard: string; topics: PracticeTopicOption[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<ExamKind>("mixed");
  const [topic, setTopic] = useState("mixed");
  const [paper, setPaper] = useState<"paper1" | "paper2">("paper1");
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState("mixed");
  const [minutes, setMinutes] = useState(15);
  const [backwards, setBackwards] = useState(true);
  const [warnings, setWarnings] = useState(true);
  const [release, setRelease] = useState<"immediate" | "later">("immediate");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string>();
  const availableTopics = topics.filter((item) => item.practiceAvailable);
  const aLevel = qualification === "A Level";
  const examAvailable = ((qualification === "GCSE" || aLevel) && ["OCR", "AQA"].includes(examBoard)) && availableTopics.length > 0;
  const fullPaperMarks = aLevel ? (examBoard === "AQA" ? 100 : 140) : examBoard === "AQA" ? 90 : 80;
  const fullPaperMinutes = aLevel ? 150 : examBoard === "AQA" ? (paper === "paper2" ? 105 : 120) : 90;
  const estimatedMarks = useMemo(() => Math.round(questionCount * 2), [questionCount]);

  async function start() {
    setStarting(true); setError(undefined);
    const config: ExamConfig = { kind, qualification, examBoard, topic: kind === "topic" ? topic : "mixed", paper: kind === "full_mock" ? paper : undefined, questionCount, difficulty, timeLimitMinutes: kind === "full_mock" ? fullPaperMinutes : minutes, allowBackwards: backwards, warnUnanswered: warnings, resultsRelease: release };
    try {
      const response = await fetch("/api/exam/start", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(config) });
      if (!response.ok) throw new Error();
      const data = await response.json() as { attemptId: string; questionIds: string[]; config: ExamConfig };
      const query = new URLSearchParams({ ids: data.questionIds.join(","), time: String(data.config.timeLimitMinutes), back: data.config.allowBackwards ? "1" : "0", warn: data.config.warnUnanswered ? "1" : "0", release: data.config.resultsRelease, kind: data.config.kind, board: data.config.examBoard, qualification: data.config.qualification, paper: data.config.paper ?? "" });
      router.push(`/exam-practice/session/${data.attemptId}?${query}`);
    } catch {
      setError("The exam could not be prepared. Please try again."); setStarting(false);
    }
  }

  const selectClass = "mt-2 h-12 w-full rounded-xl border bg-[var(--surface)] px-4 font-bold";
  return <div className="grid gap-6 lg:grid-cols-[1fr_19rem]">
    <section className="card p-6 sm:p-8">
      <h2 className="text-2xl font-black">Build your paper</h2>
      <fieldset className="mt-6"><legend className="font-black">Test type</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">{kinds.map((item) => <label key={item.id} className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 ${kind === item.id ? "border-[var(--violet)] bg-violet-50 dark:bg-violet-500/10" : ""}`}><input type="radio" name="kind" value={item.id} checked={kind === item.id} onChange={() => setKind(item.id)} /><span className="text-[var(--violet)]">{item.icon}</span><span><span className="block font-black">{item.title}</span><span className="text-sm text-muted">{item.text}</span></span></label>)}</div></fieldset>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <label className="text-sm font-black">Qualification<select className={selectClass} disabled><option>{qualification}</option></select></label>
        <label className="text-sm font-black">Exam board<select className={selectClass} disabled><option>{examBoard}</option></select></label>
        <label className="text-sm font-black">Topic<select className={selectClass} disabled={kind !== "topic" || !examAvailable} value={topic} onChange={(event) => setTopic(event.target.value)}><option value="mixed">Choose a topic</option>{topics.map((item) => <option key={item.slug} value={item.slug} disabled={!item.practiceAvailable}>{item.icon} {item.title}{item.practiceAvailable ? "" : " — coming soon"}</option>)}</select></label>
        {kind === "full_mock" ? <label className="text-sm font-black">{examBoard} component<select className={selectClass} value={paper} onChange={(event) => setPaper(event.target.value as "paper1" | "paper2")}><option value="paper1">Paper 1 · {aLevel && examBoard === "AQA" ? "Programming and theory" : examBoard === "AQA" ? "Computational thinking and programming" : "Computer systems"}</option><option value="paper2">Paper 2 · {aLevel && examBoard === "AQA" ? "Computing concepts" : examBoard === "AQA" ? "Computing concepts" : "Algorithms and programming"}</option></select></label> : <label className="text-sm font-black">Questions<select className={selectClass} value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))}><option value="5">5 questions</option><option value="10">10 questions</option><option value="20">20 questions</option></select></label>}
        <label className="text-sm font-black">Difficulty<select className={selectClass} value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="mixed">Mixed difficulty</option><option value="foundation">Foundation</option><option value="developing">Developing</option><option value="secure">Secure</option><option value="advanced">Advanced</option></select></label>
        <label className="text-sm font-black">Time limit<select className={selectClass} value={minutes} onChange={(event) => setMinutes(Number(event.target.value))}><option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="30">30 minutes</option></select></label>
      </div>
      <fieldset className="mt-7 space-y-3"><legend className="font-black">Exam rules</legend><Toggle checked={backwards} onChange={setBackwards} label="Allow backwards navigation" detail="Students can revisit earlier questions." /><Toggle checked={warnings} onChange={setWarnings} label="Warn about unanswered questions" detail="Show a reminder before final submission." /><label className="flex items-center justify-between gap-4 rounded-xl border p-4"><span><span className="block font-black">Results release</span><span className="text-sm text-muted">Show feedback now or hold it for later release.</span></span><select aria-label="Results release" value={release} onChange={(event) => setRelease(event.target.value as "immediate" | "later")} className="h-10 rounded-lg border bg-[var(--surface)] px-3 font-bold"><option value="immediate">Immediately</option><option value="later">Later</option></select></label></fieldset>
      {!examAvailable ? <p role="status" className="mt-5 rounded-xl bg-amber-50 p-3 font-bold text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">Timed questions for {examBoard} {qualification} are being written. All specification topics are already available in Learn.</p> : null}
      {error ? <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 font-bold text-red-700">{error}</p> : null}
      <button onClick={start} disabled={starting || !examAvailable || (kind === "topic" && topic === "mixed")} className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--violet)] px-6 font-black text-white disabled:opacity-50">{starting ? <LoaderCircle className="animate-spin" /> : <>Start timed test <ArrowRight size={18} /></>}</button>
    </section>
    <aside className="space-y-4"><div className="rounded-2xl bg-slate-950 p-6 text-white"><p className="text-sm font-black text-violet-300">PAPER SUMMARY</p><p className="mt-4 text-3xl font-black">{kind === "full_mock" ? (paper === "paper1" ? "Paper 1" : "Paper 2") : `${questionCount} questions`}</p><p className="mt-2 text-slate-300">{kind === "full_mock" ? fullPaperMarks : `About ${estimatedMarks}`} available marks</p><p className="mt-1 text-slate-300">{kind === "full_mock" ? fullPaperMinutes : minutes} minute limit</p></div><div className="soft-card p-5"><p className="font-black">Exam conditions</p><ul className="mt-3 space-y-2 text-sm leading-6 text-muted"><li>✓ Answers autosave</li><li>✓ No hints or feedback</li><li>✓ Automatic time submission</li><li>✓ Review flags and palette</li></ul></div><p className="px-2 text-xs leading-5 text-muted">Full papers follow the selected exam board’s component structure. Questions are original and no official grade boundaries are inferred.</p></aside>
  </div>;
}

function Toggle({ checked, onChange, label, detail }: { checked: boolean; onChange: (value: boolean) => void; label: string; detail: string }) {
  return <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4"><span><span className="block font-black">{label}</span><span className="text-sm text-muted">{detail}</span></span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5" /></label>;
}
