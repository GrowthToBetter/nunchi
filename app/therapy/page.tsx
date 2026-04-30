"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Waves,
  BookOpen,
  Users,
  Palette,
  Zap,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sprout,
  Leaf,
  Flower2,
  TreePine,
  Sun,
  Moon,
  Star,
  Cloud,
  Sparkles,
  RotateCcw
} from "lucide-react";

type GameMode = "grounding" | "storytelling" | "social" | "release" | "focus";

const MODES: {
  id: GameMode;
  label: string;
  icon: React.ElementType;
  desc: string;
  color: string;
  freq: number;
  theory: string;
  textColor: string;
}[] = [
    {
      id: "grounding",
      label: "Grounding",
      icon: Waves,
      desc: "Breath-synced visuals · 4Hz theta · For when you feel trapped",
      color: "#dbeafe",
      textColor: "#1e40af",
      freq: 4,
      theory: "IMV Model — interrupts cognitive entrapment loop",
    },
    {
      id: "storytelling",
      label: "Storytelling",
      icon: BookOpen,
      desc: "Narrative distancing · 6Hz theta · For when you feel defeated",
      color: "#ede9fe",
      textColor: "#5b21b6",
      freq: 6,
      theory: "IMV pre-motivational phase — defeat processed via proxy",
    },
    {
      id: "social",
      label: "Social Silence",
      icon: Users,
      desc: "같이 있어줌 · 10Hz alpha · Belonging without disclosure",
      color: "#d1fae5",
      textColor: "#065f46",
      freq: 10,
      theory: "IPTS — thwarted belonging addressed through co-presence",
    },
    {
      id: "release",
      label: "Release",
      icon: Palette,
      desc: "Contribution canvas · 8Hz alpha · Draw for others",
      color: "#fef3c7",
      textColor: "#92400e",
      freq: 8,
      theory: "IPTS — burdensomeness inverted: user becomes giver",
    },
    {
      id: "focus",
      label: "Focus",
      icon: Zap,
      desc: "Gentle puzzles · 40Hz gamma · For neutral/focused states",
      color: "#f0fdf4",
      textColor: "#14532d",
      freq: 40,
      theory: "General — gamma waves support focused cognition",
    },
  ];

const FOCUS_ICONS = [Sprout, Leaf, Flower2, TreePine, Sun, Moon, Star, Cloud, Sparkles];

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } }
};

