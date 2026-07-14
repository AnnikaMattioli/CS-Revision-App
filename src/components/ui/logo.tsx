import Link from "next/link";
import { Braces } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 rounded-xl font-black tracking-tight">
      <span className="grid size-10 place-items-center rounded-xl bg-[var(--violet)] text-white shadow-lg shadow-violet-500/20">
        <Braces aria-hidden="true" size={22} strokeWidth={2.7} />
      </span>
      {!compact && <span className="text-xl">byte<span className="text-[var(--violet)]">wise</span></span>}
      <span className="sr-only">Bytewise home</span>
    </Link>
  );
}
