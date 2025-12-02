"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AILoader from "@/components/ui/AILoader";

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // ⏳ Wacht op auth check
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, loading, router]);

  // Laat loading state zien
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AILoader text="Aan het laden…" />
      </div>
    );
  }

  // Niet ingelogd? Dan staat useEffect klaar om redirect te doen.
  if (!isAuthenticated) return null;

  // Ingelogd → normale pagina tonen
  return <>{children}</>;
}
