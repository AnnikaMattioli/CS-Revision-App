import { topicProgress } from "@/lib/demo-data";
import Link from "next/link";

export function CourseProgress() {
  return <section className="card p-5 sm:p-6"><div className="flex items-end justify-between"><div><p className="text-sm font-extrabold text-muted">YOUR COURSE</p><h2 className="mt-1 text-xl font-black">Topic progress</h2></div><Link href="/learn" className="text-sm font-black text-[var(--violet)] hover:underline">View course</Link></div><div className="mt-6 space-y-5">{topicProgress.map((topic) => <div key={topic.name}><div className="mb-2 flex items-center justify-between text-sm font-extrabold"><span>{topic.name}</span><span className="text-muted">{topic.progress}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-soft)]"><div className="h-full rounded-full" style={{ width: `${topic.progress}%`, background: topic.colour }} /></div></div>)}</div></section>;
}
