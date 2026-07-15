"use client";

import { Award, BookOpen, Brain, ChartNoAxesCombined, ClipboardCheck, FlaskConical, Home, LogOut, Menu, NotebookTabs, Settings, ShieldCheck, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { hasSupabaseConfig } from "@/lib/env";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: Home, available: true },
  { label: "Learn", href: "/learn", icon: BookOpen, available: true },
  { label: "Practise", href: "/practise", icon: Brain, available: true },
  { label: "Flashcards", href: "/flashcards", icon: NotebookTabs, available: true },
  { label: "Worked solutions", href: "/worked-solutions", icon: FlaskConical, available: true },
  { label: "Exam practice", href: "/exam-practice", icon: ClipboardCheck, available: true },
  { label: "Progress", href: "/progress", icon: ChartNoAxesCombined, available: true },
  { label: "Achievements", href: "/achievements", icon: Award, available: true },
  { label: "Classes", href: "/classes", icon: Users, available: true },
  { label: "Admin", href: "/admin", icon: ShieldCheck, available: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    if (hasSupabaseConfig()) await createClient().auth.signOut();
    router.push("/");
    router.refresh();
  }

  const content = <>
    <div className="flex h-20 items-center justify-between px-5"><Logo /><button className="grid size-10 place-items-center rounded-xl lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></div>
    <nav aria-label="Learning navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {nav.map(({ label, href, icon: Icon, available }) => available ? (
        <Link key={label} href={href} onClick={() => setOpen(false)} aria-current={pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)) ? "page" : undefined} className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3 font-extrabold transition", pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)) ? "bg-violet-100 text-[var(--violet)] dark:bg-violet-500/15" : "text-muted hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]")}><Icon size={19} aria-hidden="true" />{label}</Link>
      ) : (
        <span key={label} className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-xl px-3 font-bold text-muted opacity-60" title="Coming in a later build phase"><Icon size={19} aria-hidden="true" /><span className="flex-1">{label}</span><span className="text-[10px] font-black uppercase tracking-wide">Soon</span></span>
      ))}
    </nav>
    <div className="space-y-1 border-t p-3">
      <Link href="/settings" aria-current={pathname === "/settings" ? "page" : undefined} className="flex min-h-11 items-center gap-3 rounded-xl px-3 font-extrabold text-muted hover:bg-[var(--surface-soft)]"><Settings size={19} aria-hidden="true" />Settings</Link>
      <button onClick={signOut} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 font-extrabold text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"><LogOut size={19} aria-hidden="true" />Sign out</button>
    </div>
  </>;

  return <>
    <button onClick={() => setOpen(true)} className="fixed left-4 top-4 z-30 grid size-11 place-items-center rounded-xl border bg-[var(--surface)] shadow lg:hidden" aria-label="Open navigation"><Menu /></button>
    {open && <><button className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation backdrop" /><aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-[var(--surface)] lg:hidden" aria-label="Sidebar">{content}</aside></>}
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r bg-[var(--surface)] lg:flex" aria-label="Sidebar">{content}</aside>
  </>;
}
