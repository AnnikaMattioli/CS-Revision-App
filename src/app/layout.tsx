import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SkipLink } from "@/components/ui/skip-link";

export const metadata: Metadata = {
  title: { default: "Bytewise | Computer Science revision", template: "%s | Bytewise" },
  description: "Friendly, focused Computer Science revision for UK students.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <SkipLink />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
