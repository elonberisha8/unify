import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Baloo_2, Manrope } from "next/font/google";

const display = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Unify",
  description: "Crowdfunding platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${body.className} bg-[#fbf8f2] text-[#3f210d] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
