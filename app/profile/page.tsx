"use client";

import { useState } from "react";
import Link from "next/link";

const WEEKLY_DATA = [
  { day: "Mon", nunchi: 72, expression: 45 },
  { day: "Tue", nunchi: 68, expression: 50 },
  { day: "Wed", nunchi: 80, expression: 38 },
  { day: "Thu", nunchi: 75, expression: 42 },
  { day: "Fri", nunchi: 71, expression: 60 },
  { day: "Sat", nunchi: 65, expression: 70 },
  { day: "Sun", nunchi: 69, expression: 68 },
];

const avgNunchi = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.nunchi, 0) / WEEKLY_DATA.length);
const avgExpr = Math.round(WEEKLY_DATA.reduce((s, d) => s + d.expression, 0) / WEEKLY_DATA.length);
const gap = avgNunchi - avgExpr;

function genHeatmap() {
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(() =>
    Array.from({ length: 24 }, (_, h) => {
      if (h >= 21 && h <= 23) return Math.random() * 0.4 + 0.5;
      if (h >= 0 && h <= 3) return Math.random() * 0.5 + 0.4;
      if (h >= 7 && h <= 9) return Math.random() * 0.3 + 0.2;
      return Math.random() * 0.25;
    })
  );
}

const HEATMAP_DATA = genHeatmap();

function heatColor(v: number) {
  if (v < 0.15) return "var(--heat-empty)";
  if (v < 0.3) return "var(--heat-low)";
  if (v < 0.5) return "var(--heat-mid)";
  if (v < 0.7) return "var(--heat-high)";
  return "var(--heat-peak)";
}

const HIGHLIGHTS = [
  { emoji: "👁️", text: "On Wednesday, you picked up your friend's anxiety before they said anything — that's strong nunchi." },
  { emoji: "🌙", text: "You've been most expressive late at night. Nuri noticed — and isn't judging." },
  { emoji: "📈", text: "Expression Openness increased 8 points from last week. Small, but real." },
];

const RECS = [
  { emoji: "🌊", title: "Try Grounding Mode today", sub: "Your late-night pattern suggests tension building", href: "/therapy" },
  { emoji: "💬", title: "Talk to Nuri about the gap", sub: "Reading others vs expressing yourself", href: "/chat" },
  { emoji: "📅", title: "Set a pre-exam wellness buffer", sub: "14 days out — highest risk window", href: "/planner" },
];

