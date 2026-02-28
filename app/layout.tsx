import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_component/navbar/Navbar";
import { Toaster } from "sonner";
import MySessionProviders from "./providers/MySessionProviders";
import Footer from "./_component/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshCart | Your Premium Shopping Destination",
  description: "Explore high-quality products ranging from electronics to fashion with fast delivery and secure payments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background text-foreground transition-colors duration-500`}
      >
        <MySessionProviders >
          <Toaster position="top-center" richColors />
          <Navbar />
          <main className="pt-24 md:pt-28">
            {children}
          </main>
          <Footer />
        </MySessionProviders>
      </body>
    </html>
  );
}
