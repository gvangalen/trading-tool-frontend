"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AILoader from "@/components/ui/AILoader";

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;

    // ⛔ Alleen redirecten als loading klaar is én geen user
    if (!loading && !isAuthenticated) {
      redirected.current = true;
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  /*
    ✅ BELANGRIJK:
    - Als we AL een user hebben → content direct tonen
    - Alleen loader tonen als we nog GEEN user hebben
  */
  if (!user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AILoader text="Aan het laden…" />
      </div>
    );
  }

  if (!isAuthenticated && !redirected.current) {
    return null;
  }

  return <>{children}</>;
}
