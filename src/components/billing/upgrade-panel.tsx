import { Crown, LockKeyhole } from "lucide-react";
import Link from "next/link";

export function UpgradePanel({ accountType, title, description, returnHref }: { accountType: "student" | "teacher"; title: string; description: string; returnHref: string }) {
  const student = accountType === "student";
  return <section className="card mx-auto max-w-2xl p-7 text-center sm:p-10" aria-labelledby="upgrade-title">
    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200"><LockKeyhole /></span>
    <p className="mt-5 flex items-center justify-center gap-2 text-sm font-black text-amber-700 dark:text-amber-200"><Crown size={17}/>{student ? "STUDENT PLUS" : "TEACHER PRO"}</p>
    <h1 id="upgrade-title" className="mt-2 text-3xl font-black">{title}</h1>
    <p className="mx-auto mt-3 max-w-xl leading-7 text-muted">{description}</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href={`/pricing?account=${accountType}`} className="rounded-xl bg-[var(--violet)] px-5 py-3 font-black text-white">See {student ? "Student Plus" : "Teacher Pro"}</Link><Link href={returnHref} className="rounded-xl border px-5 py-3 font-black">Go back</Link></div>
  </section>;
}
