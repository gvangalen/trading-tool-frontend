// app/layout.jsx
import '../styles/globals.css';// ✅ Vanuit /styles/globals.css (verwijzing klopt)

export const metadata = {
  title: 'Trading Dashboard',
  description: 'Realtime trading insights en strategieën',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
