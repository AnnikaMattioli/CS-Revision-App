import type {Metadata} from "next";
import {CheckoutConfirmation} from "@/components/billing/checkout-confirmation";
export const metadata:Metadata={title:"Confirming payment"};
export default async function SuccessPage({searchParams}:{searchParams:Promise<{session_id?:string}>}){const {session_id}=await searchParams;return <main id="main-content" tabIndex={-1} className="grid min-h-screen place-items-center px-5 py-16"><section className="card w-full max-w-2xl p-8 text-center sm:p-12"><CheckoutConfirmation sessionId={session_id}/></section></main>}
