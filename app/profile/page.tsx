"use client";

import { useState } from "react";
import Link from "next/link";

// Simulate heatmap data
function generateHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return days.map((day) =>
    hours.map((h) => {
      // High expression openness in evening hours on weekdays
      if (h >= 21 && h <= 23) return Math.random() * 0.4 + 0.5;
      if (h >= 0 && h <= 3) return Math.random() * 0.5 + 0.4; // Late night signal
      if (h >= 7 && h <= 9) return Math.random() * 0.3 + 0.2;
      return Math.random() * 0.25;
    })
  );
}

const HEATMAP = generateHeatmap();

function heatColor(val: number) {
  if (val < 0.15) return "#f1f0eb";
  if (val < 0.3) return "#bfdbfe";
  if (val < 0.5) return "#60a5fa";
  if (val < 0.7) return "#f97316";
  return "#ef4444";
}

const WEEKLY_DATA = [
  { day: "Mon", nunchi: 72, expression: 45 },
  { day: "Tue", nunchi: 68, expression: 50 },
  { day: "Wed", nunchi: 80, expression: 38 },
  { day: "Thu", nunchi: 75, expression: 42 },
  { day: "Fri", nunchi: 71, expression: 60 },
  { day: "Sat", nunchi: 65, expression: 70 },
  { day: "Sun", nunchi: 69, expression: 68 },
];

