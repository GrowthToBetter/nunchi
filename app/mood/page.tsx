"use client";

import { useState, useRef, useEffect } from "react";

// F2: 3 adaptive AI question cards, skip always visible, gentle reflection output
// F1: optional CV mood detection (camera circle, no mandatory use)

type MoodState =
  | "intro"
  | "camera"
  | "questions"
  | "reflection";

const MOODS = [
  { emoji: "😶", label: "Numb", value: "numb", color: "#a5bbfc" },
  { emoji: "😤", label: "Stressed", value: "stressed", color: "#ffa350" },
  { emoji: "😔", label: "Low", value: "low", color: "#c7d7fe" },
  { emoji: "😌", label: "Calm", value: "calm", color: "#bbf7d0" },
  { emoji: "😊", label: "Good", value: "good", color: "#fde68a" },
  { emoji: "😴", label: "Tired", value: "tired", color: "#e0e7ff" },
  { emoji: "😰", label: "Anxious", value: "anxious", color: "#fecaca" },
];

const QUESTIONS: Record<string, { q: string; options: string[] }[]> = {
  stressed: [
    {
      q: "When you feel this way, what do you usually do?",
      options: ["Push through it", "Take a break", "Talk to someone", "Ignore it"],
    },
    {
      q: "What would help most right now?",
      options: ["Music", "Silence", "Moving around", "Just breathing"],
    },
    {
      q: "How long have you been feeling like this?",
      options: ["Just today", "A few days", "A week or more", "Not sure"],
    },
  ],
  low: [
    {
      q: "Is there something specific weighing on you?",
      options: ["School pressure", "Social tension", "Home situation", "I'm not sure"],
    },
    {
      q: "Have you eaten or rested well today?",
      options: ["Yes, both", "Ate, not rested", "Rested, didn't eat", "Neither"],
    },
    {
      q: "What do you wish someone would say to you right now?",
      options: [
        "It's okay to struggle",
        "You're doing enough",
        "Take a rest",
        "Nothing — just be here",
      ],
    },
  ],
  default: [
    {
      q: "What's the biggest thing on your mind today?",
      options: ["Upcoming exam", "A friendship", "My own thoughts", "Something at home"],
    },
    {
      q: "How did you sleep last night?",
      options: ["Really well", "Okay", "Not great", "Barely at all"],
    },
    {
      q: "What energy best describes today so far?",
      options: ["Starting strong", "Getting by", "Dragging along", "On autopilot"],
    },
  ],
};

const REFLECTIONS: Record<string, string> = {
  stressed:
    "You're carrying something heavy today. That's real. Nuri sees that — and it's okay to set some of it down, even for an hour.",
  low:
    "Some days the weight shows up without a reason. You don't have to understand it to be gentle with yourself today.",
  numb:
    "Feeling nothing is still feeling something. Nuri will stay close today — no pressure, no questions.",
  anxious:
    "Your nervous system is working overtime. Let's find one small thing that can slow it down, even briefly.",
  tired:
    "Rest is not laziness. Your body is sending you a message. Today, we keep things light.",
  calm:
    "A steady day is a good foundation. Nuri will help you use that calm energy wisely.",
  good:
    "Hold onto this. Even on good days, checking in matters — it helps Nuri understand your full picture.",
  default:
    "Thanks for showing up. Nuri noticed. Let's move through today together.",
};

