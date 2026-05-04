"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import Link from "next/link";

// Features that DON'T require login (free tier)
const FREE_ROUTES = ["/", "/about", "/onboarding", "/therapy", "/chat", "/mood", "/login"];

// Features that require login after exploration threshold
const GATED_ROUTES = ["/planner", "/study", "/breaks", "/vent", "/profile", "/dashboard"];

// Teacher-only routes
export const TEACHER_ROUTES = ["/denah", "/teacher"];

const EXPLORATION_THRESHOLD = 3; // show login after visiting 3 gated features

export default function LoginGateModal() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't gate if logged in or still loading
    if (status === "loading" || session || dismissed) return;

    // Track exploration count
    const isGated = GATED_ROUTES.some((r) => pathname.startsWith(r));
    if (!isGated) return;

    const visited = JSON.parse(localStorage.getItem("nunchi_explored") || "[]") as string[];
    const route = pathname.split("/")[1]; // e.g. "planner"

    if (!visited.includes(route)) {
      visited.push(route);
      localStorage.setItem("nunchi_explored", JSON.stringify(visited));
    }

    if (visited.length >= EXPLORATION_THRESHOLD) {
      // Small delay before showing
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathname, session, status, dismissed]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4"
        onClick={() => { setShow(false); setDismissed(true); }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-sm bg-white rounded-3xl p-8 border border-black/5 text-center"
          style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.12)" }}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#5a70f3]/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={24} className="text-[#5a70f3]" />
          </div>

          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            You&apos;re exploring well
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
            Sign in to save your progress, unlock study tools, and let Nuri learn your patterns for better support.
          </p>

          <Link
            href="/login"
            onClick={() => { setShow(false); setDismissed(true); }}
            className="block w-full py-3.5 rounded-2xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#5a70f3", boxShadow: "0 8px 24px rgba(90,112,243,0.25)" }}
          >
            Sign in to continue
          </Link>

          <button
            onClick={() => { setShow(false); setDismissed(true); }}
            className="mt-3 w-full py-2.5 text-sm font-medium transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            Maybe later
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
