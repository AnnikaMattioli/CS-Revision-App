import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const links = [{href:"/privacy",label:"Privacy"},{href:"/terms",label:"Terms"},{href:"/accessibility",label:"Accessibility"},{href:"/contact",label:"Report an issue"}];
export function MarketingFooter(){return <footer className="border-t bg-[var(--surface)]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8"><Logo/><nav aria-label="Legal and support" className="flex flex-wrap gap-x-5 gap-y-3">{links.map((link)=><Link key={link.href} href={link.href} className="font-bold text-muted underline-offset-4 hover:underline">{link.label}</Link>)}</nav><p className="text-sm text-muted">© {new Date().getFullYear()} Bytewise</p></div></footer>}
