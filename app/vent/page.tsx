"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Trash2, Send, Sparkles, ArrowLeft, ShieldCheck,
  Heart, CloudRain, Flame, BookOpen, Users, HelpCircle
} from "lucide-react";
import Link from "next/link";

// Matches Prisma VentEntry.emotionalCategory
const CATEGORIES = [
  { id: "academic_pressure", label: "Academic Pressure", icon: BookOpen, color: "#3b82f6" },
  { id: "social_tension", label: "Social Tension", icon: Users, color: "#8b5cf6" },
  { id: "family_stress", label: "Family Stress", icon: Heart, color: "#ef4444" },
  { id: "self_doubt", label: "Self Doubt", icon: CloudRain, color: "#6b7280" },
  { id: "burnout", label: "Burnout", icon: Flame, color: "#f59e0b" },
  { id: "unknown", label: "I don't know", icon: HelpCircle, color: "#94a3b8" },
];

type VentRecord = {
  id: string;
  preview: string; // first 40 chars only — content itself is "encrypted"
  emotionalCategory: string;
  sentimentScore: number;
  createdAt: Date;
};

// Simple client-side sentiment heuristic (placeholder for real AI)
function analyzeSentiment(text: string): number {
  const negWords = ["hate","angry","sad","tired","stressed","anxious","scared","hopeless","fail","alone","hurt","worthless","can't","never"];
  const posWords = ["hope","better","okay","good","try","love","grateful","happy","calm","strong","proud"];
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  words.forEach(w => {
    if (negWords.some(n => w.includes(n))) score -= 0.1;
    if (posWords.some(p => w.includes(p))) score += 0.1;
  });
  return Math.max(-1, Math.min(1, score));
}

function sentimentLabel(score: number) {
  if (score <= -0.3) return { text: "Heavy", color: "#ef4444" };
  if (score <= -0.1) return { text: "Tense", color: "#f59e0b" };
  if (score <= 0.1) return { text: "Neutral", color: "#6b7280" };
  if (score <= 0.3) return { text: "Hopeful", color: "#3b82f6" };
  return { text: "Positive", color: "#10b981" };
}

