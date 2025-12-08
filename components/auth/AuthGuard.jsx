"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AILoader from "@/components/ui/AILoader";

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // voorkomt dubbele redirects
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;

    // ⛔ niet ingelogd nadat loading klaar is
    if (!loading && !isAuthenticated) {
      redirected.current = true;
      router.replace("/login"); // replace = betere UX
    }
  }, [loading, isAuthenticated, router]);

  // nog aan het laden of redirect voorbereiden
  if (loading || (!isAuthenticated && !redirected.current)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AILoader text="Aan het laden…" />
      </div>
    );
  }

  // gebruiker is ingelogd → content tonen
  return <>{children}</>;
}
