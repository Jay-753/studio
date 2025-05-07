import type { Metadata } from 'next';
import { Geist, Geist_Mono, Audiowide } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-audiowide',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Zoro Assistant - AI Task Automation',
  description: 'AI driven task automation for startups by Zoro Assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${audiowide.variable} antialiased font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
