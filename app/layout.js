"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { firebaseConfig } from "../firebase";
import { FirebaseAppProvider } from "reactfire";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <SessionProvider>
        <html lang="en">
          <Head>
            <title>Pantry App</title>
          </Head>
          <body className={inter.className} style={{ overflowX: 'hidden' }}>
            {children}
          </body>
          <GoogleAnalytics gaId="G-XYZ" />
        </html>
      </SessionProvider>
    </FirebaseAppProvider>
  );
}
