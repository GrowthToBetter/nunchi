"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SCENARIOS = [
  {
    id: 1,
    situation:
      "Your friend just submitted a big exam. She says '괜찮아' (I'm fine) but her messages are shorter than usual and she hasn't used any emojis in three days.",
    question: "What is she most likely feeling?",
    options: [
      { id: "a", label: "Genuinely fine — exams are over after all", emoji: "😌" },
      { id: "b", label: "Relieved but emotionally exhausted", emoji: "😮‍💨" },
      { id: "c", label: "Quietly anxious about the results", emoji: "😟" },
      { id: "d", label: "Disappointed but hiding it to avoid burdening others", emoji: "🫤" },
    ],
    insight: "Nunchi sees beyond the words. '괜찮아' at 2 AM means something different.",
  },
  {
    id: 2,
    situation:
      "During a group study session, one person keeps asking to take breaks. Nobody responds. The group just keeps going. The person stops asking.",
    question: "What is the group communicating without words?",
    options: [
      { id: "a", label: "They didn't hear the request", emoji: "😴" },
      { id: "b", label: "They agree breaks aren't needed right now", emoji: "📚" },
      { id: "c", label: "They expect the person to endure without complaint", emoji: "😶" },
      { id: "d", label: "They feel pressure to keep going but wish someone had spoken up", emoji: "😰" },
    ],
    insight: "Silence in a group is never just silence. It carries the weight of unspoken expectations.",
  },
  {
    id: 3,
    situation:
      "A student receives their mock exam score — lower than expected. Their parent says '열심히 했지' (You worked hard). That's all.",
    question: "What feeling is the parent most likely suppressing?",
    options: [
      { id: "a", label: "Pride regardless of the result", emoji: "❤️" },
      { id: "b", label: "Disappointment, expressed through restraint", emoji: "😔" },
      { id: "c", label: "Worry about future opportunities", emoji: "😰" },
      { id: "d", label: "Guilt — feeling they could have helped more", emoji: "💭" },
    ],
    insight: "Korean parents often carry their children's burdens silently. Hyo runs both ways.",
  },
];

