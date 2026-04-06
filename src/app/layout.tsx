import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart College App",
  description:
    "A standalone college platform for live classes, assignments, billing, and role-based access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
