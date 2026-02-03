import "../styles/globals.css";

import NavBar from "@/components/ui/NavBar";
import TopBar from "@/components/ui/TopBar";
import { Toaster } from "react-hot-toast";

import ClientProviders from "./ClientProviders";
import AuthClientProvider from "./AuthClientProvider";

export const metadata = {
  title: "TradeLayer",
  description: "AI Trading Suite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-[var(--bg)] text-[var(--text-dark)] relative">
        <AuthClientProvider>
          <ClientProviders>
            <Toaster position="top-right" />

            {/* 🔥 SINGLE SOURCE OF TRUTH — NavBar regelt desktop + mobile */}
            <NavBar />

            {/* PAGE WRAPPER */}
            <div className="md:pl-64">
              {/* TOPBAR */}
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

              {/* PAGE CONTENT */}
              <main
                className="
                  pt-16
                  px-4 md:px-8
                  pb-14
                  min-h-screen
                "
              >
                {children}
              </main>
            </div>
          </ClientProviders>
        </AuthClientProvider>
      </body>
    </html>
  );
}
