"use client";

import { redirect } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import AILoader from "@/components/ui/AILoader";

export default function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Tijdens auth-check → loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AILoader text="Aan het laden…" />
      </div>
    );
  }

  // Niet ingelogd → DIRECT redirect
  if (!isAuthenticated) {
    redirect("/login");
  }

  // Ingelogd → content tonen
  return <>{children}</>;
}
