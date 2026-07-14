import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto"><ol className="flex min-w-max items-center gap-2 text-sm font-bold text-muted"><li><Link href="/dashboard" className="rounded-lg hover:text-[var(--violet)]" aria-label="Dashboard"><Home size={16} /></Link></li>{items.map((item) => <li key={`${item.label}-${item.href ?? "current"}`} className="flex items-center gap-2"><ChevronRight size={14} aria-hidden="true" />{item.href ? <Link href={item.href} className="rounded-lg hover:text-[var(--violet)]">{item.label}</Link> : <span aria-current="page" className="text-[var(--foreground)]">{item.label}</span>}</li>)}</ol></nav>;
}
