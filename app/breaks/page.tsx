"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  StretchHorizontal,
  PersonStanding,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  Timer,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────
// Types aligned with Prisma BreakType enum
// ─────────────────────────────────────────
type BreakType = "EYE_GYMNASTICS" | "MICRO_STRETCH" | "POSTURE_CHECK";

type BreakStep = {
  title: string;
  instruction: string;
  durationSec: number;
  icon?: React.ReactNode;
};

type BreakConfig = {
  id: BreakType;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  textColor: string;
  glow: string;
  totalDuration: string;
  steps: BreakStep[];
};

// ─────────────────────────────────────────
// Break definitions
// ─────────────────────────────────────────
const BREAKS: BreakConfig[] = [
  {
    id: "EYE_GYMNASTICS",
    label: "Eye Gymnastics",
    desc: "Relieve digital eye strain with guided eye movements",
    icon: Eye,
    color: "#dbeafe",
    textColor: "#1e40af",
    glow: "rgba(59, 130, 246, 0.15)",
    totalDuration: "~2 min",
    steps: [
      {
        title: "Close & Rest",
        instruction: "Close your eyes gently. Feel the darkness. Let your eye muscles relax completely.",
        durationSec: 10,
      },
      {
        title: "Look Up & Down",
        instruction: "Open your eyes. Slowly look up to the ceiling, then down to the floor. Repeat slowly.",
        durationSec: 15,
      },
      {
        title: "Look Left & Right",
        instruction: "Keep your head still. Move only your eyes — far left, then far right. Slowly, gently.",
        durationSec: 15,
      },
      {
        title: "Circle Clockwise",
        instruction: "Trace a large circle with your eyes, going clockwise. Smooth and slow — no rush.",
        durationSec: 15,
      },
      {
        title: "Circle Counter-clockwise",
        instruction: "Now reverse. Counter-clockwise circles. Follow the edges of your vision.",
        durationSec: 15,
      },
      {
        title: "Near & Far Focus",
        instruction: "Hold your thumb 15cm from your face. Focus on it, then shift focus to something far away. Alternate.",
        durationSec: 20,
      },
      {
        title: "Palm Rest",
        instruction: "Cup your palms over your closed eyes. No light. Just warmth. Breathe deeply.",
        durationSec: 15,
      },
      {
        title: "Blink Rapidly",
        instruction: "Blink quickly 20 times to re-lubricate your eyes. Then close them and rest.",
        durationSec: 10,
      },
    ],
  },
  {
    id: "MICRO_STRETCH",
    label: "Micro Stretch",
    desc: "Quick desk-friendly stretches for your neck, shoulders, and wrists",
    icon: StretchHorizontal,
    color: "#d1fae5",
    textColor: "#065f46",
    glow: "rgba(16, 185, 129, 0.15)",
    totalDuration: "~3 min",
    steps: [
      {
        title: "Neck Roll — Right",
        instruction: "Drop your right ear to your right shoulder. Hold. Feel the stretch on the left side of your neck.",
        durationSec: 15,
      },
      {
        title: "Neck Roll — Left",
        instruction: "Now drop your left ear to your left shoulder. Hold gently. Don't force it.",
        durationSec: 15,
      },
      {
        title: "Chin Tuck",
        instruction: "Pull your chin straight back, making a double chin. Hold. This resets your neck alignment.",
        durationSec: 12,
      },
      {
        title: "Shoulder Shrug",
        instruction: "Raise both shoulders to your ears. Hold for 3 seconds. Drop them completely. Repeat 5 times.",
        durationSec: 20,
      },
      {
        title: "Chest Opener",
        instruction: "Clasp your hands behind your back. Lift your chest, squeeze shoulder blades together. Breathe deeply.",
        durationSec: 15,
      },
      {
        title: "Wrist Circles",
        instruction: "Extend your arms. Make slow circles with your wrists — 10 clockwise, then 10 counter-clockwise.",
        durationSec: 20,
      },
      {
        title: "Finger Spread",
        instruction: "Spread your fingers as wide as possible. Hold 5 seconds. Make a tight fist. Hold 5 seconds. Repeat.",
        durationSec: 15,
      },
      {
        title: "Seated Twist",
        instruction: "Sit up tall. Place your right hand on your left knee. Gently twist left. Hold. Breathe. Switch sides.",
        durationSec: 20,
      },
      {
        title: "Forward Fold",
        instruction: "Let your upper body hang forward over your knees. Arms dangle. Let gravity do the work.",
        durationSec: 15,
      },
    ],
  },
  {
    id: "POSTURE_CHECK",
    label: "Posture Check",
    desc: "Reset your body position and build awareness of how you sit",
    icon: PersonStanding,
    color: "#fef3c7",
    textColor: "#92400e",
    glow: "rgba(245, 158, 11, 0.15)",
    totalDuration: "~1.5 min",
    steps: [
      {
        title: "Feet Flat",
        instruction: "Place both feet flat on the floor, hip-width apart. Feel the ground beneath you.",
        durationSec: 8,
      },
      {
        title: "Sit Back",
        instruction: "Push your hips all the way to the back of your chair. Let the chair support your lower back.",
        durationSec: 8,
      },
      {
        title: "Stack Your Spine",
        instruction: "Imagine a string pulling the top of your head toward the ceiling. Lengthen your spine upward.",
        durationSec: 10,
      },
      {
        title: "Relax Shoulders",
        instruction: "Drop your shoulders away from your ears. Let them settle naturally. Release any tension.",
        durationSec: 8,
      },
      {
        title: "Screen Position",
        instruction: "Your screen should be at eye level. If it's too low, stack some books under your laptop.",
        durationSec: 10,
      },
      {
        title: "Arm Position",
        instruction: "Your elbows should be at 90° angles. Wrists neutral, not bent up or down on the keyboard.",
        durationSec: 10,
      },
      {
        title: "Full Body Scan",
        instruction: "Close your eyes. Scan from feet to head. Where is there tension? Breathe into that spot.",
        durationSec: 15,
      },
      {
        title: "Set an Intention",
        instruction: "Before you go back, set one intention: 'I will check my posture again in 40 minutes.'",
        durationSec: 8,
      },
    ],
  },
];

