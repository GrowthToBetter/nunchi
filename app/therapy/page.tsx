"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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

const PhaseTimer = ({ duration, startTime }: { duration: number, startTime: number }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);
    }, 50);

    return () => clearInterval(interval);
  }, [duration, startTime]);

  return <span>{(timeLeft / 1000).toFixed(1)}</span>;
};

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

const STORIES = [
  "The exam results came. Some were what they hoped. Some weren't. But the student had changed how they kept score. Not by marks on paper but by how far they had come.",
  "She had planned to be productive. But the afternoon came and went, filled only with stillness. Later, she realized that stillness was exactly what she had needed all along.",
  "He took a step back. Not out of defeat but out of wisdom. Sometimes the clearest view comes not from moving forward, but from pausing to see where you already are.",
  "She wrote the letter and never sent it. Not because she had nothing to say but because writing it was enough. Some truths are meant for you, not for someone else.",
  "The week felt endless. Every day a little harder than the last. But Friday arrived as it always does. And in that small certainty, she found something worth holding on to.",
  "He had tried before and stumbled. This time, he began differently not with the desire to be perfect, but with the courage to simply begin. That was more than enough.",
  "In the waiting room, she noticed everyone around her each carrying something invisible. And for a moment, she felt less alone in what she was carrying too.",
  "The rain kept falling. She stopped trying to outrun it and stood still. Slowly, she realized she had been so afraid of being caught in the storm, she forgot she had survived every one before.",
  "He looked in the mirror not to find flaws, but to look for someone who had tried. And he found him. Tired, honest, still going. That was more than he had expected.",
  "She didn't finish everything on her list. She didn't solve every problem. But she showed up, and she was kind, and she kept breathing. Some days, that is everything."
];

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
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [hasCompletedStory, setHasCompletedStory] = useState(false);
  const [breathPhaseStartTime, setBreathPhaseStartTime] = useState(0);
  const [currentPhaseDuration, setCurrentPhaseDuration] = useState(4000);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDrawing = useRef(false);
  const storyAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasCompletedStory(localStorage.getItem("storyFinished") === "true");
    }
  }, []);

  const parsedStories = useMemo(() => {
    let totalChars = 0;
    const mapping = STORIES.map(story => {
      const words = story.split(' ');
      const mappedWords = words.map(word => {
        const start = totalChars;
        totalChars += word.length + 1;
        const end = totalChars - 1;
        return { text: word, start, end };
      });
      return { words: mappedWords };
    });
    return { mapping, totalChars };
  }, []);

  // Sync logic
  useEffect(() => {
    if (selectedMode !== "storytelling" || audioDuration === 0 || !active) return;
    const SYNC_OFFSET = 1.0; // Memajukan teks 1 detik agar tidak telat
    const effectiveTime = Math.min(audioTime + SYNC_OFFSET, audioDuration);
    const currentChars = (effectiveTime / audioDuration) * parsedStories.totalChars;
    
    let newStep = 0;
    for (let i = 0; i < parsedStories.mapping.length; i++) {
      const para = parsedStories.mapping[i];
      const lastWord = para.words[para.words.length - 1];
      if (currentChars <= lastWord.end) {
        newStep = i;
        break;
      }
      if (i === parsedStories.mapping.length - 1) newStep = i;
    }
    
    if (newStep !== storyStep) {
      setStoryStep(newStep);
    }
  }, [audioTime, audioDuration, active, selectedMode, storyStep, parsedStories]);

  const mode = MODES.find((m) => m.id === selectedMode)!;

  // Start binaural beat
  const startAudio = useCallback(() => {
    if (!mode) return;
    setAudioOn(true);
    if (mode.id === "storytelling") {
      if (storyAudioRef.current) {
        storyAudioRef.current.play().catch(() => {});
      }
      return;
    }
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
    setAudioOn(false);
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (storyAudioRef.current) {
      storyAudioRef.current.pause();
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
    let isMounted = true;
    const next = () => {
      if (!isMounted) return;
      setBreathPhase(CYCLE[idx].phase);
      setBreathPhaseStartTime(Date.now());
      setCurrentPhaseDuration(CYCLE[idx].duration);
      breathTimerRef.current = setTimeout(() => {
        idx = (idx + 1) % CYCLE.length;
        if (idx === 0) setBreathCount((c) => c + 1);
        next();
      }, CYCLE[idx].duration);
    };
    next();
    return () => {
      isMounted = false;
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
    setAudioTime(0);
    startAudio();
    if (selectedMode === "storytelling" && storyAudioRef.current) {
      storyAudioRef.current.currentTime = 0;
      storyAudioRef.current.play().catch(() => {});
    }
  };

  const endSession = () => {
    setActive(false);
    stopAudio();
    if (storyAudioRef.current) {
      storyAudioRef.current.pause();
      storyAudioRef.current.currentTime = 0;
    }
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
            const isSelected = () => selectedMode === m.id;
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (active) endSession();
                  setSelectedMode(m.id);
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
                <div className="flex flex-col items-center gap-16 relative w-full h-[55vh] justify-center mt-4">
                  
                  {/* Expanding ripples during Exhale */}
                  <AnimatePresence>
                    {breathPhase === "exhale" && (
                      <motion.div
                        key={breathCount}
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 6, ease: "easeOut" }}
                        className="absolute w-56 h-56 rounded-full border border-white/40 pointer-events-none"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.div
                    animate={{
                      scale: breathPhase === "inhale" ? 1.3 : breathPhase === "hold" ? 1.3 : 0.9,
                      boxShadow: breathPhase === "inhale" 
                        ? "0 0 60px rgba(255,255,255,0.6)" 
                        : breathPhase === "hold" 
                        ? "0 0 80px rgba(255,255,255,0.8)" 
                        : "0 0 20px rgba(255,255,255,0.2)"
                    }}
                    transition={{
                      duration: breathPhase === "inhale" ? 4 : breathPhase === "hold" ? 2 : 6,
                      ease: "easeInOut"
                    }}
                    className="relative w-56 h-56 rounded-full flex flex-col items-center justify-center backdrop-blur-md"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      border: "1px solid rgba(255,255,255,0.5)"
                    }}
                  >
                    {/* SVG Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-md">
                       <motion.circle
                          key={breathPhaseStartTime}
                          cx="112"
                          cy="112"
                          r="108"
                          fill="none"
                          stroke={mode.textColor}
                          strokeWidth="5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: currentPhaseDuration / 1000, ease: "linear" }}
                       />
                    </svg>

                    <AnimatePresence>
                      <motion.div
                        key={breathPhase}
                        initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
                        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                        exit={{ opacity: 0, filter: "blur(4px)", scale: 1.1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="absolute flex flex-col items-center z-10"
                      >
                        <p
                          className="text-center font-black uppercase text-2xl tracking-[0.2em]"
                          style={{ color: mode.textColor }}
                        >
                          {breathPhase}
                        </p>
                        <p 
                          className="text-sm font-semibold opacity-80 mt-1 bg-white/50 px-4 py-1.5 rounded-full shadow-inner backdrop-blur-sm border border-white/40 font-mono w-[5.5rem] text-center tracking-wider"
                          style={{ color: mode.textColor }}
                        >
                          <PhaseTimer duration={currentPhaseDuration} startTime={breathPhaseStartTime} />s
                        </p>
                      </motion.div>
                    </AnimatePresence>

                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="text-sm font-semibold opacity-90 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50 flex items-center gap-2" style={{ color: mode.textColor }}>
                      <span className="font-bold text-xl">{breathCount}</span> cycles completed
                    </p>
                    <p className="text-xs font-medium opacity-60" style={{ color: mode.textColor }}>
                      Let your body lead the rhythm
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Storytelling Mode */}
              {selectedMode === "storytelling" && (
                <div className="w-full text-center flex flex-col items-center relative">
                  <audio 
                    ref={storyAudioRef} 
                    src="/storytelling1.mp3" 
                    autoPlay
                    onTimeUpdate={(e) => setAudioTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setAudioDuration(e.currentTarget.duration)}
                    onEnded={() => {
                      setStoryStep(STORIES.length - 1);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("storyFinished", "true");
                        setHasCompletedStory(true);
                      }
                    }}
                  />

                  {/* Progress Indicator */}
                  {audioDuration > 0 && (
                    <div className="w-full max-w-md h-1.5 bg-white/30 rounded-full mb-6 overflow-hidden">
                      <div 
                        className="h-full bg-[#9333ea] transition-all duration-300"
                        style={{ width: `${(audioTime / audioDuration) * 100}%` }}
                      />
                    </div>
                  )}

                  {hasCompletedStory && (
                    <div className="mb-4 text-xs font-medium text-purple-700 bg-white/50 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Sparkles size={14} /> You have previously finished this story
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={storyStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6 }}
                      className="w-full bg-white/60 backdrop-blur-md border border-white/50 rounded-[32px] p-8 mb-8 shadow-lg relative"
                    >
                      {hasCompletedStory && audioTime < audioDuration && audioDuration > 0 && (
                        <button
                          onClick={() => {
                            if (storyAudioRef.current) {
                              storyAudioRef.current.currentTime = audioDuration;
                              storyAudioRef.current.pause();
                            }
                            setAudioTime(audioDuration);
                            setStoryStep(STORIES.length - 1);
                          }}
                          className="absolute top-4 right-4 py-1.5 px-4 rounded-full text-[11px] uppercase font-bold bg-purple-100/60 hover:bg-purple-200 text-purple-800 transition-colors shadow-sm"
                        >
                          Skip
                        </button>
                      )}
                      <p className="text-[20px] leading-relaxed font-medium transition-all duration-300">
                        {parsedStories.mapping[storyStep]?.words.map((wordObj, i) => {
                          const SYNC_OFFSET = 1.0;
                          const effectiveTime = Math.min(audioTime + SYNC_OFFSET, audioDuration);
                          const currentChars = audioDuration > 0 ? (effectiveTime / audioDuration) * parsedStories.totalChars : 0;
                          const isHighlighted = currentChars >= wordObj.start;
                          return (
                            <span 
                              key={i} 
                              className="transition-all duration-700 ease-out"
                              style={{ 
                                 color: isHighlighted ? "#9333ea" : mode.textColor, 
                                 opacity: isHighlighted ? 1 : 0.3,
                                 textShadow: isHighlighted ? "0 4px 12px rgba(147, 51, 234, 0.25)" : "none"
                              }}
                            >
                              {wordObj.text}{" "}
                            </span>
                          );
                        })}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {!audioDuration && (
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
                  )}

                  {audioTime >= audioDuration && audioDuration > 0 && (
                     <p className="text-sm font-semibold italic opacity-80 mt-2" style={{ color: mode.textColor }}>
                       The story continues in you.
                     </p>
                  )}
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
