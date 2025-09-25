import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/Header/Header";

export const metadata: Metadata = {
  title: "Alt+Shift - Application Generator",
  description: "Generate professional applications",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
