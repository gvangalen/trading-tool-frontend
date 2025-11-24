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

        {/* SIDEBAR (fixed) */}
        <NavBar />

        {/* CONTENT (sidebar pushes content 16rem naar rechts) */}
        <div className="ml-64">

          {/* TOPBAR (fixed bovenaan) */}
          <TopBar />

          {/* PAGE CONTENT → scrollt beneden topbar */}
          <main
            className="
              px-8
              pt-[88px]    /* ruimte voor topbar (64px height + 24px extra) */
              pb-14
              min-h-screen
            "
          >
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}
