"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { firebaseConfig } from "./firebase";
import { FirebaseAppProvider } from "reactfire";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <SessionProvider>
        <html className="h-screen w-screen bg-gradient-to-b from-green-100 to-green-200" lang="en">
          <Head>
            <title>Pantry App</title>
          </Head>
          <body className={inter.className} style={{ overflowX: 'hidden' }}>
            {children}
            <SpeedInsights />
          </body>
          <GoogleAnalytics gaId="G-ZVHVLJMJWF" />
        </html>
      </SessionProvider>
    </FirebaseAppProvider>
  );
}




