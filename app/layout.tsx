import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import AuthProvider from "./components/AuthProvider";
import LoginGateModal from "./components/LoginGateModal";
import NuriToast from "./components/NuriToast";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Nunchi (눈치) — Feel What's Not Said",
  description:
    "An AI-powered mental wellness companion bridging Korean and Indonesian cultural intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", inter.variable)}>
      <body className="min-h-screen bg-[#fafaf8] antialiased">
        <AuthProvider>
          <div className="pb-20">
            {children}
          </div>
          <BottomNav />
          <LoginGateModal />
          <NuriToast />
        </AuthProvider>
      </body>
    </html>
  );
}
