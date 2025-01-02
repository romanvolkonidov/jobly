// app/layout.tsx
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/src/components/common/navbar/index";
import { Providers } from "./providers";
import { Suspense } from "react";

// Move CSRF generation to a server action or API route
import { getCsrfToken } from "@/app/csrf";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

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