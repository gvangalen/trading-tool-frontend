import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // 0️⃣ System routes overslaan
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    /\.(png|jpg|jpeg|svg|webp|ico)$/.test(path)
  ) {
    return NextResponse.next();
  }

  // 1️⃣ Publieke routes
  const publicRoutes = ["/login", "/register"];

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 2️⃣ Check JWT cookie
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Onboarding-status ophalen (MET cookies!)
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieHeader = req.headers.get("cookie") || "";

  let onboarding = null;

  try {
    const res = await fetch(`${apiUrl}/api/onboarding/status`, {
      method: "GET",
      headers: {
        cookie: cookieHeader, // ⚠️ DIT is cruciaal
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (!res.ok) {
      console.error("[middleware] onboarding status error:", res.status);
      return NextResponse.next();
    }

    onboarding = await res.json();
  } catch (err) {
    console.error("[middleware] fetch failed:", err);
    return NextResponse.next();
  }

  const onboardingComplete =
    onboarding?.has_setup &&
    onboarding?.has_technical &&
    onboarding?.has_macro &&
    onboarding?.has_market &&
    onboarding?.has_strategy;

  // 4️⃣ Routes toegestaan TIJDENS onboarding
  const allowedDuringOnboarding = [
    "/onboarding",
    "/setups",
    "/technical",
    "/macro",
    "/market",
    "/strategies",
  ];

  if (!onboardingComplete) {
    if (
      allowedDuringOnboarding.some((route) =>
        path.startsWith(route)
      )
    ) {
      return NextResponse.next();
    }

    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Blokkeer onboarding-pagina’s zodra klaar
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
