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

        <Toaster position="top-right" />

        <NavBar />

        <div className="ml-64">

          {/* FIXED TOPBAR - strak tegen sidebar */}
          <div className="fixed top-0 left-64 right-0 z-50 bg-[var(--bg)] border-b border-white/10 h-16 flex items-center">
            <TopBar />
          </div>

          {/* CONTENT */}
          <main className="px-8 pt-[88px] pb-14 min-h-screen">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}
