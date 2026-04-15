# 눈치 Nunchi — Feel What's Not Said

**AI-powered mental wellness companion for the 16th e-ICON World Contest · SDG 3: Good Health & Well-Being**

> Bridging Korean (*nunchi* — reading the unspoken) and Indonesian (*curhat* — sharing openly) cultural intelligences into one stigma-free mental health companion.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
npm run build
npm start
```

---

## 📱 Pages & Features

| Route | Feature | Description |
|-------|---------|-------------|
| `/` | Landing | Hero, feature cards, cultural bridge, statistics |
| `/onboarding` | Nunchi Test | 3-scenario test → language selection → meet Nuri |
| `/chat` | Nuri Chatbot (F3) | Bicultural AI companion + Curhat Buffer + Mood Check-In (F2) |
| `/therapy` | Therapy Game (F5) | 5 sound modes with binaural beats via Web Audio API |
| `/profile` | Nunchi Profile (F7) | Two-circle visualization + Heatmap (F6-UV3) + Weekly Report (F6) |
| `/planner` | Exam Planner (F4) | Wellness-integrated exam planning with nunchi check moments |

---

## 🧩 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| AI Chatbot (Nuri) | Claude API / GPT-4 via LLM with cultural prompt engineering |
| Soundscape | Web Audio API — binaural beat generation in pure JavaScript |
| Therapy visuals | Canvas API — procedural generation |
| Computer Vision | TensorFlow.js + MediaPipe FaceMesh (client-side only) |
| Session Storage | IndexedDB (local-first) + AES-256 encryption |
| Deployment | Vercel / Netlify — static hosting |

---

## 🧠 Seven Core Features

1. **F1** — Computer Vision Mood Detection (TensorFlow.js, client-side)
2. **F2** — Daily Mood Check-In (60-second morning ritual)
3. **F3** — Nuri: AI Cultural Mediator Chatbot
4. **F4** — Exam Schedule Planner with Wellness Integration
5. **F5** — Adaptive Soundscape & Therapy Game (5 modes)
6. **F6** — 7-Day Wellness Summary Report + Nunchi Heatmap (7×24)
7. **F7** — Session Tracking & Longitudinal Nunchi Profile

---

## 🎮 Therapy Game Modes

| Mode | Frequency | Theory | Target State |
|------|-----------|--------|-------------|
| Grounding | 4Hz theta | IMV Model | Entrapment |
| Storytelling | 6Hz theta | IMV pre-motivational | Defeat |
| Social Silence | 10Hz alpha | IPTS | Thwarted belonging |
| Release | 8Hz alpha | IPTS | Burdensomeness |
| Focus | 40Hz gamma | General | Neutral/focused |

---

## 🔐 Privacy Architecture

- Camera frames: processed in-browser via TensorFlow.js — never transmitted
- Session data: encrypted IndexedDB (local-first, no external servers by default)
- Cloud sync: optional, passphrase-protected, end-to-end encrypted
- No advertising, no data monetization
- No account required to start

---

## 🌍 Cultural Foundation

**눈치 (Nunchi)** — Korean: reading what's not said. Students read others perfectly but culture prevents self-expression.

**Curhat** — Indonesian: sharing emotional burdens openly. Vulnerability as strength.

Together → a complete emotional language. That's Nunchi.

---

## 📊 Why This Matters

- 221 student suicides in Korea in 2024 — highest ever recorded
- 32.9% of Korean teenagers report suicidal thoughts linked to exam pressure
- 0 Korean-language mental health apps available to general public in 2025
- 18.55% annual growth in Korea's digital mental health market — with no youth-facing entry point

---

## 🏆 SDG Alignment

| SDG Target | How Nunchi Delivers |
|-----------|-------------------|
| SDG 3.4 | Prevention-first emotional skill-building |
| SDG 3.5 | Early behavioral detection, warm escalation |
| SDG 3.8 | Free, no-registration access |
| SDG 4.7 | Cross-cultural empathy education |
| SDG 17.16 | Korea-Indonesia multi-stakeholder collaboration |

---

## ⚠️ Crisis Resources

This app is a wellness companion, not a crisis service. If you or someone you know needs immediate help:

- **Korea**: 자살예방상담전화 **1393** (24/7)
- **Indonesia**: Hotline Kemenkes **119 ext 8**

---

*Nunchi. Feel what's not said.*

Team NUNCHI (눈치) · 16th e-ICON World Contest · Korea × Indonesia
