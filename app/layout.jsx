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
      <body className="bg-[var(--bg)] text-[var(--text-dark)] relative">

        {/* Notifications */}
        <Toaster position="top-right" />

        {/* ====================================== */}
        {/* 🧭 DESKTOP SIDEBAR (met afgeronde rechterkant) */}
        {/* ====================================== */}
        <div className="hidden md:block">
          <div
            className="
              fixed top-0 left-0 h-screen w-64 
              sidebar-surface 
              rounded-r-3xl shadow-xl
              overflow-hidden
            "
          >
            <NavBar />
          </div>
        </div>

        {/* ====================================== */}
        {/* 📱 MOBILE SIDEBAR (slide-in + afgeronde hoeken) */}
        {/* ====================================== */}
        <div
          id="mobileSidebar"
          className="
            fixed top-0 left-0 z-50
            h-full w-64
            sidebar-surface 
            rounded-r-3xl 
            transform -translate-x-full
            transition-transform duration-300
            md:hidden shadow-2xl
          "
        >
          <NavBar />
        </div>

        {/* ====================================== */}
        {/* PAGE WRAPPER (Shifted on desktop) */}
        {/* ====================================== */}
        <div className="md:ml-64">

          {/* ====================================== */}
          {/* 🎛 FIXED TOPBAR (met afgeronde hoek links-onder) */}
          {/* ====================================== */}
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

          {/* ====================================== */}
          {/* 📄 PAGE CONTENT */}
          {/* ====================================== */}
          <main
            className="
              pt-16   /* Ruimte onder topbar */
              px-4 md:px-8
              pb-14
              min-h-screen
            "
          >
            {children}
          </main>

        </div>

        {/* ====================================== */}
        {/* 📱 MOBILE SIDEBAR LOGIC */}
        {/* ====================================== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener("click", (e) => {
                const toggle = e.target.closest("[data-mobile-menu]");
                const panel = document.getElementById("mobileSidebar");

                if (toggle) {
                  panel.classList.toggle("-translate-x-full");
                  return;
                }

                if (!panel.contains(e.target) && !toggle) {
                  panel.classList.add("-translate-x-full");
                }
              });
            `,
          }}
        />

      </body>
    </html>
  );
}
