import '../styles/globals.css';
import 'rc-slider/assets/index.css';

import NavBar from '@/components/ui/NavBar';
import TopBar from '@/components/ui/TopBar';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-[var(--bg)] text-[var(--text-dark)]">

        <Toaster position="top-right" />

        <NavBar />

        {/* PAGE SHELL */}
        <div className="ml-64"> 
          <TopBar />

          <main className="pt-20 px-6 pb-6">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}
