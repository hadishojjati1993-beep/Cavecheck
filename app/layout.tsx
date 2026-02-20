import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "CaveCheck",
  description: "Measure your foot size and shop the perfect fit.",
  themeColor: "#0A0A0C",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <Script
          src="https://docs.opencv.org/4.x/opencv.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="app-bg min-h-dvh font-sans">
        <div className="min-h-dvh safe-top safe-bottom">{children}</div>
      </body>
    </html>
  );
}
