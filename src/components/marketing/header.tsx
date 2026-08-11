import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <Logo />
      <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-3">
        <span className="hidden sm:contents"><ButtonLink href="/pricing" variant="ghost">Pricing</ButtonLink></span>
        <ThemeToggle />
        <span className="hidden sm:contents"><ButtonLink href="/sign-in" variant="ghost">Sign in</ButtonLink></span>
        <ButtonLink href="/sign-up" className="px-4 sm:px-5">Get started</ButtonLink>
      </nav>
    </header>
  );
}
