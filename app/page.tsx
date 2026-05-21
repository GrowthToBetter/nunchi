"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

// ─── Icons (inline SVG, Lucide-style) ───────────────────────
function IcoSun() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>;
}
function IcoSparkles() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9.94 14.06 8 19l-1.94-4.94L1 12.13l4.95-1.94L8 5l1.94 4.95L15 12l-5.06 2.06zM18 4l.94 2.06L21 7l-2.06.94L18 10l-.94-2.06L15 7l2.06-.94L18 4z"/></svg>;
}
function IcoCalendar() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
}
function IcoGamepad() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="6"/></svg>;
}
function IcoUser() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function IcoEye() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
}
function IcoPen() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>;
}
function IcoTimer() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="14" x2="15" y2="11"/><circle cx="12" cy="14" r="8"/></svg>;
}
function IcoMap() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
}
function IcoActivity() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
}
function IcoArrowRight() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}
function IcoShield() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning.";
  if (h < 17) return "Good afternoon.";
  return "Good evening.";
}

// ─── Main export ─────────────────────────────────────────────
export default function Home() {
  const [isReturning, setIsReturning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsReturning(!!localStorage.getItem("nunchi_visited"));
  }, []);

  if (!mounted) return null;
  return isReturning ? <ReturningHome /> : <FirstVisitHome />;
}

// ─── FIRST VISIT ──────────────────────────────────────────────
function FirstVisitHome() {
  const mark = () => localStorage.setItem("nunchi_visited", "true");

  return (
    <div style={{
      position: "relative", minHeight: "100vh",
      display: "grid", placeItems: "center",
      padding: 24, background: "var(--bg)",
    }}>
      {/* Ambient rings */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0,
      }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "50%",
            width: `${240 + i * 120}px`, height: `${240 + i * 120}px`,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px solid rgba(90,112,243,0.08)",
            animation: `ringPulse${i} ${14 + i * 3}s ease-in-out infinite`,
            opacity: 0.18 - i * 0.025,
          }}/>
        ))}
      </div>

      <div className="nch-glass nuri-pop" style={{
        position: "relative", zIndex: 2,
        maxWidth: 480, width: "100%",
        padding: 48, borderRadius: 32,
        textAlign: "center", boxShadow: "var(--sh-4)",
      }}>
        {/* Wordmark */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontSize: 84, lineHeight: 1, fontWeight: 700,
            color: "var(--accent)", letterSpacing: "-0.03em",
            fontFamily: "var(--font-sans)", marginBottom: 8,
          }}>눈치</div>
          <div className="eyebrow" style={{ fontSize: 11 }}>NUNCHI · 16TH e-ICON</div>
        </div>

        <div className="nch-serif" style={{
          fontSize: 26, lineHeight: 1.3,
          color: "var(--ink-2)", marginBottom: 48, fontStyle: "italic",
        }}>Feel what&apos;s not said.</div>

        <p style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 32, lineHeight: 1.6, padding: "0 12px" }}>
          A wellness companion that bridges Korean{" "}
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>nunchi</span> and Indonesian{" "}
          <span style={{ color: "var(--warm)", fontWeight: 600 }}>curhat</span>.
          Read what&apos;s not said. Share when you&apos;re ready.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/mood" onClick={mark} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "16px 24px", borderRadius: 16, fontSize: 15, fontWeight: 600,
            background: "var(--accent)", color: "var(--on-accent)",
            boxShadow: "var(--sh-accent)", transition: "var(--t-fast)",
          }}>
            Just feel it <IcoArrowRight />
          </Link>
          <Link href="/onboarding" onClick={mark} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "14px 20px", borderRadius: 14, fontSize: 14, fontWeight: 600,
            background: "var(--surface)", color: "var(--ink)",
            border: "1px solid var(--border-strong)", transition: "var(--t-fast)",
          }}>
            Show me how it works
          </Link>
        </div>

        <div style={{
          marginTop: 32, paddingTop: 20,
          borderTop: "1px solid var(--border)",
          fontSize: 11, color: "var(--ink-3)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <IcoShield /> No account · No sign-up · Stays on your device
        </div>
      </div>

      <style>{`
        ${[0,1,2,3,4].map(i => `
          @keyframes ringPulse${i} {
            0%,100% { transform: translate(-50%,-50%) scale(0.95); opacity: ${0.16 - i*0.02}; }
            50% { transform: translate(-50%,-50%) scale(1.08); opacity: ${0.30 - i*0.03}; }
          }
        `).join("")}
      `}</style>
    </div>
  );
}

