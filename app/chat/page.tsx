"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "nuri" | "user";
  text: string;
  time: string;
  mode?: "KR" | "ID";
};

const NURI_RESPONSES = {
  KR: [
    "그렇구나... 말하지 않아도 느껴져. I can feel it even without the words. Want to stay here a while?",
    "Hmm. 잠깐, 조금만 더 말해줘. Tell me a little more — I'm listening differently than most.",
    "그 감정... 이름 붙이기 어려운 거 맞아. Some feelings don't have words yet. That's okay.",
    "오늘 하루, 몇 시에 제일 힘들었어? What time of day felt heaviest for you today?",
    "You said '괜찮아' but... are you, really? You can be honest here. I won't tell anyone.",
    "같이 있어줌 — I'm here with you. Even in silence, you're not alone right now.",
  ],
  ID: [
    "Yuk cerita — mau curhat apa dulu? No rush. Saya dengerin.",
    "Wah, itu berat banget. Makasih udah cerita. Biasanya orang nyimpen sendiri.",
    "Hmm... rasanya kayak gimana? Ada yang masih belum kamu bilang?",
    "Kamu nggak sendiri. Banyak yang ngerasain hal yang sama tapi nggak ada yang ngomong.",
    "Saya mau nanya satu hal — kamu lagi butuh solusi, atau cuma butuh didengar?",
    "Curhat itu kekuatan, bukan kelemahan. Kamu berani banget.",
  ],
};

const CHECKIN_Q = [
  { q: "How did you sleep last night?", options: ["Really well 😌", "Okay-ish 😐", "Not great 😔", "Barely at all 😵"] },
  { q: "When you woke up this morning, what was the first feeling?", options: ["Ready to go 💪", "Neutral 😶", "Already tired 😮‍💨", "A quiet dread 😟"] },
  { q: "Is there something you've been carrying that you haven't told anyone?", options: ["No, I'm good 🙂", "Maybe a little thing 🤏", "Yes, something heavy 🪨", "I'd rather not say 🤐"] },
];

function now() {
  return new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
}

