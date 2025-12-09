import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  console.log("⛔ MIDDLEWARE HIT:", path);

  // System files skippen
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    /\.(png|jpg|jpeg|svg|webp|ico)$/.test(path)
  ) {
    return NextResponse.next();
  }

  // Public pages
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(path)) {
    console.log("➡️ Public route toegestaan:", path);
    return NextResponse.next();
  }

  // Token check
  const token = req.cookies.get("access_token")?.value;
  console.log("🍪 Token aanwezig?", token ? "JA" : "NEE");

  if (!token) {
    console.log("❌ GEEN token → redirect naar login");
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Onboarding check met cookie doorsturen
  let onboarding = null;
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    console.log("🔍 Fetch onboarding status…");

    const res = await fetch(`${apiUrl}/api/onboarding/status`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
    });

    console.log("📡 Backend response:", res.status);

    if (res.status === 401) {
      console.log("❌ Backend zegt 401 → redirect login");
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    onboarding = await res.json();
    console.log("📦 Onboarding JSON:", onboarding);

  } catch (err) {
    console.log("💥 FOUT tijdens onboarding fetch:", err);
    return NextResponse.next();
  }

  const onboardingComplete =
    onboarding?.has_setup &&
    onboarding?.has_technical &&
    onboarding?.has_macro &&
    onboarding?.has_market &&
    onboarding?.has_strategy;

  console.log("🎯 Onboarding compleet?", onboardingComplete);

  const allowedDuringOnboarding = [
    "/onboarding",
    "/setups",
    "/technical",
    "/macro",
    "/market",
    "/strategies",
  ];

  if (!onboardingComplete) {
    if (allowedDuringOnboarding.some((route) => path.startsWith(route))) {
      console.log("🟢 Toegestane onboarding route:", path);
      return NextResponse.next();
    }

    console.log("🔴 Onboarding NIET klaar → redirect naar /onboarding");
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // Block onboarding routes if already completed
  if (onboardingComplete && path.startsWith("/onboarding")) {
    console.log("🚫 Onboarding al klaar → redirect /dashboard");
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  console.log("🟢 Normaal doorgelaten:", path);
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
