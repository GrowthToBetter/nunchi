"use client";

import { useState } from "react";

// F8: Teacher Dashboard & Class Mood Map
// Role-based access, class-level mood trends, seating layout with color-coded indicators
// Filters: date, mood state, student group

type MoodLevel = "good" | "calm" | "stressed" | "low" | "anxious" | "unknown";

interface Student {
  id: number;
  name: string;
  mood: MoodLevel;
  trend: "improving" | "stable" | "declining";
  lastActive: string;
  studyHours: number;
  flag: boolean; // Nuri flagged for attention
}

const MOOD_CONFIG: Record<
  MoodLevel,
  { color: string; bg: string; emoji: string; label: string }
> = {
  good: { color: "#16a34a", bg: "#dcfce7", emoji: "😊", label: "Good" },
  calm: { color: "#2563eb", bg: "#dbeafe", emoji: "😌", label: "Calm" },
  stressed: { color: "#ea580c", bg: "#ffedd5", emoji: "😤", label: "Stressed" },
  low: { color: "#7c3aed", bg: "#ede9fe", emoji: "😔", label: "Low" },
  anxious: { color: "#dc2626", bg: "#fee2e2", emoji: "😰", label: "Anxious" },
  unknown: { color: "#9ca3af", bg: "#f3f4f6", emoji: "❓", label: "No data" },
};

// 5×7 seating grid (35 students)
const STUDENTS: Student[] = [
  { id: 1, name: "Kim J.", mood: "stressed", trend: "declining", lastActive: "2h ago", studyHours: 52, flag: true },
  { id: 2, name: "Park S.", mood: "calm", trend: "stable", lastActive: "1h ago", studyHours: 38, flag: false },
  { id: 3, name: "Lee M.", mood: "good", trend: "improving", lastActive: "3h ago", studyHours: 41, flag: false },
  { id: 4, name: "Choi Y.", mood: "anxious", trend: "declining", lastActive: "30m ago", studyHours: 48, flag: true },
  { id: 5, name: "Jung H.", mood: "low", trend: "declining", lastActive: "5h ago", studyHours: 29, flag: true },
  { id: 6, name: "Kang B.", mood: "calm", trend: "stable", lastActive: "2h ago", studyHours: 35, flag: false },
  { id: 7, name: "Shin D.", mood: "good", trend: "improving", lastActive: "1h ago", studyHours: 40, flag: false },
  { id: 8, name: "Oh J.", mood: "stressed", trend: "stable", lastActive: "4h ago", studyHours: 45, flag: false },
  { id: 9, name: "Yoon K.", mood: "unknown", trend: "stable", lastActive: "2d ago", studyHours: 0, flag: false },
  { id: 10, name: "Kwon T.", mood: "calm", trend: "improving", lastActive: "1h ago", studyHours: 37, flag: false },
  { id: 11, name: "Han S.", mood: "good", trend: "stable", lastActive: "2h ago", studyHours: 39, flag: false },
  { id: 12, name: "Lim C.", mood: "low", trend: "stable", lastActive: "3h ago", studyHours: 31, flag: false },
  { id: 13, name: "Song Y.", mood: "anxious", trend: "declining", lastActive: "1h ago", studyHours: 50, flag: true },
  { id: 14, name: "Nam H.", mood: "good", trend: "improving", lastActive: "45m ago", studyHours: 42, flag: false },
  { id: 15, name: "Bae W.", mood: "calm", trend: "stable", lastActive: "2h ago", studyHours: 36, flag: false },
  { id: 16, name: "Jeon M.", mood: "stressed", trend: "stable", lastActive: "3h ago", studyHours: 46, flag: false },
  { id: 17, name: "Cha J.", mood: "good", trend: "stable", lastActive: "1h ago", studyHours: 38, flag: false },
  { id: 18, name: "Ryu S.", mood: "calm", trend: "improving", lastActive: "2h ago", studyHours: 34, flag: false },
  { id: 19, name: "Yoo B.", mood: "unknown", trend: "stable", lastActive: "1d ago", studyHours: 0, flag: false },
  { id: 20, name: "Ahn P.", mood: "low", trend: "declining", lastActive: "6h ago", studyHours: 27, flag: true },
  { id: 21, name: "Yang D.", mood: "good", trend: "improving", lastActive: "1h ago", studyHours: 43, flag: false },
  { id: 22, name: "Moon K.", mood: "calm", trend: "stable", lastActive: "3h ago", studyHours: 35, flag: false },
  { id: 23, name: "Im J.", mood: "stressed", trend: "declining", lastActive: "2h ago", studyHours: 49, flag: false },
  { id: 24, name: "Hwang S.", mood: "good", trend: "stable", lastActive: "1h ago", studyHours: 40, flag: false },
  { id: 25, name: "Noh Y.", mood: "calm", trend: "stable", lastActive: "2h ago", studyHours: 37, flag: false },
  { id: 26, name: "Heo M.", mood: "anxious", trend: "stable", lastActive: "1h ago", studyHours: 44, flag: false },
  { id: 27, name: "Jang H.", mood: "good", trend: "improving", lastActive: "3h ago", studyHours: 41, flag: false },
  { id: 28, name: "Baek J.", mood: "low", trend: "stable", lastActive: "4h ago", studyHours: 30, flag: false },
  { id: 29, name: "Gong S.", mood: "calm", trend: "improving", lastActive: "1h ago", studyHours: 36, flag: false },
  { id: 30, name: "Seo Y.", mood: "good", trend: "stable", lastActive: "2h ago", studyHours: 39, flag: false },
  { id: 31, name: "Tak B.", mood: "stressed", trend: "declining", lastActive: "1h ago", studyHours: 47, flag: false },
  { id: 32, name: "Pyo K.", mood: "calm", trend: "stable", lastActive: "3h ago", studyHours: 35, flag: false },
  { id: 33, name: "Eum J.", mood: "good", trend: "improving", lastActive: "2h ago", studyHours: 40, flag: false },
  { id: 34, name: "Woo S.", mood: "unknown", trend: "stable", lastActive: "3d ago", studyHours: 0, flag: false },
  { id: 35, name: "Gil M.", mood: "anxious", trend: "declining", lastActive: "30m ago", studyHours: 51, flag: true },
];