export default function MoodPage() {
  const [step, setStep] = useState<MoodState>("intro");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const moodObj = MOODS.find((m) => m.value === selectedMood);
  const questions =
    QUESTIONS[selectedMood ?? ""] ?? QUESTIONS.default;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      // Camera denied — proceed without
      skipCamera();
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const skipCamera = () => {
    stopCamera();
    setStep("questions");
  };

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleAnswer = (answer: string) => {
    const next = [...answers, answer];
    setAnswers(next);
    if (currentQ + 1 < questions.length) {
      setCurrentQ((q) => q + 1);
    } else {
      stopCamera();
      setStep("reflection");
    }
  };

  const handleSkipAll = () => {
    setSkipped(true);
    stopCamera();
    setStep("reflection");
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* INTRO */}
      {step === "intro" && (
        <div className="w-full max-w-md text-center space-y-8 nuri-message">
          <div>
            <p className="text-xs tracking-widest uppercase text-[var(--text-secondary)] mb-2">
              Good morning
            </p>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              How are you, really?
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              60 seconds. No judgment. Just a check-in.
            </p>
          </div>

          {/* Mood picker */}
          <div className="grid grid-cols-4 gap-3">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMoodSelect(m.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                  selectedMood === m.value
                    ? "border-[var(--accent-blue)] bg-[var(--bg-secondary)] scale-105"
                    : "border-[var(--border)] bg-white hover:border-[var(--accent-blue)]/40"
                }`}
                style={
                  selectedMood === m.value
                    ? { borderColor: m.color }
                    : undefined
                }
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] text-[var(--text-secondary)]">
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          <button
            disabled={!selectedMood}
            onClick={() => setStep("camera")}
            className="w-full py-3 rounded-2xl text-white text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: "var(--accent-blue)" }}
          >
            Continue →
          </button>

          <p className="text-xs text-[var(--text-secondary)]">
            Nuri won't share this with anyone.
          </p>
        </div>
      )}

      {/* CAMERA */}
      {step === "camera" && (
        <div className="w-full max-w-md text-center space-y-6 nuri-message">
          <div
            className="mx-auto rounded-full overflow-hidden border-4 flex items-center justify-center"
            style={{
              width: 180,
              height: 180,
              borderColor: moodObj?.color ?? "var(--border)",
              background: "var(--bg-secondary)",
            }}
          >
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <span className="text-5xl">{moodObj?.emoji}</span>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Optional: Let Nuri see your face
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              No data leaves your device. Camera is processed locally only.
            </p>
          </div>

          <div className="space-y-3">
            {!cameraActive ? (
              <button
                onClick={startCamera}
                className="w-full py-3 rounded-2xl text-white text-sm font-medium"
                style={{ background: "var(--accent-blue)" }}
              >
                Allow Camera
              </button>
            ) : (
              <button
                onClick={() => setStep("questions")}
                className="w-full py-3 rounded-2xl text-white text-sm font-medium"
                style={{ background: "var(--accent-blue)" }}
              >
                Looks good, continue →
              </button>
            )}
            <button
              onClick={skipCamera}
              className="w-full py-2 text-sm text-[var(--text-secondary)] underline underline-offset-2"
            >
              Skip camera
            </button>
          </div>
        </div>
      )}

      {/* QUESTIONS */}
      {step === "questions" && (
        <div className="w-full max-w-md space-y-6 nuri-message">
          {/* Progress */}
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-all"
                style={{
                  background:
                    i <= currentQ ? "var(--accent-blue)" : "var(--border)",
                }}
              />
            ))}
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-1">
              Question {currentQ + 1} of {questions.length}
            </p>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] leading-snug">
              {questions[currentQ].q}
            </h2>
          </div>

          <div className="space-y-3">
            {questions[currentQ].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="w-full text-left px-4 py-3 rounded-2xl border border-[var(--border)] bg-white hover:border-[var(--accent-blue)] hover:bg-[var(--bg-secondary)] text-sm text-[var(--text-primary)] transition-all card-hover"
              >
                {opt}
              </button>
            ))}
          </div>

          <button
            onClick={handleSkipAll}
            className="w-full py-2 text-sm text-[var(--text-secondary)] underline underline-offset-2"
          >
            Skip all questions
          </button>
        </div>
      )}

      {/* REFLECTION */}
      {step === "reflection" && (
        <div className="w-full max-w-md text-center space-y-8 nuri-message">
          {/* Nuri bubble */}
          <div
            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ background: moodObj?.color ?? "#e0e9ff" }}
          >
            🌱
          </div>

          <div
            className="p-6 rounded-3xl text-left"
            style={{ background: "var(--bg-secondary)" }}
          >
            <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-3">
              Nuri says
            </p>
            <p className="text-base text-[var(--text-primary)] leading-relaxed">
              {REFLECTIONS[selectedMood ?? ""] ?? REFLECTIONS.default}
            </p>
          </div>

          {!skipped && (
            <div className="space-y-2 text-left">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">
                Your answers
              </p>
              {answers.map((a, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-xl text-sm text-[var(--text-primary)] bg-white border border-[var(--border)]"
                >
                  {a}
                </div>
              ))}
            </div>
          )}

          {/* Recommended study method hint */}
          <div
            className="p-4 rounded-2xl border border-[var(--accent-blue)]/20 text-left"
            style={{ background: "#f0f4ff" }}
          >
            <p className="text-xs text-[var(--accent-blue)] font-medium mb-1">
              Nuri's study suggestion today
            </p>
            <p className="text-sm text-[var(--text-primary)]">
              {selectedMood === "stressed" || selectedMood === "anxious"
                ? "Pomodoro — short bursts with clear breaks will help your nervous system stay regulated."
                : selectedMood === "low" || selectedMood === "numb"
                ? "Feynman — explaining topics out loud can gently reconnect your focus."
                : "Spaced Repetition — you're in a good state to consolidate knowledge today."}
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/planner"
              className="flex-1 py-3 rounded-2xl text-center text-white text-sm font-medium"
              style={{ background: "var(--accent-blue)" }}
            >
              Start studying
            </a>
            <a
              href="/therapy"
              className="flex-1 py-3 rounded-2xl text-center text-sm font-medium border border-[var(--border)] text-[var(--text-secondary)]"
            >
              Open soundscape
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
