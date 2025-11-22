import 'rc-slider/assets/index.css';
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';

import NavBar from '@/components/ui/NavBar';     // ← DIT WORDT DE NIEUWE SIDEBAR
import TopBar from '@/components/ui/TopBar';     // ← NIEUWE TOPBAR

export const metadata = {
  title: 'Trading Dashboard',
  description: 'Realtime trading insights en strategieën',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-background text-foreground">

        <Toaster position="top-right" />

        <div className="flex">

          {/* SIDEBAR */}
          <NavBar />

          {/* PAGE CONTENT */}
          <div className="flex-1 ml-64">  
            {/* TOPBAR */}
            <TopBar />

            {/* MAIN */}
            <main className="px-6 py-6">
              {children}
            </main>
          </div>

        </div>

      </body>
    </html>
  );
}
