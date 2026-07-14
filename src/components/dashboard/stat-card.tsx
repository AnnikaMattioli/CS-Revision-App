import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, note, icon: Icon, colour }: { label: string; value: string; note: string; icon: LucideIcon; colour: string }) {
  return <article className="card p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-extrabold text-muted">{label}</p><p className="mt-2 text-3xl font-black tracking-tight">{value}</p></div><span className="grid size-11 place-items-center rounded-2xl" style={{ color: colour, background: `color-mix(in srgb, ${colour} 14%, transparent)` }}><Icon size={21} /></span></div><p className="mt-3 text-xs font-bold text-muted">{note}</p></article>;
}
