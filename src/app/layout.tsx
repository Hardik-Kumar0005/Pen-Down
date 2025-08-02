import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";

import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pen Down",
  description: "Note down and get it done with Pen Down!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        >
        {children}
        <div className="absolute top-5 left-5 text-amber-400">
          <Link href="/">
            <Image 
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            />
          </Link>
        </div>
        <div className="absolute top-5 right-5 text-black">
          
        </div>
      </body>
    </html>
          
  );
}