// ─── RETURNING USER ───────────────────────────────────────────
const CARDS = [
  { href: "/mood",      Icon: IcoSun,      label: "Check-in",   sub: "How are you carrying today?",  primary: true },
  { href: "/chat",      Icon: IcoSparkles, label: "Nuri",       sub: "Talk it out" },
  { href: "/therapy",   Icon: IcoGamepad,  label: "Therapy",    sub: "Soundscape & game" },
  { href: "/planner",   Icon: IcoCalendar, label: "Planner",    sub: "Study with wellness" },
  { href: "/study",     Icon: IcoTimer,    label: "Study",      sub: "Pomodoro & focus" },
  { href: "/breaks",    Icon: IcoEye,      label: "Breaks",     sub: "Eyes, stretch, posture" },
  { href: "/vent",      Icon: IcoPen,      label: "Vent",       sub: "Write it out privately" },
  { href: "/profile",   Icon: IcoUser,     label: "Profile",    sub: "Your nunchi report" },
  { href: "/dashboard", Icon: IcoActivity, label: "Insight",    sub: "7-day balance" },
  { href: "/denah",     Icon: IcoMap,      label: "Floor plan", sub: "School mood map", teacherOnly: true },
];

function ReturningHome() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const [greet, setGreet] = useState("Welcome back.");

  useEffect(() => {
    setGreet(getGreeting());
  }, []);

  const primary = CARDS[0];
  const grid = CARDS.slice(1).filter(c => !c.teacherOnly || role === "TEACHER");

  return (
    <div style={{ minHeight: "100vh", padding: "32px 20px 80px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>Welcome back</div>
        <h1 style={{
          fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 700,
          letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 8,
        }}>{greet}</h1>
        <p style={{ fontSize: 15, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 6 }}>
          <IcoSparkles /> Nuri is here.
        </p>
      </div>

      {/* Primary card */}
      <Link href={primary.href} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        padding: "28px 24px", borderRadius: 24, marginBottom: 16,
        background: "linear-gradient(135deg, var(--accent), var(--accent-ink))",
        color: "white", boxShadow: "var(--sh-accent)",
        position: "relative", overflow: "hidden",
        textDecoration: "none",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -40,
          width: 200, height: 200, borderRadius: "50%",
          background: "rgba(255,255,255,0.10)",
        }}/>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{primary.label}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>60 seconds · {primary.sub}</div>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: 16, flexShrink: 0,
          background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
          display: "grid", placeItems: "center", position: "relative", zIndex: 1,
        }}>
          <primary.Icon />
        </div>
      </Link>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 12,
      }}>
        {grid.map(c => (
          <Link key={c.href} href={c.href} className="nch-card card-hover" style={{
            padding: 18, textAlign: "left",
            display: "flex", flexDirection: "column", gap: 10,
            textDecoration: "none",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "var(--accent-soft)", color: "var(--accent)",
              display: "grid", placeItems: "center",
            }}>
              <c.Icon />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{c.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats footer */}
      <div className="nch-card-soft" style={{
        marginTop: 32, padding: 20,
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 16,
      }}>
        {[
          { k: "3",  v: "day streak",     color: "var(--accent)" },
          { k: "72", v: "wellness score", color: "var(--warm)" },
          { k: "6",  v: "curhat saved",   color: "var(--ink)" },
          { k: "14", v: "breaks taken",   color: "var(--ink)" },
        ].map(s => (
          <div key={s.v}>
            <div className="nch-mono" style={{ fontSize: 26, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.k}</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>

      <button onClick={() => { localStorage.removeItem("nunchi_visited"); window.location.reload(); }}
        style={{
          marginTop: 24, display: "block", margin: "24px auto 0",
          fontSize: 11, color: "var(--ink-3)", padding: "6px 14px",
          borderRadius: 999, border: "1px solid var(--border)",
        }}>
        Reset experience
      </button>
    </div>
  );
}
