"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const MOOD_OPTIONS = [
  { value: "numb",     icon: <><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></>,          label: "Numb",     color: "#A5BBFC" },
  { value: "stressed", icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,               label: "Stressed", color: "#FFA350" },
  { value: "low",      icon: <><path d="M9.59 4.59A2 2 0 1 1 11 8H2"/><path d="M17.73 2.27A2.5 2.5 0 1 1 19.5 6.5H2"/><path d="M14.85 17.85A3 3 0 1 0 17 13H2"/></>, label: "Low", color: "#C7D7FE" },
  { value: "calm",     icon: <><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 9.3-3.6 12.5-8.2 14.04"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></>, label: "Calm", color: "#BBF7D0" },
  { value: "good",     icon: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></>, label: "Good", color: "#FDE68A" },
  { value: "tired",    icon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>,              label: "Tired",    color: "#E0E7FF" },
  { value: "anxious",  icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,                     label: "Anxious",  color: "#FECACA" },
];

const QUESTIONS: Record<string, { q: string; options: string[] }[]> = {
  stressed: [
    { q: "When you feel this way, what do you usually do?", options: ["Push through it","Take a break","Talk to someone","Ignore it"] },
    { q: "What would help most right now?", options: ["Music","Silence","Moving around","Just breathing"] },
    { q: "How long have you been feeling like this?", options: ["Just today","A few days","A week or more","Not sure"] },
  ],
  low: [
    { q: "Is there something specific weighing on you?", options: ["School pressure","Social tension","Home situation","I'm not sure"] },
    { q: "Have you eaten or rested well today?", options: ["Yes, both","Ate, not rested","Rested, didn't eat","Neither"] },
    { q: "What do you wish someone would say to you right now?", options: ["It's okay to struggle","You're doing enough","Take a rest","Nothing — just be here"] },
  ],
  default: [
    { q: "What's the biggest thing on your mind today?", options: ["Upcoming exam","A friendship","My own thoughts","Something at home"] },
    { q: "How did you sleep last night?", options: ["Really well","Okay","Not great","Barely at all"] },
    { q: "What energy best describes today so far?", options: ["Starting strong","Getting by","Dragging along","On autopilot"] },
  ],
};

const REFLECTIONS: Record<string, string> = {
  stressed: "You're carrying something heavy today. That's real. Nuri sees that — and it's okay to set some of it down, even for an hour.",
  low:      "Some days the weight shows up without a reason. You don't have to understand it to be gentle with yourself today.",
  numb:     "Feeling nothing is still feeling something. Nuri will stay close today — no pressure, no questions.",
  anxious:  "Your nervous system is working overtime. Let's find one small thing that can slow it down, even briefly.",
  tired:    "Rest is not laziness. Your body is sending you a message. Today, we keep things light.",
  calm:     "A steady day is a good foundation. Nuri will help you use that calm energy wisely.",
  good:     "Hold onto this. Even on good days, checking in matters — it helps Nuri understand your full picture.",
  default:  "Thanks for showing up. Nuri noticed. Let's move through today together.",
};

function MoodIcon({ path, color, size = 22, strokeWidth = 1.75 }: { path: React.ReactNode; color: string; size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {path}
    </svg>
  );
}

