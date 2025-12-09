import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Skip system routes
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    /\.(png|jpg|jpeg|svg|webp|ico)$/.test(path)
  ) {
    return NextResponse.next();
  }

  // Public (no login needed)
  const publicRoutes = ["/login", "/register"];

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Check cookie
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Fetch onboarding status
  let onboarding;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${apiUrl}/api/onboarding/status`);

    if (!res.ok) return NextResponse.next();

    onboarding = await res.json();
  } catch {
    return NextResponse.next();
  }

  const onboardingComplete =
    onboarding?.has_setup &&
    onboarding?.has_technical &&
    onboarding?.has_macro &&
    onboarding?.has_market &&
    onboarding?.has_strategy;

  // Tijdens onboarding zijn deze routes toegestaan:
  const allowedDuringOnboarding = [
    "/onboarding",
    "/setups",
    "/technical",
    "/macro",
    "/market",
    "/strategies",
  ];

  if (!onboardingComplete) {
    if (allowedDuringOnboarding.some((r) => path.startsWith(r))) {
      return NextResponse.next();
    }

    // Alles anders → terug naar /onboarding
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // Als onboarding klaar is → blokkeer /onboarding
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
