import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "الصفوه - جملة الجملة",
  description: "موقع البيع بالجملة للأدوات المنزلية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen" style={{ background: "#0a0a0a", color: "#f5f5f5", fontFamily: "'Cairo', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
