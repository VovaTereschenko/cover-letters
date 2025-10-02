import { getApplicationCountFromCookies } from "@/lib/cookies";
import { ToastProvider } from "@/contexts/ToastContext";
import { Header } from "@/components/headers/Header/Header";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialApplicationCount = await getApplicationCountFromCookies();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <ToastProvider>
          <Header initialApplicationCount={initialApplicationCount} />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
