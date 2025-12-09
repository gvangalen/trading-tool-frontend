import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // 0️⃣ Skip API, static files en images
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    /\.(png|jpg|jpeg|svg|webp|ico)$/.test(path)
  ) {
    return NextResponse.next();
  }

  // Publieke routes
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  // Onboarding routes
  const onboardingRoutes = [
    "/onboarding",
    "/onboarding/setup",
    "/onboarding/technical",
    "/onboarding/macro",
    "/onboarding/market",
    "/onboarding/strategy",
  ];

  // 1️⃣ Public route → doorlaten
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 2️⃣ Check JWT cookie
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Onboarding status ophalen
  let onboarding;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // ❗ Middleware loopt server-side → GEEN credentials: "include"
    const cookie = req.headers.get("cookie") ?? "";

    const res = await fetch(`${apiUrl}/api/onboarding/status`, {
      method: "GET",
      headers: {
        Cookie: cookie, // ⬅️ JUISTE manier om FastAPI JWT cookie aan backend door te geven
      },
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    onboarding = await res.json();
  } catch (err) {
    console.error("❌ Middleware onboarding fetch error:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const {
    has_setup,
    has_technical,
    has_macro,
    has_market,
    has_strategy,
  } = onboarding || {};

  const onboardingComplete =
    !!has_setup &&
    !!has_technical &&
    !!has_macro &&
    !!has_market &&
    !!has_strategy;

  // 4️⃣ Incomplete onboarding → redirect
  if (!onboardingComplete) {
    if (onboardingRoutes.some((r) => path.startsWith(r))) {
      return NextResponse.next();
    }
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Complete onboarding → onboarding routes blokkeren
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
