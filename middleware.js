// middleware.js
import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

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

  // 1️⃣ Publieke route → doorlaten
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 2️⃣ Token ophalen uit cookie
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Onboarding-status ophalen
  let onboarding;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/onboarding/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    onboarding = await res.json();
  } catch (err) {
    console.error("❌ Onboarding middleware fetch error:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const {
    has_setup,
    has_technical,
    has_macro,
    has_market,
    has_strategy,
  } = onboarding;

  const onboardingComplete =
    has_setup &&
    has_technical &&
    has_macro &&
    has_market &&
    has_strategy;

  // 4️⃣ Onboarding NIET klaar → stuur user naar onboarding
  if (!onboardingComplete) {
    if (onboardingRoutes.some((r) => path.startsWith(r))) {
      return NextResponse.next();
    }
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Onboarding WEL klaar → block toegang tot onboarding pages
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 6️⃣ Alles ok → Protected route doorlaten
  return NextResponse.next();
}

//
// 🚀 *** DEZE MATCHER IS 100% NEXT.JS-COMPATIBLE ***
// Geen regex, geen capturing groups, geen parser errors
//
export const config = {
  matcher: [
    /*
      Pas toe op ALLE routes behalve:
      - /api/*
      - /_next/*
      - /favicon.ico
      - alle images in /public (png/jpg/svg/etc)
    */
    "/((?!api/|_next/|favicon.ico|.*\\.(png|jpg|jpeg|svg|webp|ico)).*)",
  ],
};
