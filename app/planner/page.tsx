"use client";

import { useState } from "react";
import Link from "next/link";

type ExamEntry = {
  id: string;
  name: string;
  date: string;
  subject: string;
};

const SAMPLE_EXAMS: ExamEntry[] = [
  { id: "1", name: "수능 (Suneung) Mock", date: "2026-05-15", subject: "All subjects" },
  { id: "2", name: "Math Midterm", date: "2026-04-28", subject: "Mathematics" },
  { id: "3", name: "English Assessment", date: "2026-05-05", subject: "English" },
];

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function generatePlan(exam: ExamEntry) {
  const days = daysUntil(exam.date);
  const entries = [];
  for (let i = 0; i < Math.min(days, 7); i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dayName = d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
    const isPreExam = i >= days - 14;
    entries.push({
      day: dayName,
      study: `${Math.min(4, 2 + Math.floor(i / 3))}h focused study`,
      wellness: i % 2 === 0 ? "Grounding session · 10 min" : "Curhat check-in with Nuri",
      nunchCheck: i % 3 === 0 ? "Check on a classmate today 🤝" : null,
      sleepTarget: "10:30 PM → 6:30 AM",
      alert: isPreExam ? "Pre-exam period — mood check-ins increased" : null,
    });
  }
  return entries;
}

export default function PlannerPage() {
  const [exams, setExams] = useState<ExamEntry[]>(SAMPLE_EXAMS);
  const [selectedExam, setSelectedExam] = useState<ExamEntry | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newExam, setNewExam] = useState({ name: "", date: "", subject: "" });

  const plan = selectedExam ? generatePlan(selectedExam) : [];
  const days = selectedExam ? daysUntil(selectedExam.date) : 0;

  const addExam = () => {
    if (!newExam.name || !newExam.date) return;
    setExams([...exams, { ...newExam, id: Date.now().toString() }]);
    setNewExam({ name: "", date: "", subject: "" });
    setAddMode(false);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 border-b border-sand-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <Link href="/" className="text-sand-400 hover:text-sand-600 text-sm">←</Link>
        <h1 className="font-bold text-[#1a1a2e]">Exam Planner</h1>
        <button
          onClick={() => setAddMode(true)}
          className="text-sm text-nunchi-600 font-medium"
        >
          + Add
        </button>
      </header>

      <div className="px-4 py-6 max-w-2xl mx-auto w-full flex flex-col gap-4">
        {/* Description */}
        <div className="bg-nunchi-50 border border-nunchi-100 rounded-2xl p-4 text-sm text-nunchi-700">
          <p className="font-semibold mb-1">📅 Wellness-integrated planning</p>
          <p className="text-xs leading-relaxed opacity-80">
            Your study plan automatically embeds wellness breaks, sleep targets, and &ldquo;nunchi check&rdquo; moments — prompts to check on how a friend is doing.
          </p>
        </div>

        {/* Exam list */}
        <div className="flex flex-col gap-3">
          {exams.map((exam) => {
            const d = daysUntil(exam.date);
            const isSelected = selectedExam?.id === exam.id;
            return (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(isSelected ? null : exam)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all card-hover ${
                  isSelected
                    ? "border-nunchi-400 bg-nunchi-50"
                    : "border-sand-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1a1a2e] text-sm">{exam.name}</p>
                    <p className="text-xs text-sand-400 mt-0.5">{exam.subject} · {new Date(exam.date).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${d <= 14 ? "text-amber-500" : "text-nunchi-600"}`}>{d}</p>
                    <p className="text-xs text-sand-400">days</p>
                  </div>
                </div>
                {d <= 14 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <p className="text-xs text-amber-600">Pre-exam window · Check-ins increased</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Generated plan */}
        {selectedExam && (
          <div className="bg-white rounded-3xl p-5 card-shadow border border-sand-100">
            <h2 className="font-bold text-[#1a1a2e] mb-1 text-sm">
              {selectedExam.name} — {days}-day wellness plan
            </h2>
            <p className="text-xs text-sand-400 mb-4">Next 7 days shown</p>

            <div className="flex flex-col gap-4">
              {plan.map((entry, i) => (
                <div key={i} className={`rounded-2xl p-4 ${entry.alert ? "bg-amber-50 border border-amber-100" : "bg-sand-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm text-[#1a1a2e]">{entry.day}</p>
                    {entry.alert && (
                      <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">⚠️ Pre-exam</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-sand-600">
                      <span>📚</span>
                      <span>{entry.study}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-nunchi-600">
                      <span>🌿</span>
                      <span>{entry.wellness}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-sand-500">
                      <span>😴</span>
                      <span>Sleep: {entry.sleepTarget}</span>
                    </div>
                    {entry.nunchCheck && (
                      <div className="flex items-center gap-2 text-xs text-warm-600 mt-1">
                        <span>🤝</span>
                        <span>{entry.nunchCheck}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add exam modal */}
        {addMode && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md card-shadow">
              <h2 className="font-bold text-[#1a1a2e] mb-5">Add Exam</h2>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-sand-400 mb-1 block">Exam name</label>
                  <input
                    value={newExam.name}
                    onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                    placeholder="e.g. 수능 Mock, Math Final..."
                    className="w-full border border-sand-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-nunchi-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-sand-400 mb-1 block">Subject</label>
                  <input
                    value={newExam.subject}
                    onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                    placeholder="e.g. Mathematics, All subjects"
                    className="w-full border border-sand-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-nunchi-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-sand-400 mb-1 block">Exam date</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    className="w-full border border-sand-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-nunchi-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button
                  onClick={addExam}
                  disabled={!newExam.name || !newExam.date}
                  className="flex-1 bg-nunchi-600 text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40"
                >
                  Add to planner
                </button>
                <button
                  onClick={() => setAddMode(false)}
                  className="flex-1 border border-sand-200 text-sand-600 py-3 rounded-xl text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
