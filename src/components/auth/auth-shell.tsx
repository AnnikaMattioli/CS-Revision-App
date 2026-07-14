import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AuthShell({ title, copy, children }: { title: string; copy: string; children: React.ReactNode }) {
  return (
    <div className="dot-grid min-h-screen">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8"><Logo /><ThemeToggle /></header>
      <main id="main-content" className="mx-auto flex max-w-6xl items-center justify-center px-5 py-10 sm:px-8 lg:py-16">
        <section className="card w-full max-w-md p-6 sm:p-9">
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
          <p className="mt-2 leading-7 text-muted">{copy}</p>
          {children}
        </section>
      </main>
    </div>
  );
}
