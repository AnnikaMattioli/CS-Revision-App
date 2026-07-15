import { Sidebar } from "@/components/dashboard/sidebar";
import { getCurrentAccount } from "@/lib/auth/account";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const account = await getCurrentAccount();
  return <div className="min-h-screen bg-[var(--background)]"><Sidebar role={account?.role ?? "student"} /><div className="lg:pl-72">{children}</div></div>;
}
