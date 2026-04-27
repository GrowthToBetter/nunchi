"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  id: string;
  role: "nuri" | "user";
  text: string;
  time: string;
  mode?: "KR" | "ID";
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "nuri",
    text: "안녕 👋 어떻게 지내고 있어? How are you carrying today?",
    time: now(),
    mode: "KR",
  },
];

const NURI_RESPONSES_KR = [
  "그렇구나... 말하지 않아도 느껴져. I can feel it even without the words. Want to stay here a while?",
  "Hmm. 잠깐, 조금만 더 말해줘. Tell me a little more — I'm listening differently than most.",
  "그 감정... 이름 붙이기 어려운 거 맞아. Some feelings don't have words yet. That's okay.",
  "오늘 하루, 몇 시에 제일 힘들었어? What time of day felt heaviest for you today?",
  "You said '괜찮아' but... are you, really? You can be honest here. I won't tell anyone.",
  "시험 달력 봤어? The exam calendar is getting close. Let's make space for you in it.",
  "같이 있어줌 — I'm here with you. Even in silence, you're not alone right now.",
];

const NURI_RESPONSES_ID = [
  "Yuk cerita — mau curhat apa dulu? No rush. Saya dengerin.",
  "Wah, itu berat banget. Makasih udah cerita. Biasanya orang nyimpen sendiri.",
  "Hmm... rasanya kayak gimana? Ada yang masih belum kamu bilang?",
  "Kamu nggak sendiri. Banyak yang ngerasain hal yang sama tapi nggak ada yang ngomong.",
  "Saya mau nanya satu hal — kamu lagi butuh solusi, atau cuma butuh didengar?",
  "Curhat itu kekuatan, bukan kelemahan. Kamu berani banget.",
];

function now() {
  return new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
}

