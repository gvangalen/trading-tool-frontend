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

        {/* MAIN WRAPPER */}
        <div className="ml-64">

          {/* FIXED TOPBAR */}
          <div className="fixed top-0 left-64 right-0 h-16 topbar-surface z-40">
            <TopBar />
          </div>

          {/* PAGE CONTENT – begint exact onder topbar */}
          <main className="pt-16 px-8 pb-14 min-h-screen">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