function pick(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "nuri", text: "안녕 👋 어떻게 지내고 있어? How are you carrying today?", time: now(), mode: "KR" },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"KR" | "ID">("KR");
  const [typing, setTyping] = useState(false);
  const [curhatOpen, setCurhatOpen] = useState(false);
  const [curhatText, setCurhatText] = useState("");
  const [curhatSaved, setCurhatSaved] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [checkinStep, setCheckinStep] = useState(0);
  const [checkinAns, setCheckinAns] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const lower = input.toLowerCase();
    const newMode: "KR" | "ID" = lower.includes("indonesia") || /\b(saya|aku|kamu|yang|nggak)\b/.test(lower) ? "ID" : mode;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: input.trim(), time: now() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, {
        id: (Date.now() + 1).toString(), role: "nuri",
        text: pick(NURI_RESPONSES[newMode]), time: now(), mode: newMode,
      }]);
      setMode(newMode);
      setTyping(false);
    }, 1400 + Math.random() * 700);
  };

  const onCheckinAnswer = (a: string) => {
    const next = [...checkinAns, a];
    setCheckinAns(next);
    if (checkinStep < CHECKIN_Q.length - 1) {
      setCheckinStep(checkinStep + 1);
    } else {
      setShowCheckin(false);
      setCheckinStep(0); setCheckinAns([]);
      setTyping(true);
      setTimeout(() => {
        const heavy = next.some(x => /heavy|dread/i.test(x));
        const tired = next.some(x => /tired|barely/i.test(x));
        const text = (heavy && tired)
          ? "You seem like you're carrying something quite heavy today, and you haven't had the rest to carry it well. Want a shorter session — or would you like to just... be here for a moment?"
          : heavy ? "There's something unspoken you're holding. You don't have to share it now. But I'll be here when you're ready."
          : tired ? "Your body is telling me something your words aren't. Rest is not weakness — especially before exams. Let's find some space for you today."
          : "You seem steady today. That's its own kind of strength. What would feel good to do right now?";
        setMessages(m => [...m, { id: Date.now().toString(), role: "nuri", text, time: now(), mode }]);
        setTyping(false);
      }, 1500);
    }
  };

  const saveCurhat = () => {
    if (!curhatText.trim()) return;
    setCurhatSaved(true);
    setCurhatOpen(false);
    setCurhatText("");
    setTimeout(() => {
      setMessages(m => [...m, {
        id: Date.now().toString(), role: "nuri",
        text: "I received something you wrote — just the shape of it, not the words. I'll check in with you in 24 hours. You decide then: share, or let it pass. 💙",
        time: now(), mode,
      }]);
    }, 400);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100svh", background: "var(--bg)" }}>
      {/* Header */}
      <div className="nch-glass" style={{
        position: "sticky", top: 0, zIndex: 10,
        padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "linear-gradient(135deg, var(--accent), var(--accent-ink))",
            display: "grid", placeItems: "center", fontSize: 18, color: "white",
          }}>🌙</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Nuri</div>
            <div style={{ fontSize: 10, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
              <div className="pulse-dot" style={{ width: 5, height: 5, borderRadius: 999, background: "var(--good)", display: "inline-block" }}/>
              Your cultural peer · Always here
            </div>
          </div>
        </div>
        <button onClick={() => setMode(mode === "KR" ? "ID" : "KR")} style={{
          padding: "6px 12px", borderRadius: 999,
          background: mode === "KR" ? "var(--accent-soft)" : "var(--warm-soft)",
          color: mode === "KR" ? "var(--accent-ink)" : "var(--warm-ink)",
          fontSize: 11, fontWeight: 600,
          border: `1px solid ${mode === "KR" ? "rgba(90,112,243,0.2)" : "rgba(255,138,42,0.2)"}`,
        }}>
          {mode === "KR" ? "🇰🇷 KR mode" : "🇮🇩 ID mode"}
        </button>
      </div>

      {/* Check-in banner */}
      {!showCheckin && (
        <div style={{ padding: "12px 20px 0" }}>
          <button onClick={() => { setShowCheckin(true); setCheckinStep(0); setCheckinAns([]); }} style={{
            width: "100%", padding: "12px 16px", borderRadius: 14,
            background: "linear-gradient(90deg, var(--accent-soft), var(--warm-soft))",
            border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            textAlign: "left",
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>🌅 Morning check-in</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>60 seconds · How are you carrying today?</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)" }}>Start →</span>
          </button>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map(m => (
          <div key={m.id} className="nuri-pop" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
            {m.role === "nuri" && (
              <div style={{
                width: 28, height: 28, borderRadius: 9,
                background: "linear-gradient(135deg, var(--accent), var(--accent-ink))",
                display: "grid", placeItems: "center", fontSize: 13, color: "white",
                flexShrink: 0, alignSelf: "flex-end",
              }}>🌙</div>
            )}
            <div style={{
              maxWidth: "78%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: m.role === "user" ? "var(--accent)" : "var(--surface)",
              color: m.role === "user" ? "var(--on-accent)" : "var(--ink)",
              border: m.role === "user" ? "none" : "1px solid var(--border)",
              boxShadow: m.role === "nuri" ? "var(--sh-1)" : "none",
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0 }}>{m.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 10, opacity: 0.5 }}>{m.time}</span>
                {m.mode && <span style={{ fontSize: 9, opacity: 0.4, border: "1px solid currentColor", padding: "1px 5px", borderRadius: 999 }}>{m.mode}</span>}
              </div>
            </div>
          </div>
        ))}

        {typing && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: "linear-gradient(135deg, var(--accent), var(--accent-ink))", display: "grid", placeItems: "center", color: "white", fontSize: 13, flexShrink: 0 }}>🌙</div>
            <div style={{ padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 4, boxShadow: "var(--sh-1)" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: "var(--ink-3)", animation: `bounce 1.4s ${i * 0.15}s infinite ease-in-out` }}/>
              ))}
            </div>
          </div>
        )}

        {curhatSaved && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ fontSize: 11, padding: "6px 14px", borderRadius: 999, background: "var(--accent-soft)", color: "var(--accent-ink)" }}>
              💙 Curhat saved — Nuri will check in tomorrow
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Curhat buffer */}
      {curhatOpen && (
        <div style={{ padding: "0 20px 8px" }}>
          <div style={{ padding: 14, borderRadius: 16, background: "var(--warm-soft)", border: "1px solid rgba(255,138,42,0.3)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--warm-ink)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              ✍️ Write freely — Nuri reads patterns only, not content
            </div>
            <textarea
              value={curhatText}
              onChange={e => setCurhatText(e.target.value)}
              placeholder="Anything. Messy thoughts, feelings, words that don't make sense yet..."
              rows={4}
              style={{
                width: "100%", background: "transparent", border: "none", outline: "none",
                resize: "none", fontSize: 13, color: "var(--ink)", fontFamily: "var(--font-sans)",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={saveCurhat} disabled={!curhatText.trim()} style={{
                padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: "var(--warm)", color: "white", opacity: curhatText.trim() ? 1 : 0.4,
              }}>Save privately</button>
              <button onClick={() => { setCurhatOpen(false); setCurhatText(""); }} style={{
                padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: "transparent", color: "var(--ink-3)",
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div style={{ padding: "10px 20px 14px", borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
          <button
            onClick={() => setCurhatOpen(!curhatOpen)}
            title="Curhat Buffer"
            style={{
              flexShrink: 0, width: 38, height: 38, borderRadius: 12,
              background: curhatOpen ? "var(--warm-soft)" : "var(--bg-2)",
              color: curhatOpen ? "var(--warm)" : "var(--ink-3)",
              display: "grid", placeItems: "center", fontSize: 16,
            }}>✍️</button>
          <div style={{
            flex: 1, padding: "8px 12px",
            background: "var(--bg-2)", border: "1px solid var(--border)",
            borderRadius: 14, display: "flex", alignItems: "flex-end", gap: 8,
          }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Talk to Nuri... 말해봐..."
              rows={1}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                resize: "none", fontSize: 14, maxHeight: 120, color: "var(--ink)",
                fontFamily: "var(--font-sans)",
              }}
            />
            <button onClick={send} disabled={!input.trim()} style={{
              width: 28, height: 28, borderRadius: 999,
              background: "var(--accent)", color: "white",
              display: "grid", placeItems: "center",
              opacity: input.trim() ? 1 : 0.3,
              flexShrink: 0,
            }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 10, color: "var(--ink-3)", marginTop: 8 }}>
          Nuri is not a therapist · Crisis: KR 1393 · ID 119
        </p>
      </div>

      {/* Check-in modal */}
      {showCheckin && (
        <div
          onClick={() => setShowCheckin(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(10,10,15,0.45)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div onClick={e => e.stopPropagation()} className="nch-card nuri-pop" style={{
            width: "100%", maxWidth: 420, padding: 24, borderRadius: 24, boxShadow: "var(--sh-4)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)" }}>Daily Check-In</div>
              <div style={{ display: "flex", gap: 4 }}>
                {CHECKIN_Q.map((_, i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: i <= checkinStep ? "var(--accent)" : "var(--border-strong)" }}/>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.5, marginBottom: 16, fontWeight: 500 }}>
              {CHECKIN_Q[checkinStep].q}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CHECKIN_Q[checkinStep].options.map(opt => (
                <button key={opt} onClick={() => onCheckinAnswer(opt)} style={{
                  textAlign: "left", padding: "12px 14px", borderRadius: 12,
                  border: "1px solid var(--border)", background: "var(--surface)",
                  fontSize: 13, color: "var(--ink)",
                  transition: "var(--t-fast)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                  {opt}
                </button>
              ))}
            </div>
            <button onClick={() => setShowCheckin(false)} style={{ marginTop: 12, width: "100%", fontSize: 11, color: "var(--ink-3)", padding: "6px" }}>
              Skip for now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