type Answer = { scenarioId: number; optionId: string };

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"language" | "intro" | "test" | "nuri" | "done">("language");
  const [lang, setLang] = useState<"ko" | "id" | "en">("en");
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  const scenario = SCENARIOS[currentScenario];

  const handleAnswer = (optionId: string) => {
    setSelected(optionId);
    setShowInsight(true);
  };

  const handleNext = () => {
    if (selected) {
      setAnswers([...answers, { scenarioId: scenario.id, optionId: selected }]);
    }
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelected(null);
      setShowInsight(false);
    } else {
      setStep("nuri");
    }
  };

  if (step === "language") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8] px-6">
        <Link href="/" className="text-sand-400 text-sm mb-12 hover:text-sand-600">← Back</Link>
        <h1 className="text-4xl font-bold text-nunchi-600 mb-2">눈치</h1>
        <p className="text-sand-500 mb-12 text-center">Choose your language / 언어를 선택하세요 / Pilih bahasa Anda</p>

        <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as typeof lang); setStep("intro"); }}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all card-hover ${
                lang === l.code
                  ? "border-nunchi-400 bg-nunchi-50"
                  : "border-sand-200 bg-white"
              }`}
            >
              <span className="text-3xl">{l.flag}</span>
              <div>
                <div className="font-semibold text-[#1a1a2e]">{l.name}</div>
                <div className="text-xs text-sand-400">{l.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafaf8] px-6 text-center">
        <div className="max-w-md">
          <div className="text-6xl mb-6">👁️</div>
          <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">The Nunchi Test</h2>
          <p className="text-sand-600 leading-relaxed mb-4">
            Nunchi is the Korean art of reading what&apos;s not said — picking up on emotions, atmosphere, and unspoken meanings before a single word is spoken.
          </p>
          <p className="text-sand-600 leading-relaxed mb-8">
            We&apos;ll show you three real scenarios. There are no wrong answers — your responses help Nuri understand how you read the world around you.
          </p>
          <p className="text-xs text-sand-400 mb-8 italic">This is not a self-assessment. You&apos;re reading others, not yourself.</p>
          <button
            onClick={() => setStep("test")}
            className="bg-nunchi-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-nunchi-700 transition-all w-full"
          >
            Start the Test →
          </button>
        </div>
      </div>
    );
  }

  if (step === "test") {
    return (
      <div className="min-h-screen flex flex-col bg-[#fafaf8] px-6 py-8">
        {/* Progress */}
        <div className="max-w-2xl mx-auto w-full mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-sand-400">Nunchi Test</span>
            <span className="text-xs text-sand-400">{currentScenario + 1} of {SCENARIOS.length}</span>
          </div>
          <div className="h-1.5 bg-sand-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-nunchi-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentScenario + (selected ? 1 : 0)) / SCENARIOS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Scenario card */}
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
          <div className="bg-white rounded-3xl p-8 card-shadow mb-6 border border-sand-100">
            <div className="text-xs font-semibold text-nunchi-500 uppercase tracking-wider mb-4">
              Situation {currentScenario + 1}
            </div>
            <p className="text-[#1a1a2e] leading-relaxed text-base mb-6">{scenario.situation}</p>
            <p className="font-semibold text-sand-700 text-sm">{scenario.question}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            {scenario.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt.id)}
                disabled={!!selected}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                  selected === opt.id
                    ? "border-nunchi-500 bg-nunchi-50 shadow-sm"
                    : selected
                    ? "border-sand-100 bg-white opacity-50"
                    : "border-sand-200 bg-white hover:border-nunchi-300 hover:bg-nunchi-50/30 card-hover"
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-sm text-[#1a1a2e] leading-snug">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Insight reveal */}
          {showInsight && (
            <div className="bg-nunchi-50 border border-nunchi-100 rounded-2xl p-4 mb-6 nuri-message">
              <p className="text-xs font-semibold text-nunchi-600 mb-1">👁️ Nunchi insight</p>
              <p className="text-sm text-nunchi-800 leading-relaxed">{scenario.insight}</p>
            </div>
          )}

          {selected && (
            <button
              onClick={handleNext}
              className="bg-[#1a1a2e] text-white px-6 py-3 rounded-2xl font-semibold hover:bg-nunchi-800 transition-all w-full"
            >
              {currentScenario < SCENARIOS.length - 1 ? "Next Scenario →" : "Meet Nuri →"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === "nuri") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-nunchi-50 to-[#fafaf8] px-6 text-center">
        <div className="max-w-md">
          {/* Nuri avatar */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nunchi-400 to-nunchi-600 flex items-center justify-center text-white text-4xl shadow-lg animate-float">
              🌙
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white" />
          </div>

          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-3">Meet Nuri</h2>

          {/* Nuri's intro message */}
          <div className="bg-white rounded-3xl p-6 card-shadow text-left mb-6 border border-sand-100">
            <p className="text-sand-700 leading-relaxed text-sm">
              &ldquo;안녕하세요. I&apos;m Nuri — I&apos;ve lived between Korean and Indonesian cultures my whole life, and I still get confused sometimes. I&apos;m not a therapist. I&apos;m not an assistant. I&apos;m just a peer who gets it.
            </p>
            <p className="text-sand-700 leading-relaxed text-sm mt-3">
              I noticed how you read those situations. You have a natural sense for what&apos;s unspoken. Let&apos;s figure this out together.&rdquo;
            </p>
          </div>

          {/* Mode indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-1.5 bg-nunchi-50 border border-nunchi-100 px-3 py-1.5 rounded-full text-xs text-nunchi-600">
              <span className="w-2 h-2 bg-nunchi-400 rounded-full animate-pulse" />
              KR mode active
            </div>
          </div>

          <Link
            href="/chat"
            className="block bg-nunchi-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-nunchi-700 transition-all"
          >
            Talk to Nuri →
          </Link>
          <Link href="/" className="block text-sand-400 text-sm mt-4 hover:text-sand-600">
            Explore on your own
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

const LANGS = [
  { code: "ko", flag: "🇰🇷", name: "한국어", sub: "Korean" },
  { code: "id", flag: "🇮🇩", name: "Bahasa Indonesia", sub: "Indonesian" },
  { code: "en", flag: "🌐", name: "English", sub: "International" },
];