const avgNunchi = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.nunchi, 0) / WEEKLY_DATA.length);
const avgExpr = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.expression, 0) / WEEKLY_DATA.length);
const gap = avgNunchi - avgExpr;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "heatmap" | "report">("profile");

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 border-b border-sand-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="w-8" />
        <h1 className="font-bold text-[#1a1a2e]">Nunchi Profile</h1>
        <div className="w-8" />
      </header>

      {/* Tabs */}
      <div className="flex border-b border-sand-100 bg-white">
        {(["profile", "heatmap", "report"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-nunchi-600 border-b-2 border-nunchi-500"
                : "text-sand-400 hover:text-sand-600"
            }`}
          >
            {tab === "profile" ? "My Profile" : tab === "heatmap" ? "Heatmap" : "Weekly Report"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "heatmap" && <HeatmapTab />}
        {activeTab === "report" && <ReportTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  const overlap = Math.min(avgNunchi, avgExpr) * 0.6;

  return (
    <div className="flex flex-col gap-6">
      {/* Two-circle visualization */}
      <div className="bg-white rounded-3xl p-6 card-shadow border border-sand-100">
        <h2 className="font-bold text-[#1a1a2e] mb-1">Your Emotional Balance</h2>
        <p className="text-xs text-sand-400 mb-6">The gap between circles is your wellness signal</p>

        <div className="relative flex items-center justify-center h-48 mb-4">
          {/* Reading Others circle */}
          <div
            className="absolute w-36 h-36 rounded-full bg-nunchi-100 border-2 border-nunchi-300 flex items-center justify-center"
            style={{ left: `calc(50% - ${90 + overlap * 0.2}px)`, top: "50%", transform: "translateY(-50%)" }}
          >
            <div className="text-center">
              <p className="text-xs font-semibold text-nunchi-700">Reading</p>
              <p className="text-xs text-nunchi-600">Others</p>
              <p className="text-2xl font-bold text-nunchi-700 mt-1">{avgNunchi}</p>
            </div>
          </div>

          {/* Expressing Self circle */}
          <div
            className="absolute w-36 h-36 rounded-full bg-warm-100 border-2 border-warm-300 flex items-center justify-center"
            style={{ right: `calc(50% - ${90 + overlap * 0.2}px)`, top: "50%", transform: "translateY(-50%)" }}
          >
            <div className="text-center">
              <p className="text-xs font-semibold text-warm-700">Expressing</p>
              <p className="text-xs text-warm-600">Self</p>
              <p className="text-2xl font-bold text-warm-700 mt-1">{avgExpr}</p>
            </div>
          </div>

          {/* Overlap label */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
            <p className="text-xs font-semibold text-[#1a1a2e] bg-white/80 px-2 py-0.5 rounded-full">
              Connection
            </p>
          </div>
        </div>

        {/* Gap analysis */}
        <div className={`rounded-2xl p-4 ${gap > 25 ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"}`}>
          <p className={`text-sm font-medium ${gap > 25 ? "text-amber-800" : "text-green-800"}`}>
            {gap > 25
              ? `You read others ${gap} points better than you express yourself. This gap is what Nuri is here to bridge.`
              : `Your reading and expressing are in good balance this week. Keep nurturing both.`}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-3xl p-6 card-shadow border border-sand-100">
        <h3 className="font-semibold text-[#1a1a2e] mb-4 text-sm">This Week&apos;s Trend</h3>
        <div className="flex items-end gap-2 h-32">
          {WEEKLY_DATA.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center gap-0.5">
                <div
                  className="w-full bg-nunchi-400 rounded-t-sm"
                  style={{ height: `${(d.nunchi / 100) * 80}px` }}
                  title={`Reading: ${d.nunchi}`}
                />
                <div
                  className="w-full bg-warm-400 rounded-b-sm"
                  style={{ height: `${(d.expression / 100) * 80}px`, marginTop: "2px" }}
                  title={`Expressing: ${d.expression}`}
                />
              </div>
              <span className="text-xs text-sand-400">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-sand-500">
            <div className="w-3 h-3 bg-nunchi-400 rounded-sm" />
            Reading Others
          </div>
          <div className="flex items-center gap-1.5 text-xs text-sand-500">
            <div className="w-3 h-3 bg-warm-400 rounded-sm" />
            Expressing Self
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/chat" className="bg-nunchi-50 border border-nunchi-100 rounded-2xl p-4 text-center card-hover">
          <div className="text-2xl mb-1">💬</div>
          <p className="text-xs font-semibold text-nunchi-700">Talk to Nuri</p>
        </Link>
        <Link href="/therapy" className="bg-warm-50 border border-warm-100 rounded-2xl p-4 text-center card-hover">
          <div className="text-2xl mb-1">🎮</div>
          <p className="text-xs font-semibold text-warm-700">Therapy Space</p>
        </Link>
      </div>
    </div>
  );
}

function HeatmapTab() {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [hovered, setHovered] = useState<{ day: string; hour: number; val: number } | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl p-5 card-shadow border border-sand-100">
        <h2 className="font-bold text-[#1a1a2e] mb-1">Nunchi Heatmap</h2>
        <p className="text-xs text-sand-400 mb-4">
          7×24 grid — when your expression openness is highest and lowest. Timing itself is a behavioral signal.
        </p>

        {/* Hovered info */}
        {hovered && (
          <div className="mb-3 bg-nunchi-50 border border-nunchi-100 rounded-xl px-3 py-2 text-xs text-nunchi-700">
            <strong>{hovered.day}</strong> at {hovered.hour}:00 —{" "}
            {hovered.val < 0.15
              ? "Very low expression"
              : hovered.val < 0.3
              ? "Low expression"
              : hovered.val < 0.5
              ? "Moderate openness"
              : hovered.val < 0.7
              ? "High openness"
              : "Peak expression — notable timing"}
          </div>
        )}

        {/* Heatmap grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            {/* Hour labels */}
            <div className="flex ml-10 mb-1">
              {hours.map((h) => (
                <div key={h} className="flex-1 text-center" style={{ fontSize: "8px", color: "#9b9b90" }}>
                  {h % 3 === 0 ? h : ""}
                </div>
              ))}
            </div>

            {days.map((day, di) => (
              <div key={day} className="flex items-center mb-1">
                <div className="w-10 text-xs text-sand-400 flex-shrink-0">{day}</div>
                <div className="flex flex-1 gap-0.5">
                  {hours.map((h) => {
                    const val = HEATMAP[di][h];
                    return (
                      <div
                        key={h}
                        className="flex-1 aspect-square rounded-sm cursor-pointer transition-transform hover:scale-125"
                        style={{ backgroundColor: heatColor(val) }}
                        onMouseEnter={() => setHovered({ day, hour: h, val })}
                        onMouseLeave={() => setHovered(null)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-sand-400">Low</span>
          {["#f1f0eb", "#bfdbfe", "#60a5fa", "#f97316", "#ef4444"].map((c) => (
            <div key={c} className="w-5 h-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
          <span className="text-xs text-sand-400">High</span>
        </div>

        {/* Late night annotation */}
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
          <p className="font-semibold mb-0.5">🌙 Late-night signal detected</p>
          <p>You tend to open up between midnight–3 AM — a behavioral signature that standard questionnaires never capture. Nuri has noticed.</p>
        </div>
      </div>
    </div>
  );
}

function ReportTab() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-br from-nunchi-50 to-warm-50 rounded-3xl p-6 border border-sand-100 card-shadow">
        <p className="text-xs font-semibold text-nunchi-500 uppercase tracking-wider mb-2">This week&apos;s Nunchi insight</p>
        <p className="text-[#1a1a2e] font-medium text-base leading-relaxed">
          Your ability to read others is strong — but you&apos;re carrying more alone than you need to. The gap is closing.
        </p>
      </div>

      {/* Highlights */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-sand-100">
        <h3 className="font-semibold text-[#1a1a2e] mb-4 text-sm">Highlights</h3>
        <div className="flex flex-col gap-3">
          {HIGHLIGHTS.map((h, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{h.emoji}</span>
              <p className="text-sm text-sand-600 leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Parent summary option */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-sand-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-[#1a1a2e] text-sm mb-1">Share with parent / counselor</h3>
            <p className="text-xs text-sand-400">
              Generates a summary about &ldquo;study focus and emotional readiness&rdquo; — no clinical language
            </p>
          </div>
          <button className="flex-shrink-0 bg-nunchi-50 border border-nunchi-200 text-nunchi-600 text-xs px-3 py-1.5 rounded-full hover:bg-nunchi-100 transition-colors">
            Generate PDF
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl p-5 card-shadow border border-sand-100">
        <h3 className="font-semibold text-[#1a1a2e] mb-3 text-sm">Personalized recommendations</h3>
        <div className="flex flex-col gap-2">
          {RECS.map((r, i) => (
            <Link href={r.href} key={i} className="flex items-center gap-3 p-3 rounded-xl bg-sand-50 hover:bg-sand-100 transition-colors">
              <span>{r.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1a1a2e]">{r.title}</p>
                <p className="text-xs text-sand-400">{r.sub}</p>
              </div>
              <span className="text-sand-300 text-sm">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const HIGHLIGHTS = [
  { emoji: "👁️", text: "On Wednesday, you picked up your friend's anxiety before they said anything — that's strong nunchi." },
  { emoji: "🌙", text: "You've been most expressive late at night. Nuri noticed — and isn't judging." },
  { emoji: "📈", text: "Expression Openness increased 8 points from last week. Small, but real." },
];

const RECS = [
  { emoji: "🌊", title: "Try Grounding Mode today", sub: "Your late-night pattern suggests tension building", href: "/therapy" },
  { emoji: "💬", title: "Talk to Nuri about the gap", sub: "Reading others vs expressing yourself", href: "/chat" },
  { emoji: "📅", title: "Set a pre-exam wellness buffer", sub: "14 days out — highest risk window", href: "/planner" },
];
