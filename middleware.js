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

  // 1️⃣ Publieke routes (geen login nodig)
  const publicRoutes = ["/login", "/register"];

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 2️⃣ Check of er een access_token cookie is
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    // Geen cookie → naar login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Onboarding-status ophalen bij backend
  //    BELANGRIJK: zet de cookies van deze request door!
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const cookieHeader = req.headers.get("cookie") || "";

  let onboarding: any = null;

  try {
    const res = await fetch(`${apiUrl}/api/onboarding/status`, {
      method: "GET",
      headers: {
        // ⬅️ DIT ontbrak: backend krijgt nu dezelfde cookies als /auth/me
        cookie: cookieHeader,
        "Content-Type": "application/json",
      },
    });

    if (res.status === 401) {
      // Token ongeldig/expired aan backend-kant → terug naar login
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    if (!res.ok) {
      console.error(
        "[middleware] /api/onboarding/status error:",
        res.status,
        await res.text().catch(() => "")
      );
      // In geval van andere fout: laat request doorgaan i.p.v. infinite redirect
      return NextResponse.next();
    }

    onboarding = await res.json();
  } catch (err) {
    console.error("[middleware] Failed to fetch onboarding status:", err);
    // Veilig fallback: niets forceren, gewoon doorlaten
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

  // 4️⃣ Routes die TIJDENS onboarding zijn toegestaan
  const allowedDuringOnboarding = [
    "/onboarding",
    "/setups",
    "/technical",
    "/macro",
    "/market",
    "/strategies",
  ];

  // Onboarding nog NIET klaar
  if (!onboardingComplete) {
    // Als je op onboarding of 1 van de feature-pagina’s klikt → gewoon doorlaten
    if (
      allowedDuringOnboarding.some((route) =>
        path.startsWith(route)
      )
    ) {
      return NextResponse.next();
    }

    // Alles anders (bijv. /dashboard) → terug naar onboarding
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 5️⃣ Onboarding IS klaar → /onboarding blokkeren
  if (onboardingComplete && path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // 6️⃣ Normale doorgang
  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
