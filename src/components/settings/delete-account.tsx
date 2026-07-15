"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig } from "@/lib/env";

export function DeleteAccount() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true); setError("");
    const response = await fetch("/api/account", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ confirmation }) });
    const body = await response.json();
    if (!response.ok) { setBusy(false); setError(body.error); return; }
    window.localStorage.clear();
    if (hasSupabaseConfig()) await createClient().auth.signOut();
    router.push("/?account=deleted"); router.refresh();
  }

  return <>
    <button onClick={() => dialog.current?.showModal()} className="mt-5 flex min-h-11 items-center gap-2 rounded-xl border border-red-300 px-4 font-black text-red-700 dark:text-red-300"><Trash2 size={18} />Delete account</button>
    <dialog ref={dialog} aria-labelledby="delete-account-title" className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border bg-[var(--surface)] p-0 text-[var(--foreground)] shadow-2xl backdrop:bg-slate-950/60">
      <div className="p-6">
        <div className="flex items-start justify-between gap-4"><div><AlertTriangle className="text-red-600" /><h3 id="delete-account-title" className="mt-3 text-2xl font-black">Delete your account?</h3></div><button onClick={() => dialog.current?.close()} aria-label="Close delete account dialog" className="grid size-10 place-items-center rounded-xl"><X /></button></div>
        <p className="mt-3 leading-7 text-muted">This permanently removes your account and associated personal learning data. It cannot be undone.</p>
        <label className="mt-5 block font-bold">Type <span className="font-black">DELETE</span> to confirm<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" className="mt-2 h-12 w-full rounded-xl border bg-[var(--background)] px-4" /></label>
        {error ? <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 font-bold text-red-800 dark:bg-red-500/10 dark:text-red-200">{error}</p> : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => dialog.current?.close()} className="min-h-11 rounded-xl border font-black">Keep my account</button><button onClick={() => void remove()} disabled={confirmation !== "DELETE" || busy} className="min-h-11 rounded-xl bg-red-600 font-black text-white disabled:opacity-50">{busy ? "Deleting…" : "Delete permanently"}</button></div>
      </div>
    </dialog>
  </>;
}
