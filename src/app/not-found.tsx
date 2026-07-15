import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return <main id="main-content" tabIndex={-1} className="grid min-h-screen place-items-center px-5 text-center"><div><p className="text-7xl font-black gradient-text">404</p><h1 className="mt-4 text-3xl font-black">That page has wandered off</h1><p className="mt-3 text-muted">Let&apos;s get you back to something useful.</p><ButtonLink href="/dashboard" className="mt-7">Go to dashboard</ButtonLink></div></main>;
}
