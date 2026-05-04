"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import MagicRings from "@/components/MagicRings";
import { InteractiveGridBox } from "@/components/InteractiveGridBox";
import { motion } from "framer-motion";
import { Sun, Gamepad2, Moon, CalendarDays, UserCircle2, Sparkles, Eye, PenLine, Timer, Map } from "lucide-react";

export default function Home() {
  const [isReturning, setIsReturning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsReturning(!!localStorage.getItem("nunchi_visited"));
  }, []);

  if (!mounted) return null;

  return isReturning ? <ReturningHome /> : <FirstVisitHome />;
}

// ─────────────────────────────────────
// FIRST VISIT
// ─────────────────────────────────────
function FirstVisitHome() {
  const markVisited = () => localStorage.setItem("nunchi_visited", "true");

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6"
      style={{ background: "var(--bg-primary)" }}>
      {/* MagicRings — full screen background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <MagicRings
          color="#70AEFF"
          colorTwo="#075FAB"
          ringCount={5}
          speed={0.8}
          attenuation={25}
          lineThickness={1}
          baseRadius={0.35}
          radiusStep={0.1}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0}
          rotation={0}
          ringGap={1.7}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1.2}
          parallax={0.05}
          clickBurst={false}
        />
      </div>

      {/* Ambient — tidak bergerak, tidak menuntut */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute rounded-full animate-pulse-slow"
          style={{
            width: 600,
            height: 600,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            background:
              "radial-gradient(circle, rgba(90,112,243,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full animate-pulse-slow"
          style={{
            width: 400,
            height: 400,
            bottom: "-5%",
            right: "-5%",
            background:
              "radial-gradient(circle, rgba(255,138,42,0.05) 0%, transparent 70%)",
            animationDelay: "3s",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 p-14 flex flex-col items-center text-center"
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 40,
          background: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.06), inset 0 2px 4px rgba(255, 255, 255, 0.8)"
        }}
      >
        {/* Wordmark */}
        <div className="mb-12">
          <h1
            className="font-bold mb-1"
            style={{
              fontSize: 72,
              lineHeight: 1,
              color: "#5a70f3",
            }}>
            눈치
          </h1>
          <p
            className="text-xs tracking-[0.25em] uppercase font-semibold"
            style={{ color: "var(--text-secondary)" }}>
            nunchi
          </p>
        </div>

        {/* Tagline */}
        <p
          className="text-lg font-medium mb-14 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}>
          Feel what&apos;s not said.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/therapy"
            onClick={markVisited}
            className="w-full py-4 rounded-2xl text-white text-base font-semibold text-center transition-all duration-300 shadow-[0_8px_24px_rgba(90,112,243,0.25)] hover:shadow-[0_16px_32px_rgba(90,112,243,0.4)] hover:-translate-y-1 active:shadow-[0_4px_12px_rgba(90,112,243,0.5)] active:translate-y-[2px] active:scale-[0.98]"
            style={{ backgroundColor: "#5a70f3" }}
          >
            Just feel it
          </Link>
          <Link
            href="/about"
            onClick={markVisited}
            className="w-full py-4 rounded-2xl text-sm font-semibold text-center transition-all duration-300 border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:bg-white active:shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:translate-y-[2px] active:scale-[0.98]"
            style={{ color: "var(--text-secondary)", backgroundColor: "rgba(255, 255, 255, 0.5)" }}
          >
            Show me how it works
          </Link>
        </div>

        <p
          className="mt-8 text-xs font-medium"
          style={{ color: "var(--text-secondary)", opacity: 0.5 }}>
          No account · No sign-up · Stays on your device
        </p>
      </motion.div>
    </main>
  );
}

// ─────────────────────────────────────
// RETURNING USER
// ─────────────────────────────────────

const QUICK_ACTIONS = [
  { href: "/mood", icon: Sun, label: "Check-in", sub: "How are you today?" },
  { href: "/therapy", icon: Gamepad2, label: "Therapy", sub: "Soundscape & game" },
  { href: "/chat", icon: Moon, label: "Nuri", sub: "Talk it out" },
  { href: "/planner", icon: CalendarDays, label: "Planner", sub: "Study with wellness" },
  { href: "/study", icon: Timer, label: "Study", sub: "Pomodoro & focus" },
  { href: "/breaks", icon: Eye, label: "Breaks", sub: "Eyes, stretch, posture" },
  { href: "/vent", icon: PenLine, label: "Vent", sub: "Write it out privately" },
  { href: "/denah", icon: Map, label: "Denah", sub: "School floor plan", teacherOnly: true },
  { href: "/profile", icon: UserCircle2, label: "Profile", sub: "Your nunchi report" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

function ReturningHome() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const [greeting, setGreeting] = useState("Welcome back.");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning.");
    else if (h < 17) setGreeting("Good afternoon.");
    else setGreeting("Good evening.");
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col px-6 pt-20 pb-8 relative overflow-hidden items-center"
      style={{ background: "var(--bg-primary)" }}>

      <div className="relative z-10 max-w-lg w-full">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12"
        >
          <p
            className="text-[40px] leading-tight font-bold tracking-tight text-[#1e293b]">
            {greeting}
          </p>
          <p
            className="text-lg mt-2 font-medium flex items-center gap-2"
            style={{ color: "var(--text-secondary)" }}>
            <Sparkles size={18} className="text-[#5a70f3]" /> Nuri is here.
          </p>
        </motion.div>

        {/* Quick actions Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {/* Primary Action - Check in */}
          <motion.div variants={itemVariants} className="w-full">
            <Link
              href="/mood"
              className="group relative w-full flex items-center justify-between p-6 rounded-[32px] text-white transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              style={{
                backgroundColor: "#5a70f3",
                boxShadow: "0 16px 32px rgba(90,112,243,0.2), inset 0 1px 1px rgba(255,255,255,0.2)",
              }}>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-700 group-hover:scale-150"></div>

              <div className="relative z-10">
                <p className="font-bold text-xl tracking-tight mb-1">Morning check-in</p>
                <p className="text-sm font-medium opacity-80">
                  60 seconds · How are you carrying today?
                </p>
              </div>
              <div className="relative z-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                <Sun size={28} className="text-white" />
              </div>
            </Link>
          </motion.div>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            {QUICK_ACTIONS.slice(1)
              .filter((a) => !(a as any).teacherOnly || role === "TEACHER")
              .map((action) => {
              const Icon = action.icon;
              return (
                <motion.div variants={itemVariants} key={action.href}>
                  <Link
                    href={action.href}
                    className="group relative flex flex-col gap-4 p-5 rounded-[28px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 bg-white/40 backdrop-blur-xl"
                    style={{
                      borderColor: "rgba(255,255,255,0.6)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.04), inset 0 1px 2px rgba(255,255,255,0.8)",
                    }}>
                    <div className="w-12 h-12 rounded-[16px] flex items-center justify-center transition-colors duration-300 group-hover:bg-[#5a70f3] bg-white border border-gray-100 shadow-sm group-hover:border-transparent">
                      <Icon size={24} className="text-[#5a70f3] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <p
                        className="text-base font-bold tracking-tight"
                        style={{ color: "var(--text-primary)" }}>
                        {action.label}
                      </p>
                      <p
                        className="text-xs font-medium mt-1"
                        style={{ color: "var(--text-secondary)", opacity: 0.7 }}>
                        {action.sub}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Reset — tersembunyi, tidak mengganggu */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="w-full flex justify-center mt-12"
        >
          <motion.button
            initial={{ borderWidth: 1 }}
            whileHover={{
              scale: 1.05,
              opacity: 1,
              backgroundColor: "rgba(90, 112, 243, 0.05)",
              borderColor: "#5a70f3",
              color: "#5a70f3",
              borderWidth: 2
            }}
            whileTap={{
              scale: 0.92,
              backgroundColor: "rgba(90, 112, 243, 0.15)",
              color: "#5a70f3",
              borderColor: "#5a70f3",
              borderWidth: 2,
              boxShadow: "0 0 20px rgba(90, 112, 243, 0.4)"
            }}
            onClick={() => {
              localStorage.removeItem("nunchi_visited");
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-full text-xs font-semibold border transition-all duration-300"
            style={{ color: "var(--text-secondary)", opacity: 0.5, borderColor: "var(--border)" }}>
            Reset experience
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
