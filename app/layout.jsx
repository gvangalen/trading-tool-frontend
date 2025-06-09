// app/layout.jsx
import '../styles/globals.css';
import NavBar from '@/ui/NavBar'; // ✅ Voeg deze import toe

export const metadata = {
  title: 'Trading Dashboard',
  description: 'Realtime trading insights en strategieën',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <NavBar /> {/* ✅ Voeg navigatie toe */}
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
