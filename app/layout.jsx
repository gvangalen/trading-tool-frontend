import 'rc-slider/assets/index.css';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

import NavBar from '@/components/ui/NavBar';     // Sidebar
import TopBar from '@/components/ui/TopBar';     // Topbar

export const metadata = {
  title: 'Trading Dashboard',
  description: 'Realtime trading insights en strategieën',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      
      <body className="bg-[var(--bg)] text-[var(--text-dark)]">
        
        <Toaster position="top-right" />

        <div className="flex">

          {/* SIDEBAR (fixed) */}
          <NavBar />

          {/* PAGE CONTENT */}
          <div className="flex-1 ml-64">

            {/* TOPBAR (fixed) */}
            <TopBar />

            {/* MAIN CONTENT */}
            <main className="px-6 pt-20 pb-6">
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  );
}