// ─────────────────────────────────────────
// Component
// ─────────────────────────────────────────

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function BreaksPage() {
  const [selectedBreak, setSelectedBreak] = useState<BreakType | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const breakConfig = BREAKS.find((b) => b.id === selectedBreak);

  // Timer logic
  useEffect(() => {
    if (!isRunning || !breakConfig) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next step
          const nextStep = currentStep + 1;
          if (nextStep >= breakConfig.steps.length) {
            setIsRunning(false);
            setCompleted(true);
            return 0;
          }
          setCurrentStep(nextStep);
          return breakConfig.steps[nextStep].durationSec;
        }
        return prev - 1;
      });
      setTotalElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, currentStep, breakConfig]);

  const startBreak = useCallback((breakId: BreakType) => {
    const config = BREAKS.find((b) => b.id === breakId)!;
    setSelectedBreak(breakId);
    setCurrentStep(0);
    setTimeLeft(config.steps[0].durationSec);
    setIsRunning(true);
    setCompleted(false);
    setTotalElapsed(0);
  }, []);

  const togglePause = () => setIsRunning(!isRunning);

  const resetBreak = () => {
    setSelectedBreak(null);
    setCurrentStep(0);
    setIsRunning(false);
    setTimeLeft(0);
    setCompleted(false);
    setTotalElapsed(0);
  };

  const stepProgress = breakConfig
    ? ((breakConfig.steps[currentStep]?.durationSec - timeLeft) / breakConfig.steps[currentStep]?.durationSec) * 100
    : 0;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-700"
      style={{ backgroundColor: breakConfig?.color ?? "var(--bg-primary)" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 bg-white/20 backdrop-blur-md border-b border-white/30 z-20"
      >
        <button
          onClick={resetBreak}
          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1.5"
          style={{ color: breakConfig?.textColor ?? "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} />
          {selectedBreak ? "Back" : ""}
        </button>
        <div className="text-center">
          <p
            className="text-sm font-bold"
            style={{ color: breakConfig?.textColor ?? "var(--text-primary)" }}
          >
            {breakConfig?.label ?? "Health Breaks"}
          </p>
          {isRunning && (
            <p
              className="text-xs opacity-60 mt-0.5"
              style={{ color: breakConfig?.textColor }}
            >
              Step {currentStep + 1} of {breakConfig?.steps.length}
            </p>
          )}
        </div>
        <div className="w-16" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <AnimatePresence mode="wait">
          {/* ── SELECTION SCREEN ── */}
          {!selectedBreak && (
            <motion.div
              key="select"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md flex flex-col gap-6"
            >
              {/* Intro */}
              <div className="text-center mb-4">
                <h1
                  className="text-2xl font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Take a break
                </h1>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Quick guided exercises for your eyes, body, and posture.
                  <br />
                  Your screen will wait.
                </p>
              </div>

              {/* Break Cards */}
              {BREAKS.map((brk, i) => {
                const Icon = brk.icon;
                return (
                  <motion.button
                    key={brk.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                    onClick={() => startBreak(brk.id)}
                    className="group relative w-full flex items-center gap-5 p-6 rounded-[32px] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] bg-white/50 backdrop-blur-xl text-left"
                    style={{
                      borderColor: "rgba(255,255,255,0.6)",
                      boxShadow: `0 8px 32px rgba(0,0,0,0.04), inset 0 1px 2px rgba(255,255,255,0.8)`,
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-[20px] flex items-center justify-center transition-colors duration-300 border shadow-sm shrink-0"
                      style={{
                        backgroundColor: brk.color,
                        borderColor: "rgba(255,255,255,0.5)",
                      }}
                    >
                      <Icon size={28} style={{ color: brk.textColor }} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-base font-bold tracking-tight mb-0.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {brk.label}
                      </p>
                      <p
                        className="text-xs font-medium leading-relaxed"
                        style={{ color: "var(--text-secondary)", opacity: 0.8 }}
                      >
                        {brk.desc}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: brk.glow, color: brk.textColor }}
                        >
                          <Timer size={10} className="inline mr-1" />
                          {brk.totalDuration}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: brk.glow, color: brk.textColor }}
                        >
                          {brk.steps.length} steps
                        </span>
                      </div>
                    </div>
                    <ChevronRight
                      size={20}
                      className="opacity-30 group-hover:opacity-70 transition-opacity shrink-0"
                      style={{ color: brk.textColor }}
                    />
                  </motion.button>
                );
              })}

              {/* Nuri hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-xs font-medium flex items-center justify-center gap-1.5"
                style={{ color: "var(--text-secondary)", opacity: 0.5 }}
              >
                <Sparkles size={12} /> Nuri recommends a break every 40 minutes of study
              </motion.p>
            </motion.div>
          )}

          {/* ── ACTIVE SESSION ── */}
          {selectedBreak && !completed && breakConfig && (
            <motion.div
              key="active"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md flex flex-col items-center"
            >
              {/* Overall progress bar */}
              <div className="w-full flex gap-1 mb-10">
                {breakConfig.steps.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-all duration-500 overflow-hidden"
                    style={{
                      background:
                        i < currentStep
                          ? breakConfig.textColor
                          : i === currentStep
                          ? "rgba(255,255,255,0.5)"
                          : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {i === currentStep && (
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: breakConfig.textColor }}
                        animate={{ width: `${stepProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Central circle with timer */}
              <motion.div
                animate={{
                  scale: isRunning ? [1, 1.03, 1] : 1,
                }}
                transition={{
                  repeat: isRunning ? Infinity : 0,
                  duration: 3,
                  ease: "easeInOut",
                }}
                className="relative w-52 h-52 rounded-full flex flex-col items-center justify-center mb-10"
                style={{
                  backgroundColor: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 0 ${isRunning ? "40px" : "20px"} ${breakConfig.glow}`,
                }}
              >
                {/* SVG progress ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="104"
                    cy="104"
                    r="100"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="104"
                    cy="104"
                    r="100"
                    fill="none"
                    stroke={breakConfig.textColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 100}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 100 * (1 - stepProgress / 100),
                    }}
                    transition={{ duration: 0.5, ease: "linear" }}
                  />
                </svg>

                <p
                  className="text-5xl font-bold tabular-nums mb-1"
                  style={{ color: breakConfig.textColor }}
                >
                  {timeLeft}
                </p>
                <p
                  className="text-xs font-semibold uppercase tracking-widest opacity-60"
                  style={{ color: breakConfig.textColor }}
                >
                  seconds
                </p>
              </motion.div>

              {/* Step info card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="w-full bg-white/50 backdrop-blur-md border border-white/40 rounded-[28px] p-6 mb-8 text-center"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.04)" }}
                >
                  <p
                    className="text-lg font-bold mb-2"
                    style={{ color: breakConfig.textColor }}
                  >
                    {breakConfig.steps[currentStep].title}
                  </p>
                  <p
                    className="text-sm font-medium leading-relaxed"
                    style={{ color: breakConfig.textColor, opacity: 0.8 }}
                  >
                    {breakConfig.steps[currentStep].instruction}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={resetBreak}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/30 border border-white/40 hover:bg-white/50 transition-colors"
                  style={{ color: breakConfig.textColor }}
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={togglePause}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95"
                  style={{ backgroundColor: breakConfig.textColor }}
                >
                  {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                </button>
                <button
                  onClick={() => {
                    // Skip to next step
                    const next = currentStep + 1;
                    if (next >= breakConfig.steps.length) {
                      setIsRunning(false);
                      setCompleted(true);
                    } else {
                      setCurrentStep(next);
                      setTimeLeft(breakConfig.steps[next].durationSec);
                    }
                  }}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/30 border border-white/40 hover:bg-white/50 transition-colors"
                  style={{ color: breakConfig.textColor }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── COMPLETED ── */}
          {completed && breakConfig && (
            <motion.div
              key="complete"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                <CheckCircle2 size={48} style={{ color: breakConfig.textColor }} strokeWidth={1.5} />
              </motion.div>

              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: breakConfig.textColor }}
              >
                Break complete
              </h2>
              <p
                className="text-sm font-medium mb-2 opacity-80"
                style={{ color: breakConfig.textColor }}
              >
                You took {totalElapsed} seconds for yourself. That matters.
              </p>
              <p
                className="text-xs font-medium mb-10 opacity-50"
                style={{ color: breakConfig.textColor }}
              >
                {breakConfig.steps.length} exercises completed
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={resetBreak}
                  className="flex-1 py-4 rounded-3xl text-sm font-semibold text-white shadow-lg active:scale-[0.98] transition-transform"
                  style={{ backgroundColor: breakConfig.textColor }}
                >
                  Back to breaks
                </button>
                <Link
                  href="/therapy"
                  className="flex-1 py-4 rounded-3xl text-center text-sm font-semibold bg-white/50 border border-white/60 active:scale-[0.98] transition-transform"
                  style={{ color: breakConfig.textColor }}
                >
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
