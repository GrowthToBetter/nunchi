"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            top: "40%", left: "50%",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(90,112,243,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Back */}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium mb-12"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-3xl font-bold tracking-tight mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome to Nunchi
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Sign in to save your progress, access personalized insights, and unlock all features.
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-medium border transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
          style={{
            background: "white",
            borderColor: "rgba(0,0,0,0.08)",
            color: "var(--text-primary)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        </div>

        {/* Continue without login */}
        <Link
          href="/"
          className="w-full flex items-center justify-center py-3.5 rounded-2xl text-sm font-medium transition-all hover:bg-black/[0.02]"
          style={{ color: "var(--text-secondary)" }}
        >
          Continue without signing in
        </Link>

        <p className="text-center text-[10px] mt-8 leading-relaxed" style={{ color: "var(--text-secondary)", opacity: 0.6 }}>
          Your data stays private. We only use your email to save your progress.
          <br />No spam. No third-party sharing. Ever.
        </p>
      </motion.div>
    </main>
  );
}
