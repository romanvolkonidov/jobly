import "./globals.css";
import Navbar from "@/src/components/common/navbar/index";
import { Providers } from "./providers";
import { Suspense } from "react";
import { headers } from 'next/headers';
import { GeistSans, GeistMono } from 'geist/font';
import { Toaster } from 'react-hot-toast'; // Add this import

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
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
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