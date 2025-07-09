import '../styles/globals.css';
import NavBar from '@/components/ui/NavBar';
import { Toaster } from 'react-hot-toast'; // ✅ Toast import

export const metadata = {
  title: 'Trading Dashboard',
  description: 'Realtime trading insights en strategieën',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-background text-foreground">
        <Toaster position="top-right" /> {/* ✅ Toast wordt hier getoond */}
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
