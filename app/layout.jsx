import "../styles/globals.css";
import NavBar from "@/components/ui/NavBar";
import TopBar from "@/components/ui/TopBar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "TradeLayer",
  description: "AI Trading Suite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-[var(--bg)] text-[var(--text-dark)]">

        {/* Notifications */}
        <Toaster position="top-right" />

        {/* SIDEBAR – fixed */}
        <NavBar />

        {/* MAIN WRAPPER (naast sidebar) */}
        <div className="ml-64">

          {/* TOPBAR – volledig via .topbar-surface gestyled */}
          <div className="fixed top-0 left-64 right-0 z-50 h-16 topbar-surface">
            <TopBar />
          </div>

          {/* PAGE CONTENT – begint direct onder topbar */}
          <main className="px-8 pt-16 pb-14 min-h-screen">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}