function getGreetingKey() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function MoodPage() {
  const [step, setStep] = useState<"intro"|"camera"|"questions"|"reflection">("intro");
  const [mood, setMood] = useState<string|null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream|null>(null);

  const moodObj = MOOD_OPTIONS.find(m => m.value === mood);
  const questions = QUESTIONS[mood ?? ""] ?? QUESTIONS.default;

  const stopCam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
      setCameraOn(true);
    } catch { setStep("questions"); }
  };

  useEffect(() => () => stopCam(), []);

  const pickMood = (v: string) => {
    setMood(v);
    const neg = ["stressed","low","anxious","numb"];
    if (neg.includes(v)) {
      localStorage.setItem("nunchi_mood_signal", JSON.stringify({ mood: v, timestamp: Date.now(), dismissed: false }));
    } else {
      localStorage.removeItem("nunchi_mood_signal");
    }
  };

  const answer = (a: string) => {
    const next = [...answers, a];
    setAnswers(next);
    if (qIdx + 1 < questions.length) setQIdx(qIdx + 1);
    else { stopCam(); setStep("reflection"); }
  };

  const bg = moodObj ? moodObj.color + "22" : "var(--bg)";

  return (
    <div style={{
      minHeight: "100vh", padding: "32px 20px 80px",
      background: `linear-gradient(180deg, ${bg} 0%, var(--bg) 60%)`,
      transition: "background 800ms",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-3)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back
          </Link>
          <div className="eyebrow">Morning Check-in</div>
          <div style={{ width: 40 }}/>
        </div>

        {/* INTRO */}
        {step === "intro" && (
          <div className="nuri-pop nch-card" style={{ padding: 32, borderRadius: 28, boxShadow: "var(--sh-3)" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div className="eyebrow" style={{ marginBottom: 8 }}>{getGreetingKey()}</div>
              <h2 className="nch-serif" style={{ fontSize: 30, fontStyle: "italic", lineHeight: 1.2, marginBottom: 8 }}>
                How are you, really?
              </h2>
              <p style={{ fontSize: 13, color: "var(--ink-3)" }}>60 seconds. No judgment. Just a check-in.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 28 }}>
              {MOOD_OPTIONS.map(m => {
                const sel = mood === m.value;
                return (
                  <button key={m.value} onClick={() => pickMood(m.value)} style={{
                    padding: 14, borderRadius: 18,
                    background: sel ? "var(--surface)" : "var(--surface-2)",
                    border: `1.5px solid ${sel ? m.color : "var(--border)"}`,
                    boxShadow: sel ? `0 8px 24px ${m.color}40` : "none",
                    transform: sel ? "translateY(-2px)" : "none",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    transition: "var(--t-fast)",
                  }}>
                    <MoodIcon path={m.icon} color={sel ? m.color : "var(--ink-3)"} strokeWidth={sel ? 2.2 : 1.6}/>
                    <span style={{ fontSize: 10, color: sel ? "var(--ink)" : "var(--ink-3)", fontWeight: 500 }}>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <button disabled={!mood} onClick={() => setStep("camera")} style={{
              width: "100%", padding: "16px 24px", borderRadius: 16, fontSize: 15, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: mood ? moodObj!.color : "var(--border)",
              color: mood ? "#1a1a1a" : "var(--ink-3)",
              boxShadow: mood ? `0 8px 24px ${moodObj!.color}50` : "none",
              opacity: mood ? 1 : 0.6, transition: "var(--t-fast)",
            }}>
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
            <div style={{ textAlign: "center", fontSize: 11, color: "var(--ink-3)", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.94 14.06 8 19l-1.94-4.94L1 12.13l4.95-1.94L8 5l1.94 4.95L15 12l-5.06 2.06z"/></svg>
              Nuri won&apos;t share this with anyone.
            </div>
          </div>
        )}

        {/* CAMERA */}
        {step === "camera" && (
          <div className="nuri-pop nch-card" style={{ padding: 32, borderRadius: 28, boxShadow: "var(--sh-3)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div style={{
                width: 180, height: 180, borderRadius: "50%",
                background: "var(--surface-2)",
                border: `4px solid ${moodObj?.color || "var(--border)"}`,
                display: "grid", placeItems: "center", overflow: "hidden",
                boxShadow: `0 0 40px ${moodObj?.color || "transparent"}40`,
              }}>
                {cameraOn
                  ? <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}/>
                  : <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={moodObj?.color || "var(--ink-3)"} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                }
              </div>
            </div>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Optional: Let Nuri see you</h3>
              <p style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
                Using your camera allows Nuri to read subtle facial cues locally. <strong>No data leaves your device.</strong>
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {!cameraOn
                ? <button onClick={startCam} style={{
                    padding: "16px 20px", borderRadius: 16, fontWeight: 600, fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: moodObj?.color, color: "#1a1a1a",
                    boxShadow: `0 8px 24px ${moodObj?.color}50`,
                  }}>Allow Camera</button>
                : <button onClick={() => setStep("questions")} style={{
                    padding: "16px 20px", borderRadius: 16, fontWeight: 600, fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: moodObj?.color, color: "#1a1a1a",
                  }}>Looks good, continue</button>
              }
              <button onClick={() => { stopCam(); setStep("questions"); }} style={{
                padding: "14px 20px", borderRadius: 14, fontWeight: 600, fontSize: 14,
                background: "var(--surface)", color: "var(--ink)",
                border: "1px solid var(--border-strong)",
              }}>Skip camera</button>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {step === "questions" && (
          <div className="nuri-pop nch-card" style={{ padding: 32, borderRadius: 28, boxShadow: "var(--sh-3)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  height: 4, flex: 1, borderRadius: 999,
                  background: i <= qIdx ? (moodObj?.color || "var(--accent)") : "var(--bg-2)",
                  boxShadow: i === qIdx ? `0 0 12px ${moodObj?.color || "var(--accent)"}` : "none",
                  transition: "var(--t-med)",
                }}/>
              ))}
            </div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Question {qIdx + 1} of {questions.length}</div>
            <h3 className="nch-serif" style={{ fontSize: 24, fontStyle: "italic", lineHeight: 1.3, marginBottom: 24 }}>
              {questions[qIdx].q}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions[qIdx].options.map(opt => (
                <button key={opt} onClick={() => answer(opt)} style={{
                  padding: "16px 20px", borderRadius: 16,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontSize: 14, color: "var(--ink)", textAlign: "left",
                  transition: "var(--t-fast)",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; (e.currentTarget as HTMLElement).style.borderColor = moodObj?.color || "var(--accent)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--surface-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = ""; }}>
                  <span>{opt}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={moodObj?.color || "var(--accent)"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { setSkipped(true); stopCam(); setStep("reflection"); }} style={{ fontSize: 11, color: "var(--ink-3)", padding: "6px 14px", borderRadius: 999, border: "1px solid var(--border)" }}>
                Skip all questions
              </button>
            </div>
          </div>
        )}

        {/* REFLECTION */}
        {step === "reflection" && moodObj && (
          <div className="nuri-pop nch-card" style={{ padding: 32, borderRadius: 28, boxShadow: "var(--sh-3)" }}>
            <div style={{
              width: 76, height: 76, borderRadius: 22,
              background: moodObj.color,
              display: "grid", placeItems: "center",
              margin: "0 auto 24px",
              boxShadow: `0 12px 32px ${moodObj.color}80`,
            }}>
              <MoodIcon path={moodObj.icon} color="#1a1a1a" size={36} strokeWidth={2}/>
            </div>

            <div className="nch-card-soft" style={{
              padding: 20, marginBottom: 16,
              borderLeft: `3px solid ${moodObj.color}`,
              borderRadius: "0 14px 14px 0",
            }}>
              <div className="eyebrow" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.94 14.06 8 19l-1.94-4.94L1 12.13l4.95-1.94L8 5l1.94 4.95L15 12l-5.06 2.06z"/></svg>
                Nuri says
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink)" }}>{REFLECTIONS[mood!] || REFLECTIONS.default}</p>
            </div>

            {!skipped && answers.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Your reflections</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {answers.map((a, i) => (
                    <span key={i} style={{ padding: "6px 12px", borderRadius: 999, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 12, color: "var(--ink-2)" }}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ padding: 18, borderRadius: 16, background: moodObj.color + "20", marginBottom: 20 }}>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Study Suggestion</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink)" }}>
                {mood === "stressed" || mood === "anxious"
                  ? "Pomodoro — short bursts with clear breaks will help your nervous system stay regulated."
                  : mood === "low" || mood === "numb"
                    ? "Feynman — explaining topics out loud can gently reconnect your focus."
                    : "Spaced Repetition — you're in a good state to consolidate knowledge today."}
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/planner" style={{
                flex: 1, padding: "16px 20px", borderRadius: 16, fontWeight: 600, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: moodObj.color, color: "#1a1a1a",
                boxShadow: `0 8px 24px ${moodObj.color}50`, textDecoration: "none",
              }}>Start studying</Link>
              <Link href="/therapy" style={{
                flex: 1, padding: "16px 20px", borderRadius: 16, fontWeight: 600, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--surface)", color: "var(--ink)",
                border: "1px solid var(--border-strong)", textDecoration: "none",
              }}>Soundscape</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
