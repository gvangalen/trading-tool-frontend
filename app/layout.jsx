import "./globals.css";
import AppProviders from "@/app/providers/AppProviders";

export const metadata = {
  title: "Trading Tool",
  description: "AI Trading Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
