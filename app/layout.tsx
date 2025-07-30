import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MillerBit - A Showcase of Innovation",
  description: "Explore the projects and talents of the MillerBit team.",
  keywords: "MillerBit, projects, portfolio, innovation, technology, software development, web development, mobile development, AI, machine learning, cybersecurity, cloud computing, data science, UI/UX design, digital solutions",
  authors: [{ name: "MillerBit Team" }],
  openGraph: {
    title: "MillerBit - A Showcase of Innovation",
    description: "Explore the projects and talents of the MillerBit team.",
    url: "https://www.millerbit.com",
    siteName: "MillerBit",
    images: [
      {
        url: "https://www.millerbit.com/millerbitLogo.jpg",
        width: 800,
        height: 600,
        alt: "MillerBit Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
