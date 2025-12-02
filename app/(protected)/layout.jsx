"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AILoader from "@/components/ui/AILoader";

export default function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect gebeurt ALLEEN nadat loading klaar is
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Eerst wachten op auth-check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AILoader text="Aan het laden…" />
      </div>
    );
  }

  // Je bent ingelogd -> render dashboard
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Nog niets renderen als redirect bezig is
  return null;
}
