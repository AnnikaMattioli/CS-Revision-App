import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: { default: "Bytewise | Computer Science revision", template: "%s | Bytewise" },
  description: "Friendly, focused Computer Science revision for UK students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-lg bg-[var(--violet)] px-4 py-2 font-bold text-white focus:translate-y-0">Skip to content</a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
