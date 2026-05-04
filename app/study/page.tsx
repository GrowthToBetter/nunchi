"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Square, RotateCcw, Coffee, ArrowLeft,
  Brain, Timer, Repeat, CheckCircle2, Sparkles, ChevronRight
} from "lucide-react";
import Link from "next/link";

// Matches Prisma StudyMethod enum
type StudyMethod = "POMODORO" | "FEYNMAN" | "SPACED_REPETITION";
type SessionPhase = "focus" | "break" | "done";

type MethodConfig = {
  id: StudyMethod;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  focusMin: number;
  breakMin: number;
  rounds: number;
};

const METHODS: MethodConfig[] = [
  {
    id: "POMODORO",
    label: "Pomodoro",
    desc: "25 min focus · 5 min break · 4 rounds",
    icon: Timer,
    color: "#fef2f2",
    textColor: "#dc2626",
    focusMin: 25,
    breakMin: 5,
    rounds: 4,
  },
  {
    id: "FEYNMAN",
    label: "Feynman",
    desc: "30 min explain-to-learn · 10 min review",
    icon: Brain,
    color: "#eff6ff",
    textColor: "#2563eb",
    focusMin: 30,
    breakMin: 10,
    rounds: 2,
  },
  {
    id: "SPACED_REPETITION",
    label: "Spaced Repetition",
    desc: "20 min recall · 5 min gaps · 3 rounds",
    icon: Repeat,
    color: "#f0fdf4",
    textColor: "#16a34a",
    focusMin: 20,
    breakMin: 5,
    rounds: 3,
  },
];

const MOODS = ["😌 Calm", "😐 Okay", "😰 Stressed", "😔 Low", "⚡ Focused"];

