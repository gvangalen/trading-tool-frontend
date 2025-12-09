import { NextResponse } from "next/server";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // Skip system/asset routes
  if (
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico" ||
    /\.(png|jpg|jpeg|svg|webp|ico)$/.test(path)
  ) {
    return NextResponse.next();
  }

  // Public routes (geen login vereist)
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 🔐 Cookie check
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 📝 Onboarding-status ophalen
  let onboarding;
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const res = await fetch(`${apiUrl}/api/onboarding/status`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      // Als backend niet werkt → laat user niet crashen, gewoon naar login
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    onboarding = await res.json();
  } catch (err) {
    console.error("❌ Middleware: onboarding fetch error", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 👉 Backend stuurt: onboarding.onboarding_complete
  const onboardingComplete = onboarding?.onboarding_complete === true;

  // 🚦 Routes die tijdens onboarding gebruikt mogen worden
  const allowedDuringOnboarding = [
    "/onboarding",
    "/setups",
    "/technical",
    "/macro",
    "/market",
    "/strategies",
  ];

  // 🟥 Onboarding NIET voltooid → redirect
  if (!onboardingComplete) {
    // onboarding pagina's + featurepagina's wel toestaan
    if (allowedDuringOnboarding.some((r) => path.startsWith(r))) {
      return NextResponse.next();
    }

    // Alles anders → terugleiden naar onboarding
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  // 🟩 Onboarding WÉL voltooid → blokkeer onboarding routes
  if (path.startsWith("/onboarding")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
