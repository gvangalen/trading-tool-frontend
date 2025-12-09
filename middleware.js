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

  // Onboarding gerelateerde routes
  const onboardingRoutes = [
    "/onboarding",
    "/onboarding/setup",
    "/onboarding/technical",
    "/onboarding/macro",
    "/onboarding/market",
    "/onboarding/strategy",
  ];

  // ✅ Routes die TIJDENS onboarding óók zijn toegestaan
  const onboardingFeatureRoutes = [
    "/setups",
    "/technical",
    "/macro",
    "/market",
    "/strategies",
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
  let onboarding;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${apiUrl}/api/onboarding/status`, {
      method: "GET",
      // Let op: dit is server-side middleware; cookies van de browser
      // worden hier niet automatisch meegestuurd.
      // Maar jouw backend checkt ook op IP / sessie, en je haalt
      // onboarding-status óók client-side op, dus dit is alleen
      // een extra check. Fouten hier → user alsnog doorlaten.
    });

    if (!res.ok) {
      // Als de backend hier 401/500 geeft, niet keihard blokkeren
      return NextResponse.next();
    }

    onboarding = await res.json();
  } catch (err) {
    console.error("❌ Middleware onboarding fetch error:", err);
    // Bij fout: liever user doorlaten dan vastzetten
    return NextResponse.next();
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

  const isOnboardingRoute = onboardingRoutes.some((r) =>
    path.startsWith(r)
  );

  const isOnboardingFeatureRoute = onboardingFeatureRoutes.some((r) =>
    path.startsWith(r)
  );

  // 4️⃣ Onboarding NIET compleet:
  //    → gebruiker mag alleen naar onboarding + feature routes
  if (!onboardingComplete) {
    if (isOnboardingRoute || isOnboardingFeatureRoute) {
      // Toegestane routes tijdens onboarding
      return NextResponse.next();
    }

    // Alles anders → naar onboarding
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Onboarding WEL compleet → blokkeer /onboarding zelf
  if (onboardingComplete && isOnboardingRoute) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
