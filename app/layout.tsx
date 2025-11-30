import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SWRProvider } from "@/components/providers/swr-provider";
import { MainNav } from "@/components/layout/main-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceX Dashboard",
  description: "Comprehensive dashboard for SpaceX launches, rockets, and mission data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-black">
            <MainNav />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </SWRProvider>
      </body>
    </html>
  );
}
