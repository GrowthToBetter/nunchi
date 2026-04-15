import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nunchi (눈치) — Feel What's Not Said",
  description:
    "An AI-powered mental wellness companion bridging Korean and Indonesian cultural intelligence. For the 16th e-ICON World Contest, SDG 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#fafaf8] antialiased">
        {children}
      </body>
    </html>
  );
}
