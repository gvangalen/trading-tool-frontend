import "../print.css";

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body className="print-body">
        {children}
      </body>
    </html>
  );
}
