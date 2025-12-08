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

  // Publieke routes (geen login nodig)
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

  // 2️⃣ Check JWT cookie (NIET meesturen!)
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Onboarding status ophalen via backend
  //    Browser stuurt cookie automatisch mee door credentials: "include"
  let onboarding;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${apiUrl}/api/onboarding/status`, {
      method: "GET",
      credentials: "include", // cookie forwarding door browser
    });

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

  // 4️⃣ Onboarding incomplete → redirect naar onboarding
  if (!onboardingComplete) {
    if (onboardingRoutes.some((r) => path.startsWith(r))) {
      return NextResponse.next();
    }

    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Onboarding complete → block access to onboarding pages
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
