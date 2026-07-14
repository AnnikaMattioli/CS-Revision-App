import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { env, hasSupabaseConfig } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseConfig()) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(
    env.supabaseUrl!,
    env.supabasePublishableKey!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/onboarding");
  const isAuthPage = request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  if (!data?.claims && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (data?.claims && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return response;
}
