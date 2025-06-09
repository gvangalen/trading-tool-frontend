// app/layout.jsx
import '../styles/globals.css';
import NavBar from '@/components/ui/NavBar';

export const metadata = {
  title: 'Trading Dashboard',
  description: 'Realtime trading insights en strategieën',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-background text-foreground">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
