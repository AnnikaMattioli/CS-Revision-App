const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const env = {
  supabaseUrl: url,
  supabasePublishableKey: key,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !url || !key,
};

export function hasSupabaseConfig() {
  return Boolean(url && key && !url.includes("your-project") && !key.includes("your_key"));
}