export default function VentPage() {
  const [step, setStep] = useState<"write" | "categorize" | "done">("write");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [entries, setEntries] = useState<VentRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved entries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nunchi_vent_entries");
      if (saved) setEntries(JSON.parse(saved));
    } catch {}
  }, []);

  const saveEntry = () => {
    if (!text.trim() || !category) return;
    const sentiment = analyzeSentiment(text);
    const entry: VentRecord = {
      id: Date.now().toString(),
      preview: text.slice(0, 40) + (text.length > 40 ? "..." : ""),
      emotionalCategory: category,
      sentimentScore: sentiment,
      createdAt: new Date(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("nunchi_vent_entries", JSON.stringify(updated));
    setText("");
    setCategory(null);
    setStep("done");
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem("nunchi_vent_entries", JSON.stringify(updated));
  };

  const destroyAll = () => {
    setEntries([]);
    localStorage.removeItem("nunchi_vent_entries");
  };

  const resetToWrite = () => {
    setStep("write");
    setText("");
    setCategory(null);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-md border-b border-white/30 z-20 sticky top-0">
        <Link href="/" className="text-sm font-medium text-[var(--text-secondary)] opacity-60 hover:opacity-100 flex items-center gap-1.5">
          <ArrowLeft size={16} /> Back
        </Link>
        <p className="text-sm font-bold text-[var(--text-primary)]">Private Vent Space</p>
        <button onClick={() => setShowHistory(!showHistory)} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/50 border border-white/60 text-[var(--text-secondary)] hover:bg-white transition-colors">
          {showHistory ? "Write" : "History"}
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ── HISTORY VIEW ── */}
          {showHistory && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Your entries</h2>
                {entries.length > 0 && (
                  <button onClick={destroyAll} className="text-xs font-semibold text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors">
                    <Trash2 size={12} /> Destroy all
                  </button>
                )}
              </div>
              {entries.length === 0 ? (
                <div className="text-center py-16 text-sm text-[var(--text-secondary)] opacity-60">
                  <Lock size={32} className="mx-auto mb-3 opacity-30" />
                  <p>Nothing here. Your space is clean.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {entries.map(entry => {
                    const sl = sentimentLabel(entry.sentimentScore);
                    const cat = CATEGORIES.find(c => c.id === entry.emotionalCategory);
                    return (
                      <div key={entry.id} className="bg-white/60 backdrop-blur-md border border-white/50 rounded-[24px] p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {cat && <cat.icon size={14} style={{ color: cat.color }} />}
                            <span className="text-xs font-semibold" style={{ color: cat?.color ?? "#6b7280" }}>{cat?.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: sl.color + "15", color: sl.color }}>{sl.text}</span>
                            <button onClick={() => deleteEntry(entry.id)} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] italic">"{entry.preview}"</p>
                        <p className="text-[10px] text-[var(--text-secondary)] opacity-40 mt-2">
                          {new Date(entry.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── WRITE STEP ── */}
          {!showHistory && step === "write" && (
            <motion.div key="write" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-md">
              {/* Privacy badge */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <ShieldCheck size={16} className="text-emerald-500" />
                <p className="text-xs font-semibold text-emerald-600">End-to-end private · Never leaves your device</p>
              </div>

              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.06)]">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Write freely</h2>
                <p className="text-xs text-[var(--text-secondary)] mb-6">Messy thoughts, feelings, words that don't make sense yet. Nuri reads patterns only — never content.</p>

                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Anything on your mind..."
                  rows={8}
                  className="w-full bg-white/50 border border-white/60 rounded-[20px] p-4 text-sm text-[var(--text-primary)] placeholder-gray-300 outline-none resize-none focus:border-[#5a70f3]/30 focus:ring-2 focus:ring-[#5a70f3]/10 transition-all leading-relaxed"
                />

                <div className="flex items-center justify-between mt-4">
                  <p className="text-[10px] text-[var(--text-secondary)] opacity-40">{text.length} characters</p>
                  <button
                    disabled={text.trim().length < 10}
                    onClick={() => setStep("categorize")}
                    className="px-6 py-3 rounded-2xl text-sm font-semibold text-white disabled:opacity-30 active:scale-[0.98] transition-all flex items-center gap-2"
                    style={{ backgroundColor: "#5a70f3" }}
                  >
                    Continue <Send size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CATEGORIZE STEP ── */}
          {!showHistory && step === "categorize" && (
            <motion.div key="categorize" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-md">
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[32px] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.06)]">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">What's this about?</h2>
                <p className="text-xs text-[var(--text-secondary)] mb-6">This helps Nuri understand patterns across time — not judge individual entries.</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const selected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className="flex items-center gap-3 p-4 rounded-[20px] border text-left transition-all active:scale-[0.98]"
                        style={{
                          backgroundColor: selected ? cat.color + "10" : "rgba(255,255,255,0.5)",
                          borderColor: selected ? cat.color : "rgba(255,255,255,0.6)",
                          boxShadow: selected ? `0 4px 16px ${cat.color}20` : "none",
                        }}
                      >
                        <Icon size={18} style={{ color: cat.color }} />
                        <span className="text-xs font-semibold" style={{ color: selected ? cat.color : "var(--text-secondary)" }}>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("write")} className="flex-1 py-3 rounded-2xl text-sm font-semibold bg-white/50 border border-white/60 text-[var(--text-secondary)] active:scale-[0.98] transition-transform">Back</button>
                  <button
                    disabled={!category}
                    onClick={saveEntry}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white disabled:opacity-30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#5a70f3" }}
                  >
                    <Lock size={14} /> Save privately
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DONE STEP ── */}
          {!showHistory && step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-6"
              >
                <ShieldCheck size={36} className="text-emerald-500" />
              </motion.div>
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Saved privately</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-2">Nuri received the shape of what you wrote — not the words.</p>
              <p className="text-xs text-[var(--text-secondary)] opacity-50 mb-8">Only patterns are tracked. Content stays yours.</p>

              <div className="flex gap-3 w-full">
                <button onClick={resetToWrite} className="flex-1 py-4 rounded-3xl text-sm font-semibold text-white active:scale-[0.98] transition-transform" style={{ backgroundColor: "#5a70f3" }}>
                  Write more
                </button>
                <Link href="/therapy" className="flex-1 py-4 rounded-3xl text-center text-sm font-semibold bg-white/50 border border-white/60 text-[var(--text-secondary)] active:scale-[0.98] transition-transform">
                  Open soundscape
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