export default function StudyPage() {
  const [method, setMethod] = useState<StudyMethod | null>(null);
  const [subject, setSubject] = useState("");
  const [phase, setPhase] = useState<SessionPhase>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [round, setRound] = useState(1);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [totalFocusSec, setTotalFocusSec] = useState(0);
  const [moodStart, setMoodStart] = useState<string | null>(null);
  const [moodEnd, setMoodEnd] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "mood-start" | "active" | "mood-end" | "summary">("select");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const config = METHODS.find(m => m.id === method);

  // Timer
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (phase === "focus") {
            if (config && round >= config.rounds) {
              setIsRunning(false);
              setStep("mood-end");
              return 0;
            }
            setPhase("break");
            setBreaksTaken(b => b + 1);
            return (config?.breakMin ?? 5) * 60;
          } else {
            setPhase("focus");
            setRound(r => r + 1);
            return (config?.focusMin ?? 25) * 60;
          }
        }
        if (phase === "focus") setTotalFocusSec(t => t + 1);
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, phase, round, config]);

  const startSession = useCallback(() => {
    if (!config) return;
    setTimeLeft(config.focusMin * 60);
    setPhase("focus");
    setRound(1);
    setBreaksTaken(0);
    setTotalFocusSec(0);
    setIsRunning(true);
    setStep("active");
  }, [config]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const totalDuration = config ? config.focusMin * 60 * config.rounds + config.breakMin * 60 * (config.rounds - 1) : 1;
  const currentPhaseDuration = phase === "focus" ? (config?.focusMin ?? 25) * 60 : (config?.breakMin ?? 5) * 60;
  const progress = ((currentPhaseDuration - timeLeft) / currentPhaseDuration) * 100;

  const bgColor = config ? (phase === "break" ? "#fefce8" : config.color) : "var(--bg-primary)";
  const txtColor = config ? (phase === "break" ? "#854d0e" : config.textColor) : "var(--text-primary)";

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-700" style={{ backgroundColor: bgColor }}>
      <header className="flex items-center justify-between px-6 py-4 bg-white/20 backdrop-blur-md border-b border-white/30 z-20">
        <Link href="/planner" className="text-sm font-medium opacity-60 hover:opacity-100 flex items-center gap-1.5" style={{ color: txtColor }}>
          <ArrowLeft size={16} /> Planner
        </Link>
        <p className="text-sm font-bold" style={{ color: txtColor }}>{config?.label ?? "Study Session"}</p>
        <div className="w-16" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <AnimatePresence mode="wait">
          {/* ── METHOD SELECT ── */}
          {step === "select" && (
            <motion.div key="select" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-md">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>Start a study session</h1>
                <p className="text-sm text-[var(--text-secondary)]">Pick a method that matches your energy today.</p>
              </div>

              <div className="mb-6">
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="What subject? (optional)"
                  className="w-full bg-white/50 border border-white/60 rounded-2xl px-5 py-3.5 text-sm text-[var(--text-primary)] placeholder-gray-300 outline-none focus:border-[#5a70f3]/30 focus:ring-2 focus:ring-[#5a70f3]/10 transition-all backdrop-blur-md"
                />
              </div>

              <div className="flex flex-col gap-4">
                {METHODS.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <motion.button
                      key={m.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => { setMethod(m.id); setStep("mood-start"); }}
                      className="group w-full flex items-center gap-5 p-5 rounded-[28px] border bg-white/50 backdrop-blur-xl text-left transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                      style={{ borderColor: "rgba(255,255,255,0.6)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}
                    >
                      <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0" style={{ backgroundColor: m.color }}>
                        <Icon size={24} style={{ color: m.textColor }} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{m.label}</p>
                        <p className="text-xs text-[var(--text-secondary)] opacity-70 mt-0.5">{m.desc}</p>
                      </div>
                      <ChevronRight size={18} className="opacity-30 group-hover:opacity-70" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── MOOD START ── */}
          {step === "mood-start" && (
            <motion.div key="mood-s" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-md text-center">
              <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 shadow-lg">
                <h2 className="text-xl font-bold mb-2" style={{ color: txtColor }}>How are you feeling right now?</h2>
                <p className="text-xs text-[var(--text-secondary)] mb-6">Before we start — just a quick check.</p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setMoodStart(m)}
                      className="px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all active:scale-95"
                      style={{
                        backgroundColor: moodStart === m ? txtColor + "15" : "rgba(255,255,255,0.5)",
                        borderColor: moodStart === m ? txtColor : "rgba(255,255,255,0.6)",
                        color: moodStart === m ? txtColor : "var(--text-secondary)",
                      }}
                    >{m}</button>
                  ))}
                </div>
                <button disabled={!moodStart} onClick={startSession}
                  className="w-full py-4 rounded-3xl text-sm font-semibold text-white disabled:opacity-30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: txtColor }}
                >
                  <Play size={16} fill="currentColor" /> Start {config?.label}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── ACTIVE SESSION ── */}
          {step === "active" && config && (
            <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-md flex flex-col items-center">
              {/* Phase badge */}
              <div className="flex items-center gap-2 mb-8">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.5)", color: txtColor }}>
                  {phase === "focus" ? `Focus · Round ${round}/${config.rounds}` : "Break time"}
                </span>
                {phase === "break" && <Coffee size={16} style={{ color: txtColor }} />}
              </div>

              {/* Timer circle */}
              <motion.div
                animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
                transition={{ repeat: isRunning ? Infinity : 0, duration: 4 }}
                className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center mb-10"
                style={{ backgroundColor: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.5)", backdropFilter: "blur(16px)" }}
              >
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="112" cy="112" r="106" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
                  <circle cx="112" cy="112" r="106" fill="none" stroke={txtColor} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 106}
                    strokeDashoffset={2 * Math.PI * 106 * (1 - progress / 100)}
                    style={{ transition: "stroke-dashoffset 0.5s linear" }}
                  />
                </svg>
                <p className="text-5xl font-bold tabular-nums" style={{ color: txtColor }}>{fmt(timeLeft)}</p>
                <p className="text-xs font-medium opacity-50 mt-1" style={{ color: txtColor }}>{subject || config.label}</p>
              </motion.div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button onClick={() => { setIsRunning(false); setStep("mood-end"); }}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/30 border border-white/40 hover:bg-white/50 transition"
                  style={{ color: txtColor }}><Square size={16} /></button>
                <button onClick={() => setIsRunning(!isRunning)}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition"
                  style={{ backgroundColor: txtColor }}>
                  {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                </button>
                <button onClick={() => { setTimeLeft(phase === "focus" ? config.focusMin * 60 : config.breakMin * 60); }}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/30 border border-white/40 hover:bg-white/50 transition"
                  style={{ color: txtColor }}><RotateCcw size={16} /></button>
              </div>

              {/* Stats bar */}
              <div className="flex items-center gap-6 mt-8 text-xs font-medium" style={{ color: txtColor, opacity: 0.7 }}>
                <span>⏱ {fmt(totalFocusSec)} focused</span>
                <span>☕ {breaksTaken} breaks</span>
              </div>
            </motion.div>
          )}

          {/* ── MOOD END ── */}
          {step === "mood-end" && (
            <motion.div key="mood-e" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full max-w-md text-center">
              <div className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 shadow-lg">
                <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>How do you feel now?</h2>
                <p className="text-xs text-[var(--text-secondary)] mb-6">After {fmt(totalFocusSec)} of focus time.</p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {MOODS.map(m => (
                    <button key={m} onClick={() => setMoodEnd(m)}
                      className="px-4 py-2.5 rounded-2xl text-sm font-medium border transition-all active:scale-95"
                      style={{
                        backgroundColor: moodEnd === m ? "#5a70f3" + "15" : "rgba(255,255,255,0.5)",
                        borderColor: moodEnd === m ? "#5a70f3" : "rgba(255,255,255,0.6)",
                        color: moodEnd === m ? "#5a70f3" : "var(--text-secondary)",
                      }}
                    >{m}</button>
                  ))}
                </div>
                <button disabled={!moodEnd} onClick={() => setStep("summary")}
                  className="w-full py-4 rounded-3xl text-sm font-semibold text-white disabled:opacity-30 active:scale-[0.98]"
                  style={{ backgroundColor: "#5a70f3" }}>
                  See summary
                </button>
              </div>
            </motion.div>
          )}

          {/* ── SUMMARY ── */}
          {step === "summary" && config && (
            <motion.div key="summary" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-md">
              <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[32px] p-8 shadow-lg text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                  className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={36} className="text-emerald-500" />
                </motion.div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">Session complete</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-6">{subject || config.label}</p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Focus", value: fmt(totalFocusSec) },
                    { label: "Rounds", value: `${round}/${config.rounds}` },
                    { label: "Breaks", value: breaksTaken.toString() },
                  ].map(s => (
                    <div key={s.label} className="bg-white/50 rounded-2xl p-3 border border-white/60">
                      <p className="text-lg font-bold text-[var(--text-primary)]">{s.value}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] font-medium">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mb-6">
                  <div className="flex-1 bg-white/50 rounded-2xl p-3 border border-white/60 text-left">
                    <p className="text-[10px] text-[var(--text-secondary)] font-semibold mb-1">Before</p>
                    <p className="text-sm font-medium">{moodStart}</p>
                  </div>
                  <div className="flex-1 bg-white/50 rounded-2xl p-3 border border-white/60 text-left">
                    <p className="text-[10px] text-[var(--text-secondary)] font-semibold mb-1">After</p>
                    <p className="text-sm font-medium">{moodEnd}</p>
                  </div>
                </div>

                <div className="bg-[#5a70f3]/5 border border-[#5a70f3]/10 rounded-2xl p-4 mb-6 text-left">
                  <p className="text-xs font-semibold text-[#5a70f3] flex items-center gap-1 mb-1"><Sparkles size={12} /> Nuri says</p>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    {totalFocusSec > 1500
                      ? "Strong session. You showed up and stayed focused. That consistency builds more than any single exam score."
                      : "Even short sessions count. You started — and that takes more courage than most people realize."}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { setMethod(null); setStep("select"); setMoodStart(null); setMoodEnd(null); }}
                    className="flex-1 py-4 rounded-3xl text-sm font-semibold text-white active:scale-[0.98]" style={{ backgroundColor: "#5a70f3" }}>
                    New session
                  </button>
                  <Link href="/planner" className="flex-1 py-4 rounded-3xl text-center text-sm font-semibold bg-white/50 border border-white/60 text-[var(--text-secondary)] active:scale-[0.98]">
                    Back to planner
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
