import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarVoy - Laytime Calculator",
  description: "Modern maritime laytime, demurrage, and despatch calculation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
