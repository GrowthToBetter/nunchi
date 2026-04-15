"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const QUOTES = [
  { kr: "괜찮아", meaning: '"I\'m fine" — but the room knows otherwise.' },
  { kr: "눈치", meaning: "Reading the room before a word is spoken." },
  { kr: "같이 있어줌", meaning: "Being present — together, in silence." },
];

export default function Home() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const quote = QUOTES[quoteIdx];

  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#e8e6de] bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-nunchi-600">눈치</span>
          <span className="text-sm text-sand-500 font-medium">Nunchi</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-sand-600">
          <Link href="/onboarding" className="hover:text-nunchi-600 transition-colors">Start</Link>
          <Link href="/chat" className="hover:text-nunchi-600 transition-colors">Talk to Nuri</Link>
          <Link href="/therapy" className="hover:text-nunchi-600 transition-colors">Therapy Space</Link>
          <Link href="/profile" className="hover:text-nunchi-600 transition-colors">My Profile</Link>
        </div>
        <Link
          href="/onboarding"
          className="bg-nunchi-600 text-white text-sm px-4 py-2 rounded-full hover:bg-nunchi-700 transition-colors"
        >
          Begin →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nunchi-200/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-warm-200/25 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: "1.5s" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* SDG badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <span>🌱</span>
            <span>SDG 3: Good Health & Well-Being · 16th e-ICON World Contest</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-[#1a1a2e] mb-4 leading-tight">
            눈치
          </h1>
          <p className="text-xl md:text-2xl text-nunchi-600 font-semibold mb-6">
            Feel What&apos;s Not Said
          </p>

          {/* Rotating quote */}
          <div
            className="h-20 flex flex-col items-center justify-center mb-10 transition-opacity duration-500"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <p className="text-3xl font-light text-sand-700 italic">{quote.kr}</p>
            <p className="text-sm text-sand-500 mt-1">{quote.meaning}</p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link
              href="/onboarding"
              className="bg-nunchi-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-nunchi-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Take the Nunchi Test
            </Link>
            <Link
              href="/chat"
              className="bg-white border border-sand-200 text-sand-700 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-nunchi-300 hover:text-nunchi-600 transition-all card-hover"
            >
              Talk to Nuri
            </Link>
          </div>

          <p className="text-xs text-sand-400 mt-6">No account required · All data stays on your device</p>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 py-16 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-[#1a1a2e] mb-3">Seven Features, One Purpose</h2>
          <p className="text-center text-sand-500 mb-10 text-sm">Grounded in psychological theory. Built for cultural truth.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <Link href={f.href} key={f.id}>
                <div className="bg-white rounded-2xl p-5 card-shadow card-hover cursor-pointer border border-sand-100">
                  <div className="text-2xl mb-3">{f.emoji}</div>
                  <div className="text-xs text-nunchi-500 font-semibold mb-1 uppercase tracking-wider">{f.id}</div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-1 text-sm">{f.title}</h3>
                  <p className="text-xs text-sand-500 leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cultural bridge section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Korea */}
            <div className="bg-nunchi-50 border border-nunchi-100 rounded-3xl p-8">
              <div className="text-4xl mb-4">🇰🇷</div>
              <h3 className="font-bold text-nunchi-800 text-lg mb-2">눈치 (Nunchi)</h3>
              <p className="text-nunchi-700 text-sm leading-relaxed">
                The Korean art of reading the room — perceiving unspoken feelings, social cues, and emotional atmosphere before a word is spoken. Korean students are extraordinary at reading <em>others</em>. Culture prevents them from turning that awareness inward.
              </p>
            </div>
            {/* Indonesia */}
            <div className="bg-warm-50 border border-warm-100 rounded-3xl p-8">
              <div className="text-4xl mb-4">🇮🇩</div>
              <h3 className="font-bold text-warm-800 text-lg mb-2">Curhat</h3>
              <p className="text-warm-700 text-sm leading-relaxed">
                The Indonesian tradition of sharing emotional burdens openly — speaking to be heard, not just to release. A structured social ritual where vulnerability is strength, not weakness. Indonesia expresses freely but needs help reading silence.
              </p>
            </div>
          </div>
          <div className="text-center mt-8 p-6 bg-white rounded-2xl card-shadow">
            <p className="text-lg font-semibold text-[#1a1a2e]">Together, they make a complete emotional language.</p>
            <p className="text-sand-500 text-sm mt-1">That&apos;s what Nunchi brings to your pocket.</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 bg-[#1a1a2e] text-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sand-400 text-sm mb-8 uppercase tracking-widest">Why This Matters</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.stat}>
                <div className="text-3xl font-bold text-nunchi-400">{s.stat}</div>
                <div className="text-xs text-sand-400 mt-1 leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-sand-400 border-t border-sand-100">
        <p>Nunchi · Team NUNCHI (눈치) · 16th e-ICON World Contest · SDG 3</p>
        <p className="mt-1">Korea × Indonesia · All data processed locally · No advertising</p>
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    id: "F1",
    emoji: "👁️",
    title: "Computer Vision Mood Detection",
    desc: "AI reads facial expressions via TensorFlow.js — entirely client-side. No images ever leave your device.",
    href: "/chat",
  },
  {
    id: "F2",
    emoji: "🌅",
    title: "Daily Mood Check-In",
    desc: "A 60-second morning ritual. 3 adaptive questions. Gentle reflections — never raw scores.",
    href: "/chat",
  },
  {
    id: "F3",
    emoji: "💬",
    title: "Nuri: AI Cultural Companion",
    desc: "Your bicultural peer. Speaks Korean, Indonesian, English. Mirrors nunchi and curhat communication styles.",
    href: "/chat",
  },
  {
    id: "F4",
    emoji: "📅",
    title: "Exam Planner with Wellness",
    desc: "Study rhythm plans that embed mandatory wellness breaks and 'nunchi check' moments.",
    href: "/planner",
  },
  {
    id: "F5",
    emoji: "🎮",
    title: "Adaptive Therapy Game",
    desc: "Browser-based game + binaural soundscapes that adapt to your emotional state in real time.",
    href: "/therapy",
  },
  {
    id: "F6/F7",
    emoji: "🌡️",
    title: "Nunchi Profile & Heatmap",
    desc: "7×24 temporal heatmap of expression openness. Two-circle profile: Reading Others vs Expressing Self.",
    href: "/profile",
  },
];

const STATS = [
  { stat: "221", label: "Student suicides in Korea in 2024 — the highest ever recorded" },
  { stat: "32.9%", label: "Korean teenagers report suicidal thoughts linked to exam pressure" },
  { stat: "0", label: "Korean-language mental health apps available to the public in 2025" },
  { stat: "18.55%", label: "Annual growth in Korea's digital mental health market" },
];
