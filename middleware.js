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

  // 1️⃣ public routes → doorlaten
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 2️⃣ check auth cookie
  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ onboarding-status ophalen
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

  // 4️⃣ onboarding NIET klaar → redirect naar onboarding flow
  if (!onboardingComplete) {
    // Als user al in onboarding zit → doorlaten
    if (onboardingRoutes.some((r) => path.startsWith(r))) {
      return NextResponse.next();
    }

    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Onboarding WEL klaar → block onboarding pages
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 6️⃣ Auth OK en onboarding klaar → route doorlaten
  return NextResponse.next();
}

//
// ❗❗ De matcher hieronder is de fix waardoor je logo en images weer werken!
//
export const config = {
  matcher: [
    // Middleware moet NIET draaien op images, static content, API routes, favicon
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(png|jpg|jpeg|svg|webp|ico)).*)",
  ],
};