const MOOD_FILTERS: (MoodLevel | "all")[] = [
  "all",
  "good",
  "calm",
  "stressed",
  "low",
  "anxious",
  "unknown",
];

export default function TeacherPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [moodFilter, setMoodFilter] = useState<MoodLevel | "all">("all");
  const [showFlagged, setShowFlagged] = useState(false);

  const flaggedCount = STUDENTS.filter((s) => s.flag).length;
  const moodCounts = Object.fromEntries(
    (Object.keys(MOOD_CONFIG) as MoodLevel[]).map((m) => [
      m,
      STUDENTS.filter((s) => s.mood === m).length,
    ])
  );

  const filteredIds = new Set(
    STUDENTS.filter((s) => {
      if (showFlagged && !s.flag) return false;
      if (moodFilter !== "all" && s.mood !== moodFilter) return false;
      return true;
    }).map((s) => s.id)
  );

  return (
    <div
      className="min-h-screen px-4 py-8 max-w-3xl mx-auto space-y-6"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Teacher Dashboard
          </p>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] mt-1">
            Class 2-A Mood Map
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            35 students · Updated just now
          </p>
        </div>
        {flaggedCount > 0 && (
          <button
            onClick={() => setShowFlagged((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: showFlagged ? "#fee2e2" : "var(--bg-secondary)",
              color: showFlagged ? "#dc2626" : "var(--text-secondary)",
              border: `1px solid ${showFlagged ? "#fca5a5" : "var(--border)"}`,
            }}
          >
            <span>🚩</span>
            <span>{flaggedCount} flagged</span>
          </button>
        )}
      </div>

      {/* Class mood summary */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {(Object.entries(moodCounts) as [MoodLevel, number][]).map(
          ([mood, count]) => (
            <button
              key={mood}
              onClick={() =>
                setMoodFilter((f) => (f === mood ? "all" : mood))
              }
              className="p-3 rounded-2xl text-center transition-all border-2"
              style={{
                background:
                  moodFilter === mood
                    ? MOOD_CONFIG[mood].bg
                    : "white",
                borderColor:
                  moodFilter === mood
                    ? MOOD_CONFIG[mood].color
                    : "var(--border)",
              }}
            >
              <p className="text-xl">{MOOD_CONFIG[mood].emoji}</p>
              <p
                className="text-lg font-bold mt-1"
                style={{ color: MOOD_CONFIG[mood].color }}
              >
                {count}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {MOOD_CONFIG[mood].label}
              </p>
            </button>
          )
        )}
      </div>

      {/* Seating layout */}
      <div
        className="p-5 rounded-3xl card-shadow"
        style={{ background: "white" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Seating Layout
          </h2>
          {/* Teacher's desk label */}
          <div
            className="text-xs px-3 py-1 rounded-full text-[var(--text-secondary)]"
            style={{ background: "var(--bg-secondary)" }}
          >
            ← Teacher's desk
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {STUDENTS.map((s) => {
            const cfg = MOOD_CONFIG[s.mood];
            const dimmed = filteredIds.size > 0 && !filteredIds.has(s.id);
            return (
              <button
                key={s.id}
                onClick={() =>
                  setSelectedStudent((sel) =>
                    sel?.id === s.id ? null : s
                  )
                }
                className="relative aspect-square rounded-xl flex flex-col items-center justify-center text-center transition-all"
                style={{
                  background: dimmed ? "var(--bg-secondary)" : cfg.bg,
                  opacity: dimmed ? 0.35 : 1,
                  border: `2px solid ${
                    selectedStudent?.id === s.id
                      ? cfg.color
                      : "transparent"
                  }`,
                }}
                title={s.name}
              >
                <span className="text-base">{cfg.emoji}</span>
                <span
                  className="text-[9px] leading-tight mt-0.5 px-0.5"
                  style={{ color: cfg.color }}
                >
                  {s.name.split(" ")[0]}
                </span>
                {s.flag && (
                  <span className="absolute -top-1 -right-1 text-[10px]">
                    🚩
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {(Object.entries(MOOD_CONFIG) as [MoodLevel, typeof MOOD_CONFIG[MoodLevel]][]).map(
            ([mood, cfg]) => (
              <div key={mood} className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.color}` }}
                />
                <span className="text-[10px] text-[var(--text-secondary)]">
                  {cfg.label}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Student detail panel */}
      {selectedStudent && (
        <div
          className="p-5 rounded-3xl space-y-4 card-shadow nuri-message"
          style={{ background: "white" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                style={{
                  background: MOOD_CONFIG[selectedStudent.mood].bg,
                }}
              >
                {MOOD_CONFIG[selectedStudent.mood].emoji}
              </div>
              <div>
                <p className="font-semibold text-[var(--text-primary)]">
                  {selectedStudent.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  Last active: {selectedStudent.lastActive}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-[var(--text-secondary)] text-xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div
              className="p-3 rounded-xl text-center"
              style={{ background: "var(--bg-secondary)" }}
            >
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {selectedStudent.studyHours}h
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Study hrs/wk
              </p>
            </div>
            <div
              className="p-3 rounded-xl text-center"
              style={{
                background: MOOD_CONFIG[selectedStudent.mood].bg,
              }}
            >
              <p
                className="text-lg font-bold"
                style={{ color: MOOD_CONFIG[selectedStudent.mood].color }}
              >
                {MOOD_CONFIG[selectedStudent.mood].label}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Current mood
              </p>
            </div>
            <div
              className="p-3 rounded-xl text-center"
              style={{ background: "var(--bg-secondary)" }}
            >
              <p
                className="text-lg font-bold"
                style={{
                  color:
                    selectedStudent.trend === "improving"
                      ? "#16a34a"
                      : selectedStudent.trend === "declining"
                      ? "#dc2626"
                      : "var(--text-secondary)",
                }}
              >
                {selectedStudent.trend === "improving"
                  ? "↑"
                  : selectedStudent.trend === "declining"
                  ? "↓"
                  : "→"}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                7-day trend
              </p>
            </div>
          </div>

          {selectedStudent.flag && (
            <div
              className="p-4 rounded-2xl text-sm"
              style={{ background: "#fee2e2", color: "#dc2626" }}
            >
              <p className="font-medium mb-1">🚩 Nuri flagged this student</p>
              <p className="text-xs opacity-80">
                Behavioral patterns over the past 5 days suggest elevated
                stress and reduced emotional openness. Consider a brief
                check-in — even a casual one.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "var(--accent-blue)" }}
              onClick={() => alert("Counselor referral sent (demo)")}
            >
              Refer to counselor
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-[var(--border)] text-[var(--text-secondary)]"
              onClick={() => setSelectedStudent(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Flagged list */}
      {showFlagged && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Students Needing Attention
          </h2>
          {STUDENTS.filter((s) => s.flag).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white border border-[var(--border)] text-left card-hover"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: MOOD_CONFIG[s.mood].bg }}
              >
                {MOOD_CONFIG[s.mood].emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {s.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {s.studyHours}h/wk · Trend:{" "}
                  <span
                    style={{
                      color:
                        s.trend === "declining" ? "#dc2626" : "inherit",
                    }}
                  >
                    {s.trend}
                  </span>
                </p>
              </div>
              <span className="text-xs text-[var(--text-secondary)] shrink-0">
                {s.lastActive}
              </span>
            </button>
          ))}
        </div>
      )}

      <p
        className="text-xs text-center pb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        All data is aggregate and de-identified. Raw session content is never
        accessible.
      </p>
    </div>
  );
}