function getRandomResponse(mode: "KR" | "ID") {
  const arr = mode === "KR" ? NURI_RESPONSES_KR : NURI_RESPONSES_ID;
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"KR" | "ID">("KR");
  const [isTyping, setIsTyping] = useState(false);
  const [curhatMode, setCurhatMode] = useState(false);
  const [curhatText, setCurhatText] = useState("");
  const [curhatSaved, setCurhatSaved] = useState(false);
  const [moodCheckin, setMoodCheckin] = useState(false);
  const [moodStep, setMoodStep] = useState(0);
  const [moodAnswers, setMoodAnswers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
      time: now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    // Detect mode switch from text
    const newMode = input.toLowerCase().includes("indonesia") || /[aeiou]{3,}/.test(input) ? "ID" : mode;

    setTimeout(() => {
      const nuriMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "nuri",
        text: getRandomResponse(newMode),
        time: now(),
        mode: newMode,
      };
      setMessages((m) => [...m, nuriMsg]);
      setMode(newMode);
      setIsTyping(false);
    }, 1400 + Math.random() * 800);
  };

  const handleMoodCheckin = () => {
    setMoodCheckin(true);
    setMoodStep(0);
  };

  const MOOD_QUESTIONS = [
    {
      q: "How did you sleep last night?",
      options: ["Really well 😌", "Okay-ish 😐", "Not great 😔", "Barely at all 😵"],
    },
    {
      q: "When you woke up this morning, what was the first feeling?",
      options: ["Ready to go 💪", "Neutral 😶", "Already tired 😮‍💨", "A quiet dread 😟"],
    },
    {
      q: "Is there something you've been carrying that you haven't told anyone?",
      options: ["No, I'm good 🙂", "Maybe a little thing 🤏", "Yes, something heavy 🪨", "I'd rather not say 🤐"],
    },
  ];

  const handleMoodAnswer = (answer: string) => {
    const updated = [...moodAnswers, answer];
    setMoodAnswers(updated);
    if (moodStep < MOOD_QUESTIONS.length - 1) {
      setMoodStep(moodStep + 1);
    } else {
      // Generate Nuri reflection
      setMoodCheckin(false);
      setIsTyping(true);
      setTimeout(() => {
        const reflection = generateReflection(updated);
        setMessages((m) => [
          ...m,
          {
            id: Date.now().toString(),
            role: "nuri",
            text: reflection,
            time: now(),
            mode,
          },
        ]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const generateReflection = (answers: string[]) => {
    const hasHeavy = answers.some((a) => a.toLowerCase().includes("heavy") || a.toLowerCase().includes("dread"));
    const hasTired = answers.some((a) => a.toLowerCase().includes("tired") || a.toLowerCase().includes("barely"));
    if (hasHeavy && hasTired)
      return "You seem like you're carrying something quite heavy today, and you haven't had the rest to carry it well. Want a shorter session — or would you like to just... be here for a moment?";
    if (hasHeavy)
      return "There's something unspoken you're holding. You don't have to share it now. But I'll be here when you're ready.";
    if (hasTired)
      return "Your body is telling me something your words aren't. Rest is not weakness — especially before exams. Let's find some space for you today.";
    return "You seem steady today. That's its own kind of strength. What would feel good to do right now?";
  };

  const saveCurhat = () => {
    if (curhatText.trim()) {
      setCurhatSaved(true);
      setCurhatMode(false);
      setCurhatText("");
      setTimeout(() => {
        setMessages((m) => [
          ...m,
          {
            id: Date.now().toString(),
            role: "nuri",
            text: "I received something you wrote — just the shape of it, not the words. I'll check in with you in 24 hours. You decide then: share, or let it pass. 💙",
            time: now(),
            mode,
          },
        ]);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf8]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-sand-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8" />
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nunchi-400 to-nunchi-600 flex items-center justify-center text-white text-lg shadow-sm">
            🌙
          </div>
          <div>
            <p className="font-semibold text-[#1a1a2e] text-sm">Nuri</p>
            <p className="text-xs text-sand-400">Your cultural peer · Always here</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === "KR" ? "ID" : "KR")}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
              mode === "KR"
                ? "bg-nunchi-50 border-nunchi-200 text-nunchi-600"
                : "bg-warm-50 border-warm-200 text-warm-600"
            }`}
          >
            {mode === "KR" ? "🇰🇷 KR mode" : "🇮🇩 ID mode"}
          </button>
        </div>
      </header>

      {/* Mood Check-In Banner */}
      {!moodCheckin && (
        <div className="px-4 pt-3">
          <button
            onClick={handleMoodCheckin}
            className="w-full bg-gradient-to-r from-nunchi-50 to-warm-50 border border-sand-200 rounded-2xl px-4 py-3 text-sm text-left flex items-center justify-between hover:border-nunchi-300 transition-all"
          >
            <div>
              <span className="font-medium text-[#1a1a2e]">🌅 Morning check-in</span>
              <span className="text-sand-400 ml-2 text-xs">60 seconds · How are you carrying today?</span>
            </div>
            <span className="text-nunchi-500 font-medium text-xs">Start →</span>
          </button>
        </div>
      )}

      {/* Mood Check-In Modal */}
      {moodCheckin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md card-shadow">
            <div className="flex items-center justify-between mb-5">
              <p className="font-semibold text-[#1a1a2e]">Daily Check-In</p>
              <div className="flex gap-1">
                {MOOD_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i <= moodStep ? "bg-nunchi-500" : "bg-sand-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-[#1a1a2e] font-medium mb-4 text-sm leading-relaxed">
              {MOOD_QUESTIONS[moodStep].q}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {MOOD_QUESTIONS[moodStep].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleMoodAnswer(opt)}
                  className="text-left px-4 py-3 rounded-xl border border-sand-200 text-sm hover:border-nunchi-300 hover:bg-nunchi-50 transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              onClick={() => setMoodCheckin(false)}
              className="mt-3 text-xs text-sand-400 w-full text-center hover:text-sand-600"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "nuri" && (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-nunchi-400 to-nunchi-600 flex items-center justify-center text-white text-sm mr-2 flex-shrink-0 mt-auto">
                🌙
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-3 nuri-message ${
                msg.role === "nuri"
                  ? "bg-white border border-sand-100 text-[#1a1a2e] card-shadow"
                  : "bg-nunchi-600 text-white"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-xs opacity-40">{msg.time}</span>
                {msg.mode && (
                  <span className="text-xs opacity-40 border border-current rounded-full px-1.5 py-0.5">
                    {msg.mode}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-nunchi-400 to-nunchi-600 flex items-center justify-center text-white text-sm flex-shrink-0">
              🌙
            </div>
            <div className="bg-white border border-sand-100 rounded-2xl px-4 py-3 card-shadow">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-sand-300 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {curhatSaved && (
          <div className="flex justify-center">
            <div className="bg-nunchi-50 border border-nunchi-100 rounded-full px-4 py-2 text-xs text-nunchi-600">
              💙 Curhat saved — Nuri will check in tomorrow
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Curhat Buffer */}
      {curhatMode && (
        <div className="px-4 pb-2">
          <div className="bg-warm-50 border border-warm-200 rounded-2xl p-3">
            <p className="text-xs text-warm-700 font-medium mb-2">✍️ Write freely — Nuri reads patterns only, not content</p>
            <textarea
              value={curhatText}
              onChange={(e) => setCurhatText(e.target.value)}
              placeholder="Anything. Messy thoughts, feelings, words that don't make sense yet..."
              className="w-full bg-transparent text-sm text-[#1a1a2e] resize-none outline-none placeholder-warm-300 min-h-[80px]"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={saveCurhat}
                disabled={!curhatText.trim()}
                className="bg-warm-500 text-white text-xs px-3 py-1.5 rounded-lg disabled:opacity-40"
              >
                Save privately
              </button>
              <button
                onClick={() => { setCurhatMode(false); setCurhatText(""); }}
                className="text-xs text-warm-400 px-3 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-safe pb-4 pt-2 border-t border-sand-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setCurhatMode(!curhatMode)}
            title="Curhat Buffer — write freely"
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${
              curhatMode ? "bg-warm-100 text-warm-600" : "bg-sand-100 text-sand-500 hover:bg-warm-50 hover:text-warm-500"
            }`}
          >
            ✍️
          </button>
          <div className="flex-1 flex items-end bg-sand-50 border border-sand-200 rounded-2xl px-3 py-2 gap-2 focus-within:border-nunchi-300 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Talk to Nuri... 말해봐..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-[#1a1a2e] placeholder-sand-400 max-h-28"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="flex-shrink-0 w-7 h-7 bg-nunchi-600 text-white rounded-full flex items-center justify-center text-xs disabled:opacity-30 hover:bg-nunchi-700 transition-colors"
            >
              ↑
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-sand-300 mt-2">
          Nuri is not a therapist · If you&apos;re in crisis, please reach out to Hotline 1393 (Korea) or 119 (Indonesia)
        </p>
      </div>
    </div>
  );
}