export default function TherapyPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode>("grounding");
  const [active, setActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [autoStarted, setAutoStarted] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [audioOn, setAudioOn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDrawing = useRef(false);

  const mode = MODES.find((m) => m.id === selectedMode)!;

  // Start binaural beat
  const startAudio = useCallback(() => {
    if (!mode) return;
    try {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const base = 200;
      const delta = mode.freq;

      const leftOsc = ctx.createOscillator();
      const rightOsc = ctx.createOscillator();
      const merger = ctx.createChannelMerger(2);
      const gainNode = ctx.createGain();

      leftOsc.frequency.value = base;
      rightOsc.frequency.value = base + delta;
      leftOsc.type = "sine";
      rightOsc.type = "sine";

      leftOsc.connect(merger, 0, 0);
      rightOsc.connect(merger, 0, 1);
      merger.connect(gainNode);
      gainNode.connect(ctx.destination);
      gainNode.gain.value = 0.08;

      leftOsc.start();
      rightOsc.start();
      setAudioOn(true);
    } catch {
      // Web Audio not available
    }
  }, [mode]);

  useEffect(() => {
    if (!autoStarted) {
      setAutoStarted(true);
      setTimeout(() => {
        setActive(true);
      }, 600);
    }
  }, [autoStarted]);

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
      setAudioOn(false);
    }
  };

  // Breath animation for grounding mode
  useEffect(() => {
    if (!active || selectedMode !== "grounding") return;
    const CYCLE = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 2000 },
      { phase: "exhale" as const, duration: 6000 },
    ];
    let idx = 0;
    const next = () => {
      setBreathPhase(CYCLE[idx].phase);
      breathTimerRef.current = setTimeout(() => {
        idx = (idx + 1) % CYCLE.length;
        if (idx === 0) setBreathCount((c) => c + 1);
        next();
      }, CYCLE[idx].duration);
    };
    next();
    return () => {
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, [active, selectedMode]);

  // Session timer
  useEffect(() => {
    if (!active) return;
    sessionTimerRef.current = setInterval(
      () => setSessionTime((t) => t + 1),
      1000
    );
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [active]);

  const startSession = () => {
    setActive(true);
    setSessionTime(0);
    setBreathCount(0);
    setStoryStep(0);
    startAudio();
  };

  const endSession = () => {
    setActive(false);
    stopAudio();
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Canvas drawing for release mode
  const startDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = `hsl(${(sessionTime * 2) % 360}, 60%, ${mode.color === "#fef3c7" ? "40%" : "60%"})`;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const STORIES = [
    "There was once a student who felt they were falling behind — not just in exams, but in life itself.",
    "Every morning, they would look in the mirror and see someone their parents had hoped for, not who they were.",
    "One evening, they found a quiet bench where no one could see them. And they let themselves feel everything.",
    "Slowly — not all at once — they discovered that being seen, even by yourself, is the beginning of something.",
    "The exam results came. Some were what they hoped. Some weren't. But the student had changed how they kept score.",
  ];

  const ModeIcon = mode.icon;

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: mode.color }}
    >
      {/* Header & Controls */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/20 backdrop-blur-md border-b border-white/30 z-20">
        <button
          onClick={endSession}
          className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
          style={{ color: mode.textColor }}
        >
          <Square size={14} /> End
        </button>
        <div className="text-center flex flex-col items-center">
          <div className="flex items-center gap-2">
            <ModeIcon size={16} style={{ color: mode.textColor }} />
            <p className="text-sm font-bold" style={{ color: mode.textColor }}>
              {mode.label}
            </p>
          </div>
          <AnimatePresence>
            {active && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 0.6, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs mt-0.5"
                style={{ color: mode.textColor }}
              >
                {formatTime(sessionTime)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={audioOn ? stopAudio : startAudio}
          className="text-xs p-2 rounded-full border opacity-60 hover:opacity-100 transition-all hover:bg-white/10"
          style={{ borderColor: mode.textColor, color: mode.textColor }}
        >
          {audioOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </header>

      {/* Mode Pill Selector */}
      <div className="w-full flex justify-center py-4 px-4 z-20">
        <div className="flex gap-2 p-1.5 rounded-full bg-white/30 backdrop-blur-md shadow-sm overflow-x-auto scrollbar-hide max-w-full">
          {MODES.map((m) => {
            const isSelected = selectedMood => selectedMode === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (active) endSession();
                  setSelectedMode(m.id); q
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300"
                style={{
                  background: selectedMode === m.id ? m.textColor : "transparent",
                  color: selectedMode === m.id ? m.color : m.textColor,
                  opacity: selectedMode === m.id ? 1 : 0.7,
                }}
              >
                <Icon size={14} /> {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          {!active ? (
            <motion.div
              key="intro"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-sm flex flex-col items-center text-center p-8 rounded-[40px] bg-white/30 backdrop-blur-lg border border-white/40 shadow-xl"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner"
                style={{ background: "rgba(255,255,255,0.5)" }}
              >
                <ModeIcon size={48} style={{ color: mode.textColor }} strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: mode.textColor }}>
                {mode.label}
              </h2>
              <p className="text-sm mb-2 opacity-80" style={{ color: mode.textColor }}>
                {mode.desc}
              </p>
              <p className="text-xs mb-8 italic opacity-60" style={{ color: mode.textColor }}>
                {mode.theory}
              </p>

              <div className="w-full space-y-3">
                {audioOn !== false && (
                  <p className="text-[11px] opacity-70 font-medium bg-white/40 py-2 px-3 rounded-xl inline-flex items-center justify-center gap-1.5" style={{ color: mode.textColor }}>
                    <Volume2 size={12} /> Use headphones for binaural beats ({mode.freq}Hz)
                  </p>
                )}
                <button
                  onClick={startSession}
                  className="w-full py-4 rounded-3xl font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ backgroundColor: mode.textColor }}
                >
                  <Play size={18} fill="currentColor" /> Begin Session
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-md flex flex-col items-center justify-center"
            >
              {/* Grounding Mode */}
              {selectedMode === "grounding" && (
                <div className="flex flex-col items-center gap-12">
                  <motion.div
                    animate={{
                      scale: breathPhase === "inhale" ? 1.5 : breathPhase === "hold" ? 1.5 : 0.8,
                      opacity: breathPhase === "hold" ? 0.9 : 0.6,
                    }}
                    transition={{
                      duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 2 : 6,
                      ease: "easeInOut"
                    }}
                    className="w-48 h-48 rounded-full border-[6px] flex items-center justify-center shadow-2xl backdrop-blur-sm"
                    style={{
                      borderColor: mode.textColor,
                      backgroundColor: "rgba(255,255,255,0.4)",
                    }}
                  >
                    <p
                      className="text-center font-bold capitalize text-lg tracking-widest"
                      style={{ color: mode.textColor }}
                    >
                      {breathPhase}
                      <br />
                      <span className="text-xs font-semibold opacity-60 tracking-normal">
                        {breathPhase === "inhale" ? "4s" : breathPhase === "hold" ? "2s" : "6s"}
                      </span>
                    </p>
                  </motion.div>
                  <p className="text-sm font-medium opacity-70 bg-white/30 px-4 py-2 rounded-full" style={{ color: mode.textColor }}>
                    {breathCount} breath cycles · Let your body lead
                  </p>
                </div>
              )}

              {/* Storytelling Mode */}
              {selectedMode === "storytelling" && (
                <div className="w-full text-center flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={storyStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6 }}
                      className="w-full bg-white/60 backdrop-blur-md border border-white/50 rounded-[32px] p-8 mb-8 shadow-lg"
                    >
                      <p className="text-lg leading-relaxed font-medium" style={{ color: mode.textColor }}>
                        {STORIES[storyStep]}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <button
                    onClick={() => setStoryStep((s) => Math.min(s + 1, STORIES.length - 1))}
                    disabled={storyStep >= STORIES.length - 1}
                    className="py-3 px-6 rounded-full text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    style={{
                      backgroundColor: mode.textColor,
                      color: mode.color
                    }}
                  >
                    {storyStep < STORIES.length - 1 ? "Continue the story →" : "The story continues in you."}
                  </button>
                </div>
              )}

              {/* Social Mode */}
              {selectedMode === "social" && (
                <div className="flex flex-col items-center gap-8">
                  <div className="relative w-64 h-48">
                    <motion.div
                      animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="absolute w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center bg-white/20 backdrop-blur-sm"
                      style={{ borderColor: mode.textColor, left: "5%", top: "15%" }}
                    >
                      <Users size={32} style={{ color: mode.textColor, opacity: 0.5 }} />
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                      className="absolute w-24 h-24 rounded-full border-[3px] flex items-center justify-center bg-white/30 backdrop-blur-md shadow-lg"
                      style={{ borderColor: mode.textColor, right: "5%", top: "35%" }}
                    >
                      <Users size={28} style={{ color: mode.textColor }} />
                    </motion.div>
                  </div>
                  <div className="text-center bg-white/40 px-6 py-4 rounded-3xl backdrop-blur-md">
                    <p className="font-bold text-lg" style={{ color: mode.textColor }}>같이 있어줌</p>
                    <p className="text-sm mt-1 font-medium opacity-80" style={{ color: mode.textColor }}>
                      Being present together
                    </p>
                    <p className="text-xs mt-2 opacity-60" style={{ color: mode.textColor }}>
                      Someone else is here right now.<br />Same soundscape. No words needed.
                    </p>
                  </div>
                </div>
              )}

              {/* Release Mode */}
              {selectedMode === "release" && (
                <div className="flex flex-col items-center gap-4 w-full">
                  <p className="text-sm font-medium opacity-80 text-center px-4" style={{ color: mode.textColor }}>
                    Draw something for someone else. It won't be saved.
                  </p>
                  <div className="p-2 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/50 shadow-xl w-full">
                    <canvas
                      ref={canvasRef}
                      id="therapy-canvas"
                      width={320}
                      height={320}
                      className="w-full h-auto rounded-[1.5rem] bg-white cursor-crosshair"
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                      onTouchStart={startDraw}
                      onTouchMove={draw}
                      onTouchEnd={endDraw}
                    />
                  </div>
                  <button
                    onClick={clearCanvas}
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white/50 hover:bg-white transition-colors"
                    style={{ color: mode.textColor }}
                  >
                    <RotateCcw size={14} /> Clear canvas
                  </button>
                </div>
              )}

              {/* Focus Mode */}
              {selectedMode === "focus" && (
                <div className="flex flex-col items-center gap-8 w-full">
                  <div className="grid grid-cols-3 gap-4 p-6 bg-white/30 backdrop-blur-md border border-white/50 rounded-[32px] shadow-lg">
                    {FOCUS_ICONS.map((Icon, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 rounded-[20px] bg-white/60 flex items-center justify-center cursor-pointer hover:bg-white transition-colors shadow-sm"
                      >
                        <Icon size={28} style={{ color: mode.textColor }} strokeWidth={1.5} />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-sm font-medium opacity-80 text-center bg-white/40 px-6 py-2 rounded-full" style={{ color: mode.textColor }}>
                    Gentle focus · You're doing well
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
