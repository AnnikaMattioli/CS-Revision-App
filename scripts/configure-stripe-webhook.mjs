import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath=resolve(process.cwd(),".env.local");
const secret=execFileSync("stripe",["listen","--print-secret"],{encoding:"utf8",stdio:["ignore","pipe","inherit"]}).trim();
if(!secret.startsWith("whsec_"))throw new Error("Stripe CLI did not return a webhook signing secret.");
const current=readFileSync(envPath,"utf8");
const next=/^STRIPE_WEBHOOK_SECRET=.*$/m.test(current)?current.replace(/^STRIPE_WEBHOOK_SECRET=.*$/m,`STRIPE_WEBHOOK_SECRET=${secret}`):`${current.trimEnd()}\nSTRIPE_WEBHOOK_SECRET=${secret}\n`;
writeFileSync(envPath,next,{encoding:"utf8",mode:0o600});
console.log("Stripe CLI webhook signing secret saved to the ignored .env.local file.");
