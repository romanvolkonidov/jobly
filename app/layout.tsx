// app/layout.tsx
// This file provides the layout for the app, including global providers, fonts, and navigation.

'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//import { generateCsrfToken } from "@/src/middleware/csrf";
import Navbar from "@/src/components/common/navbar/index";
import { Providers } from "./providers";
import { Suspense } from "react";

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
 // const csrfToken = generateCsrfToken();

  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="pt-16">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[50vh]">
                  <div className="animate-pulse text-gray-600">Loading...</div>
                </div>
              }
            >
              {children}
            </Suspense>
          </main>
        </Providers>
      </body>
    </html>
  );
}
