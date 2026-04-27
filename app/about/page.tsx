"use client";

import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden px-6 pt-20 pb-24 flex flex-col items-center text-center"
        style={{
          background:
            "linear-gradient(180deg, #f0f4ff 0%, var(--bg-primary) 100%)",
        }}
      >
        {/* Ambient orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(90,112,243,0.1) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 max-w-xl">
          {/* SDG badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-8 border"
            style={{
              background: "#f0fdf4",
              borderColor: "#bbf7d0",
              color: "#15803d",
            }}
          >
            🌱 SDG 3: Good Health & Well-Being · 16th e-ICON World Contest
          </div>

          <h1
            className="font-bold mb-3"
            style={{ fontSize: 64, lineHeight: 1.05, color: "var(--accent-blue)" }}
          >
            눈치
          </h1>
          <p
            className="text-2xl font-light mb-5"
            style={{ color: "var(--text-secondary)" }}
          >
            Feel What&apos;s Not Said
          </p>
          <p
            className="text-base leading-relaxed mb-10 max-w-md mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            An AI-powered student wellness platform that detects emotional
            distress before it becomes a crisis — without clinical labels,
            forced disclosures, or making anyone feel singled out.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/onboarding"
              className="px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #5a70f3, #7c96f8)",
                boxShadow: "0 8px 24px rgba(90,112,243,0.22)",
              }}
            >
              Take the Nunchi Test →
            </Link>
            <Link
              href="/therapy"
              className="px-8 py-4 rounded-2xl font-medium text-base border transition-all hover:bg-white"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              Just feel it first
            </Link>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: "var(--accent-blue)" }}
        >
          Why this exists
        </p>
        <h2
          className="text-3xl font-bold mb-6 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          South Korea is living through a silent youth mental health emergency.
        </h2>
        <p
          className="text-base leading-relaxed mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          In 2023, 214 students died by suicide — the highest ever recorded.
          Academic performance drove suicidal impulses in 30.8% of cases. Yet
          only 22% of Koreans have ever sought professional mental health care.
          The barrier isn&apos;t access. It&apos;s culture.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { stat: "214", label: "Student suicides in Korea, 2023" },
            { stat: "49.4h", label: "Average weekly study hours per student" },
            { stat: "13 min", label: "Daily physical activity for Korean teens" },
            { stat: "22%", label: "Koreans who have ever sought mental health care" },
          ].map((s) => (
            <div
              key={s.stat}
              className="p-5 rounded-2xl text-center"
              style={{ background: "var(--bg-secondary)" }}
            >
              <p
                className="text-3xl font-bold mb-1"
                style={{ color: "var(--accent-blue)" }}
              >
                {s.stat}
              </p>
              <p
                className="text-xs leading-snug"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CULTURAL BRIDGE ── */}
      <section
        className="px-6 py-20"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--accent-blue)" }}
          >
            The cultural foundation
          </p>
          <h2
            className="text-3xl font-bold mb-10 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Two cultures. One complete emotional language.
          </h2>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {/* Korea */}
            <div
              className="p-7 rounded-3xl border"
              style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}
            >
              <div className="text-4xl mb-4">🇰🇷</div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: "#1e40af" }}
              >
                눈치 (Nunchi)
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#1e3a8a" }}
              >
                The Korean art of reading unspoken emotions — perceiving
                atmosphere and meaning before a word is spoken. Korean students
                are extraordinary at reading <em>others</em>. Culture prevents
                them from turning that awareness inward.
              </p>
            </div>

            {/* Indonesia */}
            <div
              className="p-7 rounded-3xl border"
              style={{ background: "#fff7ed", borderColor: "#fed7aa" }}
            >
              <div className="text-4xl mb-4">🇮🇩</div>
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: "#9a3412" }}
              >
                Curhat
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#7c2d12" }}
              >
                The Indonesian tradition of sharing emotional burdens openly.
                A social ritual where vulnerability is strength, not weakness.
                Indonesia expresses freely — but needs help reading silence.
              </p>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl text-center"
            style={{ background: "white", boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
          >
            <p
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Nunchi bridges both — so students can finally be seen.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: "var(--accent-blue)" }}
        >
          What it does
        </p>
        <h2
          className="text-3xl font-bold mb-10 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Eight features. One purpose: reach students before they know they need it.
        </h2>

        <div className="flex flex-col gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.id}
              className="flex gap-5 p-5 rounded-2xl border"
              style={{
                background: "white",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "var(--bg-secondary)" }}
              >
                {f.emoji}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--accent-blue)" }}
                  >
                    {f.id}
                  </span>
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {f.title}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section
        className="px-6 py-20"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: "var(--accent-blue)" }}
          >
            Target users
          </p>
          <h2
            className="text-3xl font-bold mb-10"
            style={{ color: "var(--text-primary)" }}
          >
            Built for everyone in the room.
          </h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {USERS.map((u) => (
              <div
                key={u.title}
                className="p-6 rounded-2xl"
                style={{ background: "white" }}
              >
                <div className="text-3xl mb-3">{u.emoji}</div>
                <h3
                  className="font-semibold mb-2 text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {u.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: "var(--accent-blue)" }}
        >
          The approach
        </p>
        <h2
          className="text-3xl font-bold mb-10"
          style={{ color: "var(--text-primary)" }}
        >
          Not a chatbot. A behavioral analysis engine.
        </h2>

        <div className="flex flex-col gap-6">
          {HOW.map((h, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                style={{
                  background: "var(--accent-blue)",
                  color: "white",
                }}
              >
                {i + 1}
              </div>
              <div>
                <p
                  className="font-semibold mb-1 text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {h.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRIVACY ── */}
      <section
        className="px-6 py-16"
        style={{ background: "var(--bg-secondary)" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-3xl mb-4">🔒</p>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Privacy by design.
          </h2>
          <p
            className="text-sm leading-relaxed max-w-xl mx-auto mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Camera frames processed in-browser — never transmitted. Session data
            stored in encrypted local IndexedDB. Vent Space content fully local,
            never synced. No advertising. No data monetization. Ever.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "No account required",
              "No data leaves device",
              "AES-256 encrypted",
              "No advertising",
              "Open source logic",
            ].map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 rounded-full border"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                  background: "white",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24 text-center">
        <div className="max-w-md mx-auto">
          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Ready to begin?
          </h2>
          <p
            className="text-sm mb-10"
            style={{ color: "var(--text-secondary)" }}
          >
            No sign-up. No labels. Just a space where you can finally be honest.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/onboarding"
              className="w-full py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #5a70f3, #7c96f8)",
                boxShadow: "0 8px 24px rgba(90,112,243,0.2)",
              }}
            >
              Take the Nunchi Test
            </Link>
            <Link
              href="/therapy"
              className="w-full py-4 rounded-2xl font-medium text-base border transition-all hover:bg-[var(--bg-secondary)]"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              Or just feel it first
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 py-8 text-center border-t"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-secondary)",
          fontSize: 12,
        }}
      >
        <p>Nunchi (눈치) · Team ZETH · 16th e-ICON World Contest · SDG 3</p>
        <p className="mt-1 opacity-60">
          Korea × Indonesia · All data processed locally · No advertising
        </p>
      </footer>
    </main>
  );
}

// ─────────────────────────────────────
// DATA
// ─────────────────────────────────────

const FEATURES = [
  {
    id: "F1",
    emoji: "👁️",
    title: "Computer Vision Mood Detection",
    desc: "TensorFlow.js + MediaPipe FaceMesh reads facial expressions entirely client-side. Outputs a 7-state emotional probability vector. Camera use is never mandatory. No images ever leave your device.",
  },
  {
    id: "F2",
    emoji: "🌅",
    title: "Daily Mood Check-In",
    desc: "A 60-second morning ritual combining CV detection with 3 AI-adaptive questions. Output is warm reflection — never a raw score. Passive timing signals like 2 AM sessions feed the Nunchi Scoring Engine.",
  },
  {
    id: "F3",
    emoji: "📚",
    title: "AI Study Recommendation Engine",
    desc: "Maps current emotional state to the optimal method: Pomodoro for stressed states, Feynman for low engagement, Spaced Repetition for neutral/good. Exam Planner auto-distributes load 7 days before exams.",
  },
  {
    id: "F4",
    emoji: "🏃",
    title: "Digital Health Breaks",
    desc: "AI-recommended micro-interventions after 40 minutes of study: gamified eye gymnastics, micro-stretch guides with the 20-20-20 rule, and physical posture detection via camera CV.",
  },
  {
    id: "F5",
    emoji: "🎮",
    title: "Adaptive Soundscape & Therapy Game",
    desc: "Browser-based procedural game adapting in real time to emotional state. Binaural beats mapped to psychological state via IPTS/IMV/3ST frameworks. Modes: Grounding, Release, Social, Eye Game, Focus. No progress saved — fresh each session.",
  },
  {
    id: "F6",
    emoji: "📝",
    title: "Private Vent Space",
    desc: "A fully private, anonymous journaling space. No replies, no reactions, no one sees it. AI reads patterns for wellness analysis only — content is never shown to others.",
  },
  {
    id: "F7",
    emoji: "🌡️",
    title: "7-Day Wellness & Balance Report",
    desc: "Weekly AI-generated summary comparing study progress vs. wellness score. Visualized as a 7×24 Nunchi Heatmap. Optional parent-friendly version framed around study focus.",
  },
  {
    id: "F8",
    emoji: "🏫",
    title: "Teacher Dashboard & Class Mood Map",
    desc: "Role-based access for teachers, parents, and counselors. Teachers view class-level mood trends mapped to seating layouts. Nuri flags students showing sustained behavioral decline — no raw data shared.",
  },
];

const USERS = [
  {
    emoji: "🎓",
    title: "Korean students, aged 13–18",
    desc: "Navigating Suneung academic pressure. Primary users. Nunchi reaches them through tools they already need — study planning and productivity — before they know they need wellness support.",
  },
  {
    emoji: "👨‍👩‍👧",
    title: "Parents & school counselors",
    desc: "Who sense something is wrong but have no systematic tool to detect or act on it. Nunchi gives them class-level patterns and early signals — without exposing any student's raw data.",
  },
  {
    emoji: "🇮🇩",
    title: "Indonesian student partners",
    desc: "Co-designers and peer users who bring curhat openness to the platform. Their cultural contribution makes the emotional language complete.",
  },
];

const HOW = [
  {
    title: "Input Layer — passive behavioral signals",
    desc: "CV mood detection, check-in timing, Vent Space frequency, and session duration combine into a 7-dimension emotional state vector. No self-reporting required.",
  },
  {
    title: "Analysis Layer — psychological state mapping",
    desc: "The state vector maps to a psychological state ID — defeat, entrapment, thwarted belonging, or burdensomeness — grounded in IPTS, IMV, and 3ST frameworks.",
  },
  {
    title: "Output Layer — silent recommendations",
    desc: "Nuri selects the optimal study method, binaural frequency, game mode, or health break. If sustained low Expression Openness is detected, the Warm Escalation Protocol connects the student to a counselor — naturally, not clinically.",
  },
];