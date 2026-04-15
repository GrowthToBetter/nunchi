"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

type GameMode = "grounding" | "storytelling" | "social" | "release" | "focus";

const MODES: {
  id: GameMode;
  label: string;
  emoji: string;
  desc: string;
  color: string;
  freq: number;
  theory: string;
  textColor: string;
}[] = [
  {
    id: "grounding",
    label: "Grounding",
    emoji: "🌊",
    desc: "Breath-synced visuals · 4Hz theta · For when you feel trapped",
    color: "#dbeafe",
    textColor: "#1e40af",
    freq: 4,
    theory: "IMV Model — interrupts cognitive entrapment loop",
  },
  {
    id: "storytelling",
    label: "Storytelling",
    emoji: "📖",
    desc: "Narrative distancing · 6Hz theta · For when you feel defeated",
    color: "#ede9fe",
    textColor: "#5b21b6",
    freq: 6,
    theory: "IMV pre-motivational phase — defeat processed via proxy",
  },
  {
    id: "social",
    label: "Social Silence",
    emoji: "🫂",
    desc: "같이 있어줌 · 10Hz alpha · Belonging without disclosure",
    color: "#d1fae5",
    textColor: "#065f46",
    freq: 10,
    theory: "IPTS — thwarted belonging addressed through co-presence",
  },
  {
    id: "release",
    label: "Release",
    emoji: "🎨",
    desc: "Contribution canvas · 8Hz alpha · Draw for others",
    color: "#fef3c7",
    textColor: "#92400e",
    freq: 8,
    theory: "IPTS — burdensomeness inverted: user becomes giver",
  },
  {
    id: "focus",
    label: "Focus",
    emoji: "⚡",
    desc: "Gentle puzzles · 40Hz gamma · For neutral/focused states",
    color: "#f0fdf4",
    textColor: "#14532d",
    freq: 40,
    theory: "General — gamma waves support focused cognition",
  },
];

