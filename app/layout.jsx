import NavBar from "@/components/ui/NavBar";
import TopBar from "@/components/ui/TopBar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-[var(--bg)] text-[var(--text-dark)]">
        <Toaster position="top-right" />

        <NavBar />

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