export default function ProfilePage() {
  const [tab, setTab] = useState<"profile" | "heatmap" | "report">("profile");

  return (
    <div style={{ minHeight: "100%", background: "var(--bg)" }}>
      <div style={{ padding: "20px 20px 0", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div className="eyebrow">Nunchi Profile</div>
          <button style={{ padding: 8, borderRadius: 999, color: "var(--ink-3)" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 14, background: "var(--surface-2)", marginBottom: 24 }}>
          {([
            { id: "profile" as const, label: "My Profile" },
            { id: "heatmap" as const, label: "Heatmap" },
            { id: "report" as const, label: "Weekly Report" },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 12px", borderRadius: 10,
              background: tab === t.id ? "var(--surface)" : "transparent",
              color: tab === t.id ? "var(--accent)" : "var(--ink-3)",
              fontWeight: tab === t.id ? 700 : 500, fontSize: 13,
              boxShadow: tab === t.id ? "var(--sh-1)" : "none",
              transition: "var(--t-fast)",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 20px 100px", maxWidth: 720, margin: "0 auto" }}>
        {tab === "profile" && <ProfileTab />}
        {tab === "heatmap" && <HeatmapTab />}
        {tab === "report" && <ReportTab />}
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Two-circle SVG viz */}
      <div className="nch-card" style={{ padding: 24, borderRadius: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>Your Emotional Balance</h2>
        <p style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 24 }}>The gap between circles is your wellness signal</p>

        <div style={{ position: "relative", height: 200, marginBottom: 16 }}>
          <svg viewBox="0 0 320 200" style={{ width: "100%", height: "100%" }}>
            <defs>
              <radialGradient id="rg1" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#5A70F3" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#5A70F3" stopOpacity="0.08"/>
              </radialGradient>
              <radialGradient id="rg2" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#FF8A2A" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#FF8A2A" stopOpacity="0.08"/>
              </radialGradient>
            </defs>
            <circle cx="118" cy="100" r="78" fill="url(#rg1)" stroke="#5A70F3" strokeWidth="1.5"/>
            <circle cx="202" cy="100" r="78" fill="url(#rg2)" stroke="#FF8A2A" strokeWidth="1.5"/>
            <text x="82" y="88" textAnchor="middle" fontSize="11" fontWeight="600" fill="#2A3585">Reading</text>
            <text x="82" y="104" textAnchor="middle" fontSize="11" fill="#5A70F3">Others</text>
            <text x="82" y="130" textAnchor="middle" fontSize="26" fontWeight="700" fill="#2A3585">{avgNunchi}</text>
            <text x="238" y="88" textAnchor="middle" fontSize="11" fontWeight="600" fill="#9E4116">Expressing</text>
            <text x="238" y="104" textAnchor="middle" fontSize="11" fill="#FF8A2A">Self</text>
            <text x="238" y="130" textAnchor="middle" fontSize="26" fontWeight="700" fill="#9E4116">{avgExpr}</text>
            <text x="160" y="180" textAnchor="middle" fontSize="10" fill="var(--ink-3)">connection</text>
          </svg>
        </div>

        <div style={{
          padding: 14, borderRadius: 14,
          background: gap > 25 ? "var(--warn-soft)" : "var(--good-soft)",
          border: `1px solid ${gap > 25 ? "rgba(234,88,12,0.3)" : "rgba(22,163,74,0.3)"}`,
        }}>
          <p style={{ fontSize: 12, lineHeight: 1.5, color: gap > 25 ? "var(--warn)" : "var(--good)", fontWeight: 500 }}>
            {gap > 25
              ? `You read others ${gap} points better than you express yourself. This gap is what Nuri is here to bridge.`
              : `Your reading and expressing are in good balance this week. Keep nurturing both.`}
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="nch-card" style={{ padding: 24, borderRadius: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: "var(--ink)" }}>This Week&apos;s Trend</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>
          {WEEKLY_DATA.map(d => (
            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 2, width: "100%" }}>
                <div style={{ background: "var(--accent)", borderRadius: "3px 3px 0 0", height: `${(d.nunchi / 100) * 80}px` }}/>
                <div style={{ background: "var(--warm)", borderRadius: "0 0 3px 3px", height: `${(d.expression / 100) * 80}px`, marginTop: 2 }}/>
              </div>
              <span style={{ fontSize: 10, color: "var(--ink-3)" }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
          {[{ color: "var(--accent)", label: "Reading Others" }, { color: "var(--warm)", label: "Expressing Self" }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--ink-3)" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }}/>
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Link href="/chat" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          padding: 20, borderRadius: 20, textDecoration: "none",
          background: "var(--accent-soft)", border: "1px solid rgba(90,112,243,0.2)",
          transition: "var(--t-fast)",
        }}>
          <span style={{ fontSize: 24 }}>💬</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-ink)" }}>Talk to Nuri</span>
        </Link>
        <Link href="/therapy" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          padding: 20, borderRadius: 20, textDecoration: "none",
          background: "var(--warm-soft)", border: "1px solid rgba(255,138,42,0.2)",
          transition: "var(--t-fast)",
        }}>
          <span style={{ fontSize: 24 }}>🎮</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--warm-ink)" }}>Therapy Space</span>
        </Link>
      </div>
    </div>
  );
}

function HeatmapTab() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [hovered, setHovered] = useState<{ day: string; hour: number; val: number } | null>(null);

  return (
    <div className="nch-card" style={{ padding: 20, borderRadius: 24 }}>
      <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>Nunchi Heatmap</h2>
      <p style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 16 }}>
        7×24 grid — when your expression openness is highest and lowest. Timing itself is a behavioral signal.
      </p>

      {hovered && (
        <div className="nuri-pop" style={{
          marginBottom: 12, padding: "8px 12px", borderRadius: 10,
          background: "var(--accent-soft)", border: "1px solid var(--accent)",
          fontSize: 11, color: "var(--accent-ink)",
        }}>
          <strong>{hovered.day}</strong> at {hovered.hour}:00 — {
            hovered.val < 0.15 ? "Very low expression" :
            hovered.val < 0.3 ? "Low expression" :
            hovered.val < 0.5 ? "Moderate openness" :
            hovered.val < 0.7 ? "High openness" : "Peak expression — notable timing"
          }
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 540 }}>
          <div style={{ display: "flex", marginLeft: 36, marginBottom: 4 }}>
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} style={{ flex: 1, fontSize: 8, color: "var(--ink-3)", textAlign: "center" }}>
                {h % 3 === 0 ? h : ""}
              </div>
            ))}
          </div>
          {days.map((d, di) => (
            <div key={d} style={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
              <div style={{ width: 36, fontSize: 10, color: "var(--ink-3)", flexShrink: 0 }}>{d}</div>
              <div style={{ flex: 1, display: "flex", gap: 2 }}>
                {Array.from({ length: 24 }).map((_, h) => {
                  const v = HEATMAP_DATA[di][h];
                  return (
                    <div
                      key={h}
                      style={{ flex: 1, aspectRatio: "1", borderRadius: 3, background: heatColor(v), cursor: "pointer", transition: "transform 80ms" }}
                      onMouseEnter={e => { setHovered({ day: d, hour: h, val: v }); (e.currentTarget as HTMLDivElement).style.transform = "scale(1.4)"; }}
                      onMouseLeave={e => { setHovered(null); (e.currentTarget as HTMLDivElement).style.transform = ""; }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
        <span style={{ fontSize: 10, color: "var(--ink-3)" }}>Low</span>
        {["var(--heat-empty)", "var(--heat-low)", "var(--heat-mid)", "var(--heat-high)", "var(--heat-peak)"].map(c => (
          <div key={c} style={{ width: 20, height: 12, borderRadius: 3, background: c }}/>
        ))}
        <span style={{ fontSize: 10, color: "var(--ink-3)" }}>High</span>
      </div>

      <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: "var(--warn-soft)", border: "1px solid rgba(234,88,12,0.3)" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--warn-ink)", marginBottom: 4 }}>🌙 Late-night signal detected</p>
        <p style={{ fontSize: 11, color: "var(--warn-ink)", lineHeight: 1.5 }}>
          You tend to open up between midnight–3 AM — a behavioral signature that standard questionnaires never capture. Nuri has noticed.
        </p>
      </div>
    </div>
  );
}

function ReportTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{
        padding: 24, borderRadius: 24,
        background: "linear-gradient(135deg, var(--accent-soft), var(--warm-soft))",
        border: "1px solid var(--border)",
      }}>
        <div className="eyebrow" style={{ color: "var(--accent)", marginBottom: 8 }}>This week&apos;s Nunchi insight</div>
        <p className="nch-serif" style={{ fontSize: 18, lineHeight: 1.5, fontStyle: "italic", color: "var(--ink)" }}>
          Your ability to read others is strong — but you&apos;re carrying more alone than you need to. The gap is closing.
        </p>
      </div>

      <div className="nch-card" style={{ padding: 20, borderRadius: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "var(--ink)" }}>Highlights</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {HIGHLIGHTS.map((h, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{h.emoji}</span>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink-2)" }}>{h.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="nch-card" style={{ padding: 20, borderRadius: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: "var(--ink)" }}>Share with parent / counselor</h3>
            <p style={{ fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5 }}>
              Generates a summary about &ldquo;study focus and emotional readiness&rdquo; — no clinical language
            </p>
          </div>
          <button style={{
            padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
            background: "var(--accent-soft)", color: "var(--accent-ink)",
            border: "1px solid rgba(90,112,243,0.2)",
          }}>Export PDF</button>
        </div>
      </div>

      <div className="nch-card" style={{ padding: 20, borderRadius: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "var(--ink)" }}>Personalized recommendations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {RECS.map((r, i) => (
            <Link key={i} href={r.href} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: 12, borderRadius: 12,
              background: "var(--surface-2)", textDecoration: "none",
              transition: "var(--t-fast)",
            }}
              onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-soft)"}
              onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-2)"}>
              <span style={{ fontSize: 18 }}>{r.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{r.title}</p>
                <p style={{ fontSize: 11, color: "var(--ink-3)" }}>{r.sub}</p>
              </div>
              <span style={{ color: "var(--ink-3)", fontSize: 16 }}>→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
