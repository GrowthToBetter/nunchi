"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import Link from "next/link";

const NURI_MESSAGES = [
  "Hey, Nuri noticed you might be carrying something heavy today. Want to talk?",
  "It's okay to not be okay. Nuri is here if you need a safe space to breathe.",
  "You've been pushing hard. Nuri wants to check in — no pressure, just warmth.",
  "Sometimes the bravest thing is admitting you're tired. Nuri is listening.",
  "Nuri sensed something earlier. Even a short chat can help lighten things.",
];

export default function NuriToast() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if mood signal was stored (set by /mood page when result is negative)
    const signal = localStorage.getItem("nunchi_mood_signal");
    if (!signal) return;

    const parsed = JSON.parse(signal);
    const now = Date.now();

    // Only show if signal is from the last 2 hours and hasn't been dismissed
    if (now - parsed.timestamp > 2 * 60 * 60 * 1000) {
      localStorage.removeItem("nunchi_mood_signal");
      return;
    }

    if (parsed.dismissed) return;

    // Delay before showing — feel natural, not instant
    const timer = setTimeout(() => {
      setMessage(NURI_MESSAGES[Math.floor(Math.random() * NURI_MESSAGES.length)]);
      setShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShow(false);
    const signal = JSON.parse(localStorage.getItem("nunchi_mood_signal") || "{}");
    signal.dismissed = true;
    localStorage.setItem("nunchi_mood_signal", JSON.stringify(signal));
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[55]"
        >
          <div
            className="bg-white rounded-2xl p-4 border border-black/5 flex gap-3"
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04)" }}
          >
            {/* Nuri avatar */}
            <div className="w-10 h-10 rounded-xl bg-[#5a70f3]/10 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-[#5a70f3]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: "#5a70f3" }}>
                Nuri
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {message}
              </p>
              <Link
                href="/chat"
                onClick={dismiss}
                className="inline-block mt-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: "#5a70f3", color: "white" }}
              >
                Talk to Nuri
              </Link>
            </div>

            <button
              onClick={dismiss}
              className="self-start w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5 shrink-0"
              style={{ color: "var(--text-secondary)" }}
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
