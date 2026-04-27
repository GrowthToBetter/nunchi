"use client";

import { useState } from "react";

// F7: 7-day Wellness & Balance Report
// Nunchi Heatmap (7×24), study progress vs wellness score, AI one-sentence insight

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

type HeatLevel = "empty" | "low" | "mid" | "high" | "peak";

function randomHeat(): HeatLevel {
  const r = Math.random();
  if (r < 0.25) return "empty";
  if (r < 0.5) return "low";
  if (r < 0.75) return "mid";
  if (r < 0.9) return "high";
  return "peak";
}

// Simulated 7×24 heatmap data (day × hour)
const heatmapData: HeatLevel[][] = DAYS.map((_, d) =>
  HOURS.map((h) => {
    // Sleep hours mostly empty
    if (h < 6 || h > 23) return "empty";
    // Study peak hours
    if ((h >= 15 && h <= 18) || (h >= 20 && h <= 22)) return randomHeat();
    if (h >= 9 && h <= 12) return Math.random() > 0.3 ? "mid" : "low";
    return Math.random() > 0.6 ? "low" : "empty";
  })
);

const WEEKLY_STATS = {
  studyHours: 34,
  wellnessScore: 72,
  avgMood: "Calm",
  moodEmoji: "😌",
  avgSleep: "6.2h",
  physicalActivity: "11 min/day",
  ventSessions: 3,
  breaksTaken: 14,
};

const HIGHLIGHT_MOMENTS = [
  {
    day: "Tuesday",
    text: "Longest focused session — 2h 40 min Pomodoro streak",
    icon: "⚡",
  },
  {
    day: "Thursday",
    text: "Nuri detected low mood; you opened the soundscape — and stayed 18 minutes",
    icon: "🌿",
  },
  {
    day: "Saturday",
    text: "First time this week you logged physical activity before studying",
    icon: "🏃",
  },
];

const AI_INSIGHT =
  "Your study consistency is strong — but Nuri noticed your highest stress moments always follow days with less than 6 hours of sleep. Small shifts there could change everything.";

const HEATMAP_LEGEND: { level: HeatLevel; label: string }[] = [
  { level: "empty", label: "No activity" },
  { level: "low", label: "Light" },
  { level: "mid", label: "Moderate" },
  { level: "high", label: "Focused" },
  { level: "peak", label: "Peak" },
];

export default function DashboardPage() {
  const [parentView, setParentView] = useState(false);

  const wellnessPct = WEEKLY_STATS.wellnessScore;
  const studyPct = Math.round((WEEKLY_STATS.studyHours / 49) * 100);

  return (
    <div
      className="min-h-screen px-4 py-8 max-w-2xl mx-auto space-y-8"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Weekly Report
          </p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mt-1">
            Your Balance This Week
          </h1>
        </div>
        <button
          onClick={() => setParentView((v) => !v)}
          className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          {parentView ? "Student view" : "Parent view"}
        </button>
      </div>

      {/* AI Insight */}
      <div
        className="p-5 rounded-3xl space-y-1"
        style={{ background: "var(--bg-secondary)" }}
      >
        <p className="text-xs uppercase tracking-widest text-[var(--accent-blue)]">
          Nuri's Insight
        </p>
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
          {parentView
            ? "Your child maintained a consistent study schedule this week (34h total). Sleep patterns show room for improvement — earlier rest times correlate with better focus scores."
            : AI_INSIGHT}
        </p>
      </div>

      {/* Study vs Wellness */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-5 rounded-3xl space-y-3 card-shadow"
          style={{ background: "white" }}
        >
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Study Load
          </p>
          <div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {WEEKLY_STATS.studyHours}h
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              this week
            </p>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${studyPct}%`,
                background: "var(--accent-blue)",
              }}
            />
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            {studyPct}% of weekly goal
          </p>
        </div>

        <div
          className="p-5 rounded-3xl space-y-3 card-shadow"
          style={{ background: "white" }}
        >
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Wellness Score
          </p>
          <div>
            <p className="text-3xl font-bold text-[var(--accent-warm)]">
              {WEEKLY_STATS.wellnessScore}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              out of 100
            </p>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${wellnessPct}%`,
                background: "var(--accent-warm)",
              }}
            />
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Avg mood: {WEEKLY_STATS.moodEmoji} {WEEKLY_STATS.avgMood}
          </p>
        </div>
      </div>

      {/* Quick stats row */}
      {!parentView && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Avg sleep", value: WEEKLY_STATS.avgSleep, icon: "😴" },
            {
              label: "Activity",
              value: WEEKLY_STATS.physicalActivity,
              icon: "🏃",
            },
            {
              label: "Vent sessions",
              value: String(WEEKLY_STATS.ventSessions),
              icon: "📝",
            },
            {
              label: "Breaks taken",
              value: String(WEEKLY_STATS.breaksTaken),
              icon: "☕",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="p-3 rounded-2xl text-center"
              style={{ background: "var(--bg-secondary)" }}
            >
              <p className="text-xl">{s.icon}</p>
              <p className="text-xs font-semibold text-[var(--text-primary)] mt-1 leading-tight">
                {s.value}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Nunchi Heatmap */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Nunchi Heatmap
          </h2>
          <div className="flex items-center gap-2">
            {HEATMAP_LEGEND.map((l) => (
              <div key={l.level} className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-sm heat-${l.level}`}
                />
                <span className="text-[10px] text-[var(--text-secondary)] hidden sm:block">
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap grid — scrollable horizontally on mobile */}
        <div
          className="overflow-x-auto rounded-2xl p-4 card-shadow"
          style={{ background: "white" }}
        >
          <div style={{ minWidth: 520 }}>
            {/* Hour labels */}
            <div className="flex mb-1 ml-8">
              {[0, 6, 12, 18, 23].map((h) => (
                <div
                  key={h}
                  className="text-[10px] text-[var(--text-secondary)]"
                  style={{
                    width: `${(h === 23 ? 1 : (h === 18 ? 5 : 6)) / 24 * 100}%`,
                    flexShrink: 0,
                  }}
                >
                  {h}:00
                </div>
              ))}
            </div>

            {DAYS.map((day, d) => (
              <div key={day} className="flex items-center gap-1 mb-1">
                <span
                  className="text-[10px] text-[var(--text-secondary)] w-8 shrink-0 text-right"
                >
                  {day}
                </span>
                <div className="flex gap-0.5 flex-1">
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className={`flex-1 rounded-sm heat-${heatmapData[d][h]}`}
                      style={{ height: 14 }}
                      title={`${day} ${h}:00 — ${heatmapData[d][h]}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Highlight moments */}
      {!parentView && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            3 Moments That Mattered
          </h2>
          {HIGHLIGHT_MOMENTS.map((m) => (
            <div
              key={m.day}
              className="flex gap-3 p-4 rounded-2xl bg-white border border-[var(--border)] card-hover"
            >
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className="text-xs text-[var(--text-secondary)] mb-0.5">
                  {m.day}
                </p>
                <p className="text-sm text-[var(--text-primary)] leading-snug">
                  {m.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share */}
      <div className="flex gap-3 pb-4">
        <button
          className="flex-1 py-3 rounded-2xl text-sm font-medium text-white transition-all"
          style={{ background: "var(--accent-blue)" }}
          onClick={() => alert("PDF export coming soon")}
        >
          Export PDF
        </button>
        <a
          href="/mood"
          className="flex-1 py-3 rounded-2xl text-center text-sm font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          Today's check-in →
        </a>
      </div>
    </div>
  );
}
