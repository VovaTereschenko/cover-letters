import { getApplications } from "@/lib/applications";
import { getApplicationCountFromCookies } from "@/lib/cookies";
import { ToastProvider } from "@/contexts/ToastContext";
import { Header } from "@/components/headers/Header/Header";
import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const applications = await getApplications();
  const cookieCount = await getApplicationCountFromCookies();
  const initialCount = cookieCount > 0 ? cookieCount : applications.length;

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <ToastProvider>
          <Header initialApplicationCount={initialCount} />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
