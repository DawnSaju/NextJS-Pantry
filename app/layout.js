"use client";

import { Inter } from "next/font/google";
import "./global.css";
import { firebaseConfig } from "../firebase";
import { FirebaseAppProvider } from "reactfire";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <SessionProvider>
        <html lang="en">
          <body className={inter.className} style={{ overflowX: 'hidden' }}>
            {children}
          </body>
        </html>
      </SessionProvider>
    </FirebaseAppProvider>
  );
}
