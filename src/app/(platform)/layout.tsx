import { Sidebar } from "@/components/dashboard/sidebar";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--background)]"><Sidebar /><div className="lg:pl-72">{children}</div></div>;
}
