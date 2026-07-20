const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const env = {
  supabaseUrl: url,
  supabasePublishableKey: key,
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
  classCodePepper: process.env.CLASS_CODE_PEPPER ?? process.env.SUPABASE_SECRET_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !url || !key,
};

export function hasSupabaseConfig() {
  return Boolean(!env.demoMode && url && key && !url.includes("your-project") && !key.includes("your_key"));
}
