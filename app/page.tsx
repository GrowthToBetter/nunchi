"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MagicRings from "@/components/MagicRings";
import { InteractiveGridBox } from "@/components/InteractiveGridBox";

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
          blur={8}
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

      <InteractiveGridBox
        className="relative z-10 nuri-message p-14"
        style={{ 
          width: "100%",
          maxWidth: 520,
          borderRadius: 40,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.1) 100%)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8), inset 1px 0 1px rgba(255, 255, 255, 0.4)"
        }}
        gridSize={30}
      >
        {/* Wordmark */}
        <div className="mb-12">
          <h1
            className="font-bold mb-1"
            style={{
              fontSize: 72,
              lineHeight: 1,
              color: "var(--accent-blue)",
            }}>
            눈치
          </h1>
          <p
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: "var(--text-secondary)" }}>
            nunchi
          </p>
        </div>

        {/* Tagline — singkat */}
        <p
          className="text-lg font-light mb-14 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}>
          Feel what&apos;s not said.
        </p>

        {/* Dua pilihan — tidak ada penjelasan panjang */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/therapy"
            onClick={markVisited}
            className="w-full py-4 rounded-2xl text-white text-base font-semibold text-center transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #5a70f3, #7c96f8)",
              boxShadow: "0 8px 24px rgba(90,112,243,0.2)",
            }}>
            Just feel it
          </Link>
          <Link
            href="/about"
            onClick={markVisited}
            className="w-full py-4 rounded-2xl text-sm font-medium text-center transition-all hover:opacity-90 active:scale-[0.98] border"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
              background: "white",
            }}>
            Show me how it works
          </Link>
        </div>

        <p
          className="mt-8 text-xs"
          style={{ color: "var(--text-secondary)", opacity: 0.4 }}>
          No account · No sign-up · Stays on your device
        </p>
      </InteractiveGridBox>
    </main>
  );
}

// ─────────────────────────────────────
// RETURNING USER
// ─────────────────────────────────────

const QUICK_ACTIONS = [
  { href: "/mood", emoji: "🌅", label: "Check-in", sub: "How are you today?" },
  { href: "/therapy", emoji: "🎮", label: "Therapy", sub: "Soundscape & game" },
  { href: "/chat", emoji: "🌙", label: "Nuri", sub: "Talk it out" },
  {
    href: "/planner",
    emoji: "📅",
    label: "Planner",
    sub: "Study with wellness",
  },
  { href: "/profile", emoji: "◉", label: "Profile", sub: "Your nunchi report" },
];

function ReturningHome() {
  const [greeting, setGreeting] = useState("Welcome back.");

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting("Good morning.");
    else if (h < 17) setGreeting("Good afternoon.");
    else setGreeting("Good evening.");
  }, []);

  return (
    <main
      className="min-h-screen flex flex-col px-5 pt-16 pb-8 relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}>
      {/* Ambient bg */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 20%, rgba(90,112,243,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-sm mx-auto w-full">
        {/* Greeting */}
        <div className="mb-10">
          <p
            className="text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}>
            {greeting}
          </p>
          <p
            className="text-sm mt-1.5"
            style={{ color: "var(--text-secondary)" }}>
            Nuri is here.
          </p>
        </div>

        {/* Quick actions — grid bebas, bukan linear flow */}
        <div className="flex flex-col gap-3">
          {/* Check-in — primary */}
          <Link
            href="/mood"
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-white transition-all hover:opacity-95 active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, #5a70f3, #7c96f8)",
              boxShadow: "0 6px 20px rgba(90,112,243,0.18)",
            }}>
            <div>
              <p className="font-semibold text-base">Morning check-in</p>
              <p className="text-xs mt-0.5 opacity-75">
                60 seconds · How are you carrying today?
              </p>
            </div>
            <span className="text-2xl">🌅</span>
          </Link>

          {/* Secondary actions — 2 kolom, bebas dipilih */}
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.slice(1).map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col gap-1 px-4 py-4 rounded-2xl border transition-all hover:border-nunchi-200 hover:bg-nunchi-50/30 active:scale-[0.98]"
                style={{
                  borderColor: "var(--border)",
                  background: "white",
                }}>
                <span className="text-2xl">{action.emoji}</span>
                <p
                  className="text-sm font-semibold mt-1"
                  style={{ color: "var(--text-primary)" }}>
                  {action.label}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}>
                  {action.sub}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Reset — tersembunyi, tidak mengganggu */}
        <button
          onClick={() => {
            localStorage.removeItem("nunchi_visited");
            window.location.reload();
          }}
          className="w-full text-center mt-10 text-xs"
          style={{ color: "var(--text-secondary)", opacity: 0.25 }}>
          Reset experience
        </button>
      </div>
    </main>
  );
}
