import 'rc-slider/assets/index.css';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

import NavBar from '@/components/ui/NavBar';
import TopBar from '@/components/ui/TopBar';

export const metadata = {
  title: 'Trading Dashboard',
  description: 'Realtime trading insights en strategieën',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-[var(--bg)] text-[var(--text-dark)]">

        <Toaster position="top-right" />

        {/* FIXED SIDEBAR */}
        <NavBar />

        {/* MAIN CONTENT AREA */}
        <div className="ml-64">

          {/* FIXED TOPBAR */}
          <TopBar />

          {/* PAGE CONTENT (onder de topbar) */}
          <main className="pt-20 px-8 pb-10">
            {children}
          </main>

        </div>

      </body>
    </html>
  );
}
