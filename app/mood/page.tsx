"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  Zap, 
  CloudRain, 
  Leaf, 
  Sun, 
  Moon, 
  Activity,
  ArrowRight,
  Camera,
  CameraOff,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { InteractiveGridBox } from "@/components/InteractiveGridBox";

type MoodState = "intro" | "camera" | "questions" | "reflection";

const MOODS = [
  { icon: Cloud, label: "Numb", value: "numb", color: "#a5bbfc", glow: "rgba(165, 187, 252, 0.4)" },
  { icon: Zap, label: "Stressed", value: "stressed", color: "#ffa350", glow: "rgba(255, 163, 80, 0.4)" },
  { icon: CloudRain, label: "Low", value: "low", color: "#c7d7fe", glow: "rgba(199, 215, 254, 0.4)" },
  { icon: Leaf, label: "Calm", value: "calm", color: "#bbf7d0", glow: "rgba(187, 247, 208, 0.4)" },
  { icon: Sun, label: "Good", value: "good", color: "#fde68a", glow: "rgba(253, 230, 138, 0.4)" },
  { icon: Moon, label: "Tired", value: "tired", color: "#e0e7ff", glow: "rgba(224, 231, 255, 0.4)" },
  { icon: Activity, label: "Anxious", value: "anxious", color: "#fecaca", glow: "rgba(254, 202, 202, 0.4)" },
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

const pageVariants = {
  initial: { opacity: 0, y: 15, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } }
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
  const questions = QUESTIONS[selectedMood ?? ""] ?? QUESTIONS.default;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      skipCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-x-hidden overflow-y-auto"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background ambient glow based on mood */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-colors duration-1000"
        style={{
          backgroundColor: moodObj ? moodObj.glow : "rgba(90, 112, 243, 0.05)"
        }}
      />

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {step === "intro" && (
          <motion.div
            key="intro"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md"
          >
            <InteractiveGridBox
              className="rounded-[40px] border border-white/50 shadow-[0_24px_64px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)",
                backdropFilter: "blur(40px) saturate(200%)"
              }}
              highlightColor={moodObj?.glow}
              glowColor={moodObj?.glow ? moodObj.glow.replace(", 0.4)", ", 0.05)") : undefined}
              clickGlowColor={moodObj?.glow ? moodObj.glow.replace(", 0.4)", ", 0.15)") : undefined}
            >
              <div className="text-center mb-8">
                <p className="text-xs tracking-widest uppercase text-[var(--text-secondary)] mb-2 font-medium">
                  Good morning
                </p>
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                  How are you, really?
                </h1>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  60 seconds. No judgment. Just a check-in.
                </p>
              </div>

              {/* Mood picker grid */}
              <div className="grid grid-cols-4 gap-3 mb-8 w-full px-2">
                {MOODS.map((m) => {
                  const isSelected = selectedMood === m.value;
                  const Icon = m.icon;
                  return (
                    <motion.button
                      key={m.value}
                      onClick={() => handleMoodSelect(m.value)}
                      className="group flex flex-col items-center gap-2 p-4 rounded-3xl relative overflow-hidden"
                      animate={{
                        background: isSelected ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.4)",
                        borderColor: isSelected ? m.color : "rgba(255, 255, 255, 0.6)",
                        boxShadow: isSelected ? `0 8px 24px ${m.glow}` : "0 2px 8px rgba(0,0,0,0.02)",
                        y: isSelected ? -4 : 0
                      }}
                      whileHover={!isSelected ? {
                        y: -2,
                        background: "rgba(255, 255, 255, 0.6)",
                        boxShadow: `0 8px 20px ${m.glow}`
                      } : {}}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      style={{ borderWidth: 1, borderStyle: "solid" }}
                    >
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ backgroundColor: m.glow }}
                      />
                      <Icon 
                        size={28} 
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        style={{ color: isSelected ? m.color : "var(--text-secondary)", transition: "all 0.3s ease" }} 
                      />
                      <span className={`text-[11px] font-medium transition-colors ${isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                        {m.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="w-full flex flex-col items-center space-y-4">
                <motion.button
                  disabled={!selectedMood}
                  onClick={() => setStep("camera")}
                  className="w-full py-4 rounded-3xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  whileHover={selectedMood ? { y: -2, boxShadow: `inset 0 1px 1px rgba(255,255,255,0.6), 0 12px 32px ${moodObj?.glow}` } : {}}
                  whileTap={selectedMood ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ 
                    backgroundImage: selectedMood ? "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)" : "none",
                    backgroundColor: selectedMood ? (moodObj?.color || "#5a70f3") : "var(--border)",
                    color: selectedMood ? "#1a1a1a" : "var(--text-secondary)",
                    boxShadow: selectedMood ? `inset 0 1px 1px rgba(255,255,255,0.5), 0 8px 24px ${moodObj?.glow}` : "none"
                  }}
                >
                  Continue <ArrowRight size={16} />
                </motion.button>
                <p className="text-[11px] text-[var(--text-secondary)] font-medium flex items-center gap-1 opacity-60">
                  <Sparkles size={12} /> Nuri won't share this with anyone.
                </p>
              </div>
            </InteractiveGridBox>
          </motion.div>
        )}

        {/* CAMERA */}
        {step === "camera" && (
          <motion.div
            key="camera"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md"
          >
            <InteractiveGridBox
              className="rounded-[40px] border border-white/50 shadow-[0_24px_64px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)",
                backdropFilter: "blur(40px) saturate(200%)"
              }}
              highlightColor={moodObj?.glow}
              glowColor={moodObj?.glow ? moodObj.glow.replace(", 0.4)", ", 0.05)") : undefined}
              clickGlowColor={moodObj?.glow ? moodObj.glow.replace(", 0.4)", ", 0.15)") : undefined}
            >
              <div className="flex justify-center mb-8">
                <div
                  className="relative rounded-full overflow-hidden flex items-center justify-center shadow-inner transition-all duration-500"
                  style={{
                    width: 180,
                    height: 180,
                    background: "rgba(255, 255, 255, 0.5)",
                    border: `4px solid ${moodObj?.color ?? "var(--border)"}`,
                    boxShadow: `0 0 40px ${moodObj?.glow}`
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
                    moodObj ? <moodObj.icon size={64} color={moodObj.color} strokeWidth={1.5} /> : <Camera size={64} color="var(--text-secondary)" strokeWidth={1.5} />
                  )}
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  Optional: Let Nuri see you
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed px-4">
                  Using your camera allows Nuri to read subtle facial cues locally. No data leaves your device.
                </p>
              </div>

              <div className="space-y-3 w-full">
                {!cameraActive ? (
                  <motion.button
                    onClick={startCamera}
                    className="w-full py-4 rounded-3xl text-sm font-semibold flex items-center justify-center gap-2"
                    whileHover={{ y: -2, boxShadow: `inset 0 1px 1px rgba(255,255,255,0.6), 0 12px 32px ${moodObj?.glow}` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{ 
                      backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                      backgroundColor: moodObj?.color || "#5a70f3",
                      color: "#1a1a1a",
                      boxShadow: `inset 0 1px 1px rgba(255,255,255,0.5), 0 8px 24px ${moodObj?.glow}`
                    }}
                  >
                    <Camera size={18} /> Allow Camera
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setStep("questions")}
                    className="w-full py-4 rounded-3xl text-sm font-semibold flex items-center justify-center gap-2"
                    whileHover={{ y: -2, boxShadow: `inset 0 1px 1px rgba(255,255,255,0.6), 0 12px 32px ${moodObj?.glow}` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{ 
                      backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                      backgroundColor: moodObj?.color || "#5a70f3",
                      color: "#1a1a1a",
                      boxShadow: `inset 0 1px 1px rgba(255,255,255,0.5), 0 8px 24px ${moodObj?.glow}`
                    }}
                  >
                    Looks good, continue <ArrowRight size={18} />
                  </motion.button>
                )}
                <motion.button
                  onClick={skipCamera}
                  className="w-full py-3 rounded-3xl text-sm font-medium text-[var(--text-secondary)] flex items-center justify-center gap-2 bg-white/40 border border-white/40"
                  whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.6)", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <CameraOff size={16} /> Skip camera
                </motion.button>
              </div>
            </InteractiveGridBox>
          </motion.div>
        )}

        {/* QUESTIONS */}
        {step === "questions" && (
          <motion.div
            key="questions"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md"
          >
            <InteractiveGridBox
              className="rounded-[40px] border border-white/50 shadow-[0_24px_64px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)",
                backdropFilter: "blur(40px) saturate(200%)"
              }}
              highlightColor={moodObj?.glow}
              glowColor={moodObj?.glow ? moodObj.glow.replace(", 0.4)", ", 0.05)") : undefined}
              clickGlowColor={moodObj?.glow ? moodObj.glow.replace(", 0.4)", ", 0.15)") : undefined}
            >
              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-all duration-500"
                    style={{
                      background: i <= currentQ ? moodObj?.color ?? "var(--accent-blue)" : "rgba(0,0,0,0.05)",
                      boxShadow: i === currentQ ? `0 0 8px ${moodObj?.glow}` : "none"
                    }}
                  />
                ))}
              </div>

              <div className="relative min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                  >
                    <div className="mb-8">
                      <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2 font-medium">
                        Question {currentQ + 1} of {questions.length}
                      </p>
                      <h2 className="text-2xl font-semibold text-[var(--text-primary)] leading-snug">
                        {questions[currentQ].q}
                      </h2>
                    </div>

                    <div className="space-y-3 w-full mb-6">
                      {questions[currentQ].options.map((opt) => (
                        <motion.button
                          key={opt}
                          onClick={() => handleAnswer(opt)}
                          className="group w-full text-left px-5 py-4 rounded-3xl border border-white/60 bg-white/50 text-sm font-medium text-[var(--text-primary)] flex items-center justify-between"
                          whileHover={{ 
                            backgroundColor: "rgba(255,255,255,1)",
                            borderColor: moodObj?.color ?? "var(--accent-blue)",
                            boxShadow: `0 8px 20px ${moodObj?.glow ?? "rgba(90, 112, 243, 0.15)"}`,
                            scale: 1.01,
                            y: -2
                          }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          style={{
                            boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                          }}
                        >
                          <span>{opt}</span>
                          <ArrowRight 
                            size={16} 
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
                            style={{ color: moodObj?.color ?? "var(--accent-blue)" }}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center w-full">
                <button
                  onClick={handleSkipAll}
                  className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2 px-4 rounded-full bg-white/30 hover:bg-white/50 border border-transparent hover:border-white/50"
                >
                  Skip all questions
                </button>
              </div>
            </InteractiveGridBox>
          </motion.div>
        )}

        {/* REFLECTION */}
        {step === "reflection" && (
          <motion.div
            key="reflection"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md"
          >
            <InteractiveGridBox
              className="rounded-[40px] border border-white/50 shadow-[0_24px_64px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)]"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.2) 100%)",
                backdropFilter: "blur(40px) saturate(200%)"
              }}
              highlightColor={moodObj?.glow}
              glowColor={moodObj?.glow ? moodObj.glow.replace(", 0.4)", ", 0.05)") : undefined}
              clickGlowColor={moodObj?.glow ? moodObj.glow.replace(", 0.4)", ", 0.15)") : undefined}
            >
              <div className="flex flex-col items-center w-full">
                {/* Nuri bubble */}
                <div
                  className="w-20 h-20 rounded-[24px] flex items-center justify-center mb-8"
                  style={{ 
                    backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)",
                    backgroundColor: moodObj?.color ?? "#e0e9ff",
                    boxShadow: `0 12px 32px ${moodObj?.glow ?? "rgba(90,112,243,0.2)"}, inset 0 1px 2px rgba(255,255,255,0.8)`
                  }}
                >
                  {moodObj ? <moodObj.icon size={36} color="#1a1a1a" strokeWidth={2} /> : <Sparkles size={36} color="#5a70f3" />}
                </div>

                <div
                  className="w-full p-6 rounded-3xl text-left mb-6 border border-white/60 relative overflow-hidden"
                  style={{ background: "rgba(255, 255, 255, 0.6)" }}
                >
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: moodObj?.color ?? "var(--accent-blue)" }} />
                  <p className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-3 font-medium flex items-center gap-1">
                    <Sparkles size={12} /> Nuri says
                  </p>
                  <p className="text-[15px] font-medium text-[var(--text-primary)] leading-relaxed">
                    {REFLECTIONS[selectedMood ?? ""] ?? REFLECTIONS.default}
                  </p>
                </div>

                {!skipped && answers.length > 0 && (
                  <div className="w-full space-y-2 text-left mb-6">
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest font-medium pl-1">
                      Your reflections
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {answers.map((a, i) => (
                         <div
                           key={i}
                           className="px-4 py-2 rounded-2xl text-sm font-medium text-[var(--text-primary)] bg-white/50 border border-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                         >
                           {a}
                         </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended study method hint */}
                <div
                  className="w-full p-5 rounded-3xl border border-white/60 text-left mb-8"
                  style={{ 
                    backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                    backgroundColor: moodObj?.glow ?? "rgba(90,112,243,0.1)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.4)"
                  }}
                >
                  <p className="text-xs text-[var(--text-primary)] font-semibold mb-2 uppercase tracking-widest">
                    Study Suggestion
                  </p>
                  <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
                    {selectedMood === "stressed" || selectedMood === "anxious"
                      ? "Pomodoro — short bursts with clear breaks will help your nervous system stay regulated."
                      : selectedMood === "low" || selectedMood === "numb"
                      ? "Feynman — explaining topics out loud can gently reconnect your focus."
                      : "Spaced Repetition — you're in a good state to consolidate knowledge today."}
                  </p>
                </div>

                <div className="flex gap-3 w-full">
                  <motion.a
                    href="/planner"
                    className="flex-1 py-4 rounded-3xl text-center text-sm font-semibold block"
                    whileHover={{ y: -2, boxShadow: `inset 0 1px 1px rgba(255,255,255,0.6), 0 12px 32px ${moodObj?.glow ?? "rgba(90,112,243,0.3)"}` }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    style={{ 
                      backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                      backgroundColor: moodObj?.color ?? "#5a70f3",
                      color: "#1a1a1a",
                      boxShadow: `inset 0 1px 1px rgba(255,255,255,0.5), 0 8px 24px ${moodObj?.glow ?? "rgba(90,112,243,0.3)"}`
                    }}
                  >
                    Start studying
                  </motion.a>
                  <motion.a
                    href="/therapy"
                    className="flex-1 py-4 rounded-3xl text-center text-sm font-semibold bg-white/50 border border-white/80 text-[var(--text-primary)] block"
                    whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.8)", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    Open soundscape
                  </motion.a>
                </div>
              </div>
            </InteractiveGridBox>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
