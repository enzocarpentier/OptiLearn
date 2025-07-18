import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import Header from "@/components/Header";
import { Suspense } from "react";
import AuthModal from '@/components/AuthModal';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OptiLearn - Hub étudiant intelligent",
  description: "Uploadez vos PDFs, générez des questions avec l'IA et révisez efficacement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900`}
      >
        <AuthProvider>
          <AuthModalProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <AuthModal />
            </ThemeProvider>
            <Toaster richColors position="bottom-right" />
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
