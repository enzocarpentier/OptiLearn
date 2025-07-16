import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import Header from "@/components/Header";
import { Suspense } from "react";
import AuthModal from '@/components/AuthModal';

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
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <AuthProvider>
          <AuthModalProvider>
            <Suspense fallback={<div className="h-16 bg-gray-900 shadow-md"></div>}>
              <Header />
            </Suspense>
            <main className="flex-grow pt-20">
              {children}
            </main>
            <AuthModal />
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
