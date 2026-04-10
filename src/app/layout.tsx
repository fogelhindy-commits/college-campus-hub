import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DJ Pulse | Weddings, Clubs, Private Events",
  description:
    "A high-energy DJ portfolio and booking website with mixes, services, and contact details.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
