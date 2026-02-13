"use client";

import NavBar from "@/components/ui/NavBar";
import TopBar from "@/components/ui/TopBar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard>
      {/* Sidebar */}
      <NavBar />

      {/* Content wrapper */}
      <div className="md:pl-64">
        {/* TopBar */}
        <div
          className="
            fixed top-0
            left-0 md:left-64 right-0
            h-16
            topbar-surface
            z-40
            rounded-bl-3xl
            shadow-lg
          "
        >
          <TopBar />
        </div>

        {/* Page */}
        <main className="pt-16 px-4 md:px-8 pb-14 min-h-screen">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