export default function TherapyPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [active, setActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathCount, setBreathCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [drawMode, setDrawMode] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [audioOn, setAudioOn] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDrawing = useRef(false);

  const mode = MODES.find((m) => m.id === selectedMode);

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
    return () => { if (breathTimerRef.current) clearTimeout(breathTimerRef.current); };
  }, [active, selectedMode]);

  // Session timer
  useEffect(() => {
    if (!active) return;
    sessionTimerRef.current = setInterval(() => setSessionTime((t) => t + 1), 1000);
    return () => { if (sessionTimerRef.current) clearInterval(sessionTimerRef.current); };
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
    setDrawMode(false);
    stopAudio();
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Canvas drawing for release mode
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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
    ctx.strokeStyle = `hsl(${(sessionTime * 2) % 360}, 60%, 60%)`;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => { isDrawing.current = false; };

  const STORIES = [
    "There was once a student who felt they were falling behind — not just in exams, but in life itself.",
    "Every morning, they would look in the mirror and see someone their parents had hoped for, not who they were.",
    "One evening, they found a quiet bench where no one could see them. And they let themselves feel everything.",
    "Slowly — not all at once — they discovered that being seen, even by yourself, is the beginning of something.",
    "The exam results came. Some were what they hoped. Some weren't. But the student had changed how they kept score.",
  ];

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col">
        <header className="flex items-center gap-3 px-4 py-4 border-b border-sand-100 bg-white/80 backdrop-blur-sm">
          <Link href="/" className="text-sand-400 hover:text-sand-600 text-sm">←</Link>
          <div>
            <h1 className="font-bold text-[#1a1a2e] text-base">Therapy Space</h1>
            <p className="text-xs text-sand-400">Sound + visual therapy · 5–15 minutes</p>
          </div>
        </header>

        <div className="px-6 py-8 max-w-2xl mx-auto w-full">
          <p className="text-sand-500 text-sm mb-6 text-center">
            Each mode is grounded in psychological theory — selected based on how you feel right now. Choose what resonates.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className="flex items-start gap-4 p-5 rounded-2xl border-2 border-sand-100 bg-white text-left card-hover transition-all hover:border-nunchi-200"
                style={{ "--hover-bg": m.color } as React.CSSProperties}
              >
                <span className="text-3xl flex-shrink-0">{m.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#1a1a2e] text-sm">{m.label}</span>
                    <span className="text-xs text-sand-400 border border-sand-200 rounded-full px-2 py-0.5">
                      {m.freq}Hz
                    </span>
                  </div>
                  <p className="text-xs text-sand-500 leading-relaxed">{m.desc}</p>
                  <p className="text-xs text-sand-400 mt-1 italic">{m.theory}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: mode?.color }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/30 backdrop-blur-sm">
        <button
          onClick={() => { endSession(); setSelectedMode(null); }}
          className="text-sm font-medium"
          style={{ color: mode?.textColor }}
        >
          ← Exit
        </button>
        <div className="text-center">
          <p className="text-sm font-bold" style={{ color: mode?.textColor }}>
            {mode?.emoji} {mode?.label} Mode
          </p>
          {active && <p className="text-xs opacity-60" style={{ color: mode?.textColor }}>{formatTime(sessionTime)}</p>}
        </div>
        <button
          onClick={audioOn ? stopAudio : startAudio}
          className="text-xs border rounded-full px-3 py-1"
          style={{ borderColor: mode?.textColor, color: mode?.textColor }}
        >
          {audioOn ? "🔊 Sound" : "🔇 Muted"}
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {!active ? (
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-6">{mode?.emoji}</div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: mode?.textColor }}>{mode?.label}</h2>
            <p className="text-sm mb-2 opacity-70" style={{ color: mode?.textColor }}>{mode?.desc}</p>
            <p className="text-xs mb-8 italic opacity-50" style={{ color: mode?.textColor }}>{mode?.theory}</p>
            {audioOn !== false && (
              <p className="text-xs mb-4 opacity-50" style={{ color: mode?.textColor }}>
                🎧 Use headphones for binaural beat effect ({mode?.freq}Hz)
              </p>
            )}
            <button
              onClick={startSession}
              className="px-8 py-4 rounded-2xl font-semibold text-white shadow-lg"
              style={{ backgroundColor: mode?.textColor }}
            >
              Begin Session
            </button>
          </div>
        ) : (
          <>
            {/* Grounding Mode */}
            {selectedMode === "grounding" && (
              <div className="flex flex-col items-center gap-8">
                <div
                  className="w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-1000"
                  style={{
                    borderColor: mode?.textColor,
                    transform: breathPhase === "inhale" ? "scale(1.3)" : breathPhase === "hold" ? "scale(1.3)" : "scale(0.85)",
                    opacity: breathPhase === "hold" ? 0.9 : 0.7,
                    backgroundColor: mode?.color,
                  }}
                >
                  <p className="text-center font-medium capitalize text-sm" style={{ color: mode?.textColor }}>
                    {breathPhase}
                    <br />
                    <span className="text-xs opacity-60">
                      {breathPhase === "inhale" ? "4s" : breathPhase === "hold" ? "2s" : "6s"}
                    </span>
                  </p>
                </div>
                <p className="text-sm opacity-60" style={{ color: mode?.textColor }}>
                  {breathCount} breath cycles · Let your body lead
                </p>
              </div>
            )}

            {/* Storytelling Mode */}
            {selectedMode === "storytelling" && (
              <div className="max-w-md text-center">
                <div className="bg-white/60 rounded-3xl p-8 mb-6">
                  <p className="text-lg leading-relaxed font-light" style={{ color: mode?.textColor }}>
                    {STORIES[storyStep]}
                  </p>
                </div>
                <button
                  onClick={() => setStoryStep((s) => Math.min(s + 1, STORIES.length - 1))}
                  disabled={storyStep >= STORIES.length - 1}
                  className="text-sm font-medium opacity-70 hover:opacity-100 disabled:opacity-30"
                  style={{ color: mode?.textColor }}
                >
                  {storyStep < STORIES.length - 1 ? "Continue the story →" : "The story continues in you."}
                </button>
              </div>
            )}

            {/* Social Mode */}
            {selectedMode === "social" && (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-64 h-40">
                  <div
                    className="absolute w-24 h-24 rounded-full border-2 animate-float"
                    style={{ borderColor: mode?.textColor, left: "10%", top: "20%", animationDelay: "0s" }}
                  />
                  <div
                    className="absolute w-20 h-20 rounded-full border-2 animate-float"
                    style={{ borderColor: mode?.textColor, right: "10%", top: "30%", animationDelay: "1.5s" }}
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold" style={{ color: mode?.textColor }}>같이 있어줌</p>
                  <p className="text-xs mt-1 opacity-60" style={{ color: mode?.textColor }}>
                    Being present together · Someone else is here right now
                  </p>
                  <p className="text-xs mt-3 opacity-40" style={{ color: mode?.textColor }}>
                    Same soundscape · No words needed
                  </p>
                </div>
              </div>
            )}

            {/* Release Mode */}
            {selectedMode === "release" && (
              <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <p className="text-sm opacity-60 text-center" style={{ color: mode?.textColor }}>
                  Draw something for someone else. It won&apos;t be saved.
                </p>
                <canvas
                  ref={canvasRef}
                  id="therapy-canvas"
                  width={340}
                  height={240}
                  className="rounded-2xl bg-white/50"
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={endDraw}
                  onMouseLeave={endDraw}
                  onTouchStart={startDraw}
                  onTouchMove={draw}
                  onTouchEnd={endDraw}
                />
                <button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const ctx = canvas.getContext("2d");
                      ctx?.clearRect(0, 0, canvas.width, canvas.height);
                    }
                  }}
                  className="text-xs opacity-50 hover:opacity-80"
                  style={{ color: mode?.textColor }}
                >
                  Clear & start again
                </button>
              </div>
            )}

            {/* Focus Mode */}
            {selectedMode === "focus" && (
              <div className="flex flex-col items-center gap-6">
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-xl bg-white/50 flex items-center justify-center text-2xl cursor-pointer hover:bg-white/80 transition-all"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {["🌱", "🌿", "🍃", "🌾", "🌺", "🌸", "🌼", "🌻", "✨"][i]}
                    </div>
                  ))}
                </div>
                <p className="text-sm opacity-60 text-center" style={{ color: mode?.textColor }}>
                  Gentle focus · You&apos;re doing well
                </p>
              </div>
            )}

            {/* End session button */}
            <button
              onClick={endSession}
              className="mt-8 text-sm opacity-50 hover:opacity-80 underline"
              style={{ color: mode?.textColor }}
            >
              End session
            </button>
          </>
        )}
      </div>
    </div>
  );
}
