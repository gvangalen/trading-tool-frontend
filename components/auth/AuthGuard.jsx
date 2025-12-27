"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AILoader from "@/components/ui/AILoader";

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    // ⛔ Alleen redirecten als loading klaar is én geen user
    if (!loading && !user && !redirected.current) {
      redirected.current = true;
      router.replace("/login");
    }
  }, [loading, user, router]);

  // 1️⃣ Nog bezig met auth check en geen user → loader
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AILoader text="Aan het laden…" />
      </div>
    );
  }

  // 2️⃣ Geen user (redirect loopt of komt)
  if (!user) {
    return null;
  }

  // 3️⃣ User aanwezig → altijd content renderen
  return <>{children}</>;
}
