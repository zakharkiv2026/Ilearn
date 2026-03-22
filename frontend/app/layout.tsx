"use client";

import { Geist } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <GoogleOAuthProvider clientId="38815317747-03jq5rgddlvlad74los5f566j0hg0a8s.apps.googleusercontent.com">
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
