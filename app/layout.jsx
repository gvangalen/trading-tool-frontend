import "../styles/globals.css";

export const metadata = {
  title: "TradeLayer",
  description: "AI Trading Suite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
