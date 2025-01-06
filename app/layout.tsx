import "./globals.css";
import Navbar from "@/src/components/common/navbar/index";
import { Providers } from "./providers";
import { Suspense } from "react";
import { headers } from 'next/headers';
import { GeistSans, GeistMono } from 'geist/font';

// The fonts are already configured, we don't need to call them again
const geistSans = GeistSans;
const geistMono = GeistMono;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const csrfToken = headersList.get('X-CSRF-Token') || '';

  return (
    <html lang="en">
      <head>
        <meta name="csrf-token" content={csrfToken} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Navbar />
          <main className="pt-16">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-pulse text-gray-600">Loading...</div>
              </div>
            }>
              {children}
            </Suspense>
          </main>
        </Providers>
      </body>
    </html>
  );
}