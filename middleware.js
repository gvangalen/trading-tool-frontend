import { NextResponse } from "next/server";
import { fetchAuth } from "@/lib/api/auth";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

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

  // 1️⃣ Publieke routes → altijd doorlaten
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 2️⃣ Ophalen van auth-token via cookies
  const token = req.cookies.get("auth_token")?.value;

  // Niet ingelogd → stuur naar login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Haal onboarding-status op via backend
  let onboarding;
  try {
    onboarding = await fetchAuth("/api/onboarding/status", {
      headers: { Cookie: `auth_token=${token}` },
    });
  } catch (err) {
    console.error("Onboarding middleware error:", err);
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

  // 4️⃣ Onboarding nog NIET klaar → force redirect naar /onboarding
  if (!onboardingComplete) {
    // Als gebruiker al op onboarding zit → ok
    if (onboardingRoutes.some((r) => path.startsWith(r))) {
      return NextResponse.next();
    }

    // Elke andere pagina blokkeren
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Onboarding klaar → blokkeer toegang tot onboarding pagina’s
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 6️⃣ Alles OK → doorlaten
  return NextResponse.next();
}

// Middleware configuratie
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
