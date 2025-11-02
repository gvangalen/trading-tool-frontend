import 'rc-slider/assets/index.css';        // ✅ rc-slider CSS importeren
import '../styles/globals.css';             // ✅ Tailwind CSS
import NavBar from '@/components/ui/NavBar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Trading Dashboard',
  description: 'Realtime trading insights en strategieën',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-background text-foreground">
        <Toaster position="top-right" />
        <NavBar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
