import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // 0️⃣ Skip API, static files, favicon, images
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    /\.(png|jpg|jpeg|svg|webp|ico)$/.test(path)
  ) {
    return NextResponse.next();
  }

  // Public routes (geen login nodig)
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const onboardingRoutes = [
    "/onboarding",
    "/onboarding/setup",
    "/onboarding/technical",
    "/onboarding/macro",
    "/onboarding/market",
    "/onboarding/strategy",
  ];

  // 1️⃣ Public routes → doorgaan
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 2️⃣ Lees access_token cookie (COOKIE-AUTH!)
  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Onboarding status ophalen met COOKIE-forwarding automatisch
  let onboarding;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${apiUrl}/api/onboarding/status`, {
      credentials: "include", // ⬅️ BELANGRIJK!
      headers: {
        Cookie: `access_token=${token}`,
      },
    });

    onboarding = await res.json();
  } catch (err) {
    console.error("❌ Onboarding middleware error", err);
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

  // 4️⃣ Onboarding incomplete → redirect
  if (!onboardingComplete) {
    if (onboardingRoutes.some((r) => path.startsWith(r))) {
      return NextResponse.next();
    }

    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Onboarding complete → /onboarding blokkeren
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
