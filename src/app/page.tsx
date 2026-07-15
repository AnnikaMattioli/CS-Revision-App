import { ArrowRight, Brain, ChartNoAxesCombined, CheckCircle2, Layers3, Sparkles } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { ButtonLink } from "@/components/ui/button";
import { MarketingFooter } from "@/components/marketing/footer";

const features = [
  { icon: Layers3, title: "Learn it clearly", copy: "Focused notes organise every topic into manageable steps.", colour: "var(--blue)" },
  { icon: Brain, title: "Practise actively", copy: "Flashcards and questions turn reading into lasting knowledge.", colour: "var(--violet)" },
  { icon: ChartNoAxesCombined, title: "See your progress", copy: "Friendly insights show where to focus your next session.", colour: "var(--teal)" },
];

export default async function HomePage({ searchParams }: { searchParams: Promise<{ account?: string }> }) {
  const accountDeleted = (await searchParams).account === "deleted";
  return (
    <div className="dot-grid min-h-screen overflow-hidden">
      <MarketingHeader />
      {accountDeleted ? <p role="status" className="mx-auto mt-3 max-w-7xl rounded-xl bg-emerald-100 px-5 py-3 font-bold text-emerald-900">Your account and personal learning data were deleted.</p> : null}
      <main id="main-content" tabIndex={-1}>
        <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:pb-28 lg:pt-20">
          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border bg-[var(--surface)] px-4 py-2 text-sm font-extrabold text-[var(--violet)] shadow-sm">
              <Sparkles size={16} aria-hidden="true" /> Computer Science, made click.
            </span>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Revision that helps ideas <span className="gradient-text">fall into place.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
              Build confidence in GCSE and A-level Computer Science with clear learning paths, purposeful practice and progress you can actually see.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/sign-up" className="px-7 py-3.5">Start revising free <ArrowRight size={18} /></ButtonLink>
              <ButtonLink href="/dashboard" variant="secondary" className="px-7 py-3.5">Explore the demo</ButtonLink>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-muted">
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[var(--teal)]" /> OCR & AQA</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[var(--teal)]" /> GCSE & A-level</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-[var(--teal)]" /> Free core access</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-12 -top-12 size-44 rounded-full bg-[var(--yellow)] opacity-25 blur-3xl" />
            <div className="absolute -bottom-12 -right-12 size-52 rounded-full bg-[var(--teal)] opacity-20 blur-3xl" />
            <div className="card relative rotate-1 p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div><p className="text-sm font-bold text-muted">TODAY&apos;S FOCUS</p><h2 className="mt-1 text-2xl font-black">Memory & storage</h2></div>
                <div className="grid size-14 place-items-center rounded-2xl bg-violet-100 text-2xl dark:bg-violet-500/15">💾</div>
              </div>
              <div className="soft-card p-5">
                <div className="flex justify-between text-sm font-extrabold"><span>Topic progress</span><span className="text-[var(--violet)]">68%</span></div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-[var(--border)]"><div className="h-full w-[68%] rounded-full bg-[var(--violet)]" /></div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-500/10"><span className="text-2xl">⚡</span><p className="mt-3 font-black">12 min lesson</p><p className="mt-1 text-sm text-muted">Secondary storage</p></div>
                <div className="rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-500/10"><span className="text-2xl">🎯</span><p className="mt-3 font-black">10 questions</p><p className="mt-1 text-sm text-muted">Target your weak spots</p></div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[var(--foreground)] p-4 text-[var(--background)]">
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--yellow)] text-lg text-slate-900">🔥</span>
                <div><p className="font-black">7 day streak</p><p className="text-sm opacity-70">A little every day adds up.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, copy, colour }) => (
              <article key={title} className="card p-6 transition hover:-translate-y-1">
                <span className="grid size-12 place-items-center rounded-2xl" style={{ background: `color-mix(in srgb, ${colour} 13%, transparent)`, color: colour }}><Icon aria-hidden="true" /></span>
                <h2 className="mt-5 text-xl font-black">{title}</h2><p className="mt-2 leading-7 text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
