import "rc-slider/assets/index.css";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

import NavBar from "@/components/ui/NavBar";   // Sidebar
import TopBar from "@/components/ui/TopBar";   // Topbar

export const metadata = {
  title: "Trading Dashboard",
  description: "Realtime trading insights en strategieën",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-[var(--bg)] text-[var(--text-dark)]">

        <Toaster position="top-right" />

        {/* FIXED SIDEBAR */}
        <NavBar />

        {/* FIXED TOPBAR */}
        <TopBar />

        {/* MAIN CONTENT WRAPPER */}
        <main
          className="
            pl-64       /* ruimte voor sidebar */
            pt-16       /* ruimte topbar */
            px-6 pb-6
          "
        >
          {children}
        </main>

      </body>
    </html>
  );
}
