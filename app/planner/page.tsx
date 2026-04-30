"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveGridBox } from "@/components/InteractiveGridBox";
import { Plus, BookOpen, Leaf, Moon, HeartHandshake, AlertCircle, Calendar } from "lucide-react";

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
      nunchCheck: i % 3 === 0 ? "Check on a classmate today" : null,
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
    <InteractiveGridBox 
      className="min-h-screen bg-[#fafaf8]"
      highlightColor="rgba(90, 112, 243, 0.2)"
      glowColor="rgba(90, 112, 243, 0.05)"
      clickGlowColor="rgba(90, 112, 243, 0.1)"
    >
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/40 bg-white/40 backdrop-blur-2xl sticky top-0 z-40">
        <h1 className="font-bold text-lg text-[var(--text-primary)]">Exam Planner</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddMode(true)}
          className="flex items-center gap-1.5 text-xs bg-[var(--accent-blue)] text-white px-4 py-2 rounded-full font-semibold shadow-[0_4px_12px_rgba(90,112,243,0.3)]"
        >
          <Plus size={14} strokeWidth={3} /> Add
        </motion.button>
      </header>

      <div className="px-5 py-6 max-w-2xl mx-auto w-full flex flex-col gap-6 pb-24">
        {/* Description */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 border border-white/80 rounded-3xl p-5 text-sm shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 font-semibold mb-2 text-[var(--text-primary)]">
            <Calendar size={18} className="text-[var(--accent-blue)]" /> Wellness-Integrated Planning
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Your study plan automatically embeds wellness breaks, sleep targets, and "nunchi check" moments — prompts to check on how a friend is doing.
          </p>
        </motion.div>

        {/* Exam list */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {exams.map((exam, i) => {
              const d = daysUntil(exam.date);
              const isSelected = selectedExam?.id === exam.id;
              return (
                <motion.button
                  key={exam.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2, scale: 1.01, boxShadow: "0 12px 32px rgba(0,0,0,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedExam(isSelected ? null : exam)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all ${
                    isSelected
                      ? "border-[var(--accent-blue)] bg-white shadow-[0_8px_24px_rgba(90,112,243,0.1)]"
                      : "border-white/80 bg-white/60 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-[15px]">{exam.name}</p>
                      <p className="text-[11px] font-medium text-[var(--text-secondary)] mt-1 uppercase tracking-wider">
                        {exam.subject} <span className="opacity-50 mx-1">•</span> {new Date(exam.date).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className={`text-3xl font-bold tracking-tight ${d <= 14 ? "text-amber-500" : "text-[var(--accent-blue)]"}`}>{d}</p>
                      <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--text-secondary)]">days</p>
                    </div>
                  </div>
                  {d <= 14 && (
                    <div className="mt-4 flex items-center gap-2 bg-amber-50/80 p-2.5 rounded-2xl border border-amber-100/50">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      <p className="text-[11px] font-medium text-amber-700">Pre-exam window · Check-ins increased</p>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Generated plan */}
        <AnimatePresence>
          {selectedExam && (
            <motion.div 
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.06)] border border-white"
            >
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="font-bold text-[var(--text-primary)] text-base">
                    {days}-Day Wellness Plan
                  </h2>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mt-1">Next 7 days shown</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {plan.map((entry, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`rounded-3xl p-4 border ${entry.alert ? "bg-red-50/50 border-red-100/80" : "bg-white/50 border-white/80"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-sm text-[var(--text-primary)]">{entry.day}</p>
                      {entry.alert && (
                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-red-100/80 text-red-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <AlertCircle size={12} strokeWidth={2.5} /> Pre-exam
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-[13px] text-[var(--text-primary)]">
                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-[var(--accent-blue)]">
                          <BookOpen size={14} />
                        </div>
                        <span className="font-medium">{entry.study}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-[var(--text-primary)]">
                        <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                          <Leaf size={14} />
                        </div>
                        <span className="font-medium">{entry.wellness}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-[var(--text-secondary)]">
                        <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                          <Moon size={14} />
                        </div>
                        <span className="font-medium">Sleep: {entry.sleepTarget}</span>
                      </div>
                      {entry.nunchCheck && (
                        <div className="flex items-center gap-3 text-[13px] text-[var(--text-primary)] mt-1">
                          <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                            <HeartHandshake size={14} />
                          </div>
                          <span className="font-medium">{entry.nunchCheck}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add exam modal */}
        <AnimatePresence>
          {addMode && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-4 sm:p-0"
            >
              <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white/90 backdrop-blur-2xl rounded-[40px] p-8 w-full max-w-md shadow-2xl border border-white/50"
              >
                <h2 className="font-bold text-[var(--text-primary)] text-xl mb-6">Add Exam</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 block">Exam Name</label>
                    <input
                      value={newExam.name}
                      onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                      placeholder="e.g. 수능 Mock, Math Final..."
                      className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 block">Subject</label>
                    <input
                      value={newExam.subject}
                      onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                      placeholder="e.g. Mathematics, All subjects"
                      className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2 block">Exam Date</label>
                    <input
                      type="date"
                      value={newExam.date}
                      onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                      className="w-full bg-white/50 border border-white/80 rounded-2xl px-4 py-3.5 text-sm outline-none focus:border-[var(--accent-blue)] focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addExam}
                    disabled={!newExam.name || !newExam.date}
                    className="flex-1 bg-[var(--accent-blue)] text-white py-4 rounded-2xl font-bold text-sm shadow-[0_8px_24px_rgba(90,112,243,0.3)] disabled:opacity-40 disabled:shadow-none transition-all"
                  >
                    Add to Planner
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAddMode(false)}
                    className="flex-1 bg-white border border-gray-200 text-[var(--text-primary)] py-4 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </InteractiveGridBox>
  );
}
