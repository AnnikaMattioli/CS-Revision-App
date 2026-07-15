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
  const pathname = request.nextUrl.pathname;
  const studentOnly = ["/dashboard", "/learn", "/practise", "/flashcards", "/worked-solutions", "/exam-practice", "/progress", "/achievements"];
  const platform = [...studentOnly, "/teacher", "/classes", "/settings", "/onboarding", "/admin"];
  const isProtected = platform.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isAuthPage = request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  if (!data?.claims && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  if (data?.claims) {
    const userId = String(data.claims.sub);
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("onboarding_completed,onboarding_version").eq("id", userId).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    const roleValues = new Set((roles ?? []).map((item) => item.role));
    const role = roleValues.has("admin") ? "admin" : roleValues.has("teacher") ? "teacher" : "student";
    const onboardingComplete = Boolean(profile?.onboarding_completed && (profile?.onboarding_version ?? 1) >= 2);
    const home = role === "student" ? "/dashboard" : "/teacher";

    if (!onboardingComplete && pathname !== "/onboarding" && (isProtected || isAuthPage)) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if (onboardingComplete && (isAuthPage || pathname === "/onboarding")) {
      const url = request.nextUrl.clone();
      url.pathname = home;
      url.search = "";
      return NextResponse.redirect(url);
    }
    if (onboardingComplete && role !== "student" && studentOnly.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
      const url = request.nextUrl.clone();
      url.pathname = "/teacher";
      url.search = "";
      return NextResponse.redirect(url);
    }
    if (onboardingComplete && role === "student" && (pathname === "/teacher" || pathname.startsWith("/teacher/") || pathname === "/admin" || pathname.startsWith("/admin/"))) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }
  if (data?.claims && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return response;
}
