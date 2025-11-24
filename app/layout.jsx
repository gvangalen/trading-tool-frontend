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
        {/* Toasts */}
        <Toaster position="top-right" />

        {/* Sidebar (fixed) */}
        <NavBar />

        {/* Page content (shifted right by sidebar) */}
        <div className="ml-64">
          <TopBar />

          <main className="px-6 pt-20 pb-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
