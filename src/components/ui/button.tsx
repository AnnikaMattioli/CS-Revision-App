import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  primary: "bg-[var(--violet)] text-white shadow-lg shadow-violet-500/20 hover:bg-[var(--violet-dark)]",
  secondary: "border bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-soft)]",
  ghost: "text-[var(--muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]",
};

export function ButtonLink({ href, children, variant = "primary", className }: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-extrabold transition hover:-translate-y-0.5", styles[variant], className)}>
      {children}
    </Link>
  );
}
