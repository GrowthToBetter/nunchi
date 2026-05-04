"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Minus, BookOpen, Utensils, GraduationCap, Dumbbell,
  FlaskConical, Music, Trees, MonitorPlay, ArrowLeft, X, Send, MapPin,
} from "lucide-react";
import Link from "next/link";

type StressCategory = "HIGH_STRESS" | "WELLNESS_ZONE" | "HIGH_ENERGY" | "NEUTRAL";

type Zone = {
  id: string;
  name: string;
  category: StressCategory;
  icon: React.ElementType;
  col: number; row: number; colSpan: number; rowSpan: number;
  moodCounts?: { good: number; calm: number; stressed: number; low: number; anxious: number };
};

type Observation = { id: string; zoneId: string; note: string; timestamp: Date };

const CAT: Record<StressCategory, { bg: string; border: string; label: string; lc: string; dot: string }> = {
  HIGH_STRESS: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.15)", label: "HIGH STRESS", lc: "#dc2626", dot: "#ef4444" },
  WELLNESS_ZONE: { bg: "rgba(107,114,128,0.06)", border: "rgba(107,114,128,0.12)", label: "WELLNESS ZONE", lc: "#374151", dot: "#10b981" },
  HIGH_ENERGY: { bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.12)", label: "HIGH ENERGY", lc: "#92400e", dot: "#f59e0b" },
  NEUTRAL: { bg: "rgba(107,114,128,0.04)", border: "rgba(107,114,128,0.08)", label: "NEUTRAL", lc: "#6b7280", dot: "#9ca3af" },
};

const ZONES: Zone[] = [
  { id: "c1", name: "Classroom 1", category: "NEUTRAL", icon: GraduationCap, col: 1, row: 1, colSpan: 3, rowSpan: 2, moodCounts: { good: 8, calm: 12, stressed: 3, low: 1, anxious: 1 } },
  { id: "c2", name: "Classroom 2", category: "NEUTRAL", icon: GraduationCap, col: 4, row: 1, colSpan: 3, rowSpan: 2, moodCounts: { good: 10, calm: 8, stressed: 5, low: 2, anxious: 0 } },
  { id: "c3", name: "Classroom 3", category: "HIGH_STRESS", icon: GraduationCap, col: 1, row: 3, colSpan: 3, rowSpan: 4, moodCounts: { good: 2, calm: 3, stressed: 14, low: 4, anxious: 7 } },
  { id: "lib", name: "Library", category: "WELLNESS_ZONE", icon: BookOpen, col: 4, row: 3, colSpan: 4, rowSpan: 3, moodCounts: { good: 15, calm: 18, stressed: 1, low: 0, anxious: 0 } },
  { id: "lab", name: "Science Lab", category: "NEUTRAL", icon: FlaskConical, col: 8, row: 1, colSpan: 3, rowSpan: 3, moodCounts: { good: 6, calm: 9, stressed: 4, low: 2, anxious: 1 } },
  { id: "caf", name: "Cafeteria", category: "HIGH_ENERGY", icon: Utensils, col: 2, row: 7, colSpan: 5, rowSpan: 3, moodCounts: { good: 20, calm: 5, stressed: 2, low: 0, anxious: 1 } },
  { id: "gym", name: "Gymnasium", category: "HIGH_ENERGY", icon: Dumbbell, col: 8, row: 4, colSpan: 3, rowSpan: 3, moodCounts: { good: 12, calm: 3, stressed: 1, low: 0, anxious: 0 } },
  { id: "mus", name: "Music Room", category: "WELLNESS_ZONE", icon: Music, col: 8, row: 7, colSpan: 3, rowSpan: 2, moodCounts: { good: 9, calm: 14, stressed: 0, low: 1, anxious: 0 } },
  { id: "crt", name: "Courtyard", category: "WELLNESS_ZONE", icon: Trees, col: 11, row: 1, colSpan: 2, rowSpan: 4, moodCounts: { good: 11, calm: 16, stressed: 0, low: 0, anxious: 0 } },
  { id: "cmp", name: "Computer Lab", category: "NEUTRAL", icon: MonitorPlay, col: 11, row: 5, colSpan: 2, rowSpan: 4, moodCounts: { good: 7, calm: 10, stressed: 6, low: 3, anxious: 2 } },
];

const MOOD_COLORS = [
  { key: "good" as const, color: "#16a34a" },
  { key: "calm" as const, color: "#2563eb" },
  { key: "stressed" as const, color: "#ea580c" },
  { key: "low" as const, color: "#7c3aed" },
  { key: "anxious" as const, color: "#dc2626" },
];

export default function DenahPage() {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [showTagForm, setShowTagForm] = useState(false);
  const [tagNote, setTagNote] = useState("");
  const [observations, setObservations] = useState<Observation[]>([]);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 2.5));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));

  // Mouse pan
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-zone]")) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [pan]);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y });
  }, [isPanning]);
  const onMouseUp = useCallback(() => setIsPanning(false), []);

  // Touch pan
  const touchRef = useRef({ x: 0, y: 0 });
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("[data-zone]")) return;
    const t = e.touches[0];
    touchRef.current = { x: t.clientX - pan.x, y: t.clientY - pan.y };
  }, [pan]);
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    setPan({ x: t.clientX - touchRef.current.x, y: t.clientY - touchRef.current.y });
  }, []);

  // Zone click
  const clickZone = (zone: Zone, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedZone(zone);
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ x: r.right + 8, y: r.top + r.height / 2 });
  };

  // Submit observation
  const submitObs = () => {
    if (!tagNote.trim() || !selectedZone) return;
    setObservations(p => [
      { id: Date.now().toString(), zoneId: selectedZone.id, note: tagNote.trim(), timestamp: new Date() },
      ...p,
    ]);
    setTagNote("");
    setShowTagForm(false);
  };

  // Wheel zoom
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      setScale(s => Math.max(0.5, Math.min(2.5, s + (e.deltaY > 0 ? -0.1 : 0.1))));
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#fafaf8" }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-md border-b border-black/5 z-30 shrink-0">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>School Floor Plan</p>
          <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{ZONES.length} zones · Live mood data</p>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>
          <MapPin size={12} /> {observations.length} tags
        </div>
      </header>

      {/* Map area */}
      <div
        ref={mapRef}
        className="flex-1 relative overflow-hidden select-none"
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Pan + zoom container */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.2s ease",
          }}
        >
          {/* Grid: 12 cols × 10 rows, 56px each */}
          <div
            className="relative"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 56px)",
              gridTemplateRows: "repeat(10, 56px)",
              gap: "4px",
            }}
          >
            {ZONES.map((zone) => {
              const s = CAT[zone.category];
              const Icon = zone.icon;
              const sel = selectedZone?.id === zone.id;
              const hov = hoveredZone === zone.id;
              const total = zone.moodCounts
                ? Object.values(zone.moodCounts).reduce((a, b) => a + b, 0)
                : 0;
              const obsCount = observations.filter((o) => o.zoneId === zone.id).length;

              return (
                <motion.button
                  key={zone.id}
                  data-zone
                  onClick={(e) => clickZone(zone, e)}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  className="relative flex flex-col items-center justify-center text-center rounded-lg"
                  style={{
                    gridColumn: `${zone.col} / span ${zone.colSpan}`,
                    gridRow: `${zone.row} / span ${zone.rowSpan}`,
                    backgroundColor: s.bg,
                    border: `1.5px solid ${sel ? s.lc : s.border}`,
                    boxShadow: sel
                      ? `0 0 0 2px ${s.lc}30, 0 4px 16px ${s.lc}15`
                      : hov
                      ? "0 4px 16px rgba(0,0,0,0.06)"
                      : "none",
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {/* Category label */}
                  <span
                    className="text-[9px] font-medium tracking-[0.15em] uppercase mb-1"
                    style={{ color: s.lc, opacity: 0.7 }}
                  >
                    {s.label}
                  </span>

                  {/* Zone name */}
                  <span className="text-sm font-medium mb-2" style={{ color: s.lc }}>
                    {zone.name}
                  </span>

                  {/* Icon */}
                  <Icon size={24} strokeWidth={1.5} style={{ color: s.dot, opacity: 0.6 }} />

                  {/* Mood indicator dots */}
                  {zone.moodCounts && (
                    <div className="flex items-center gap-1 mt-2">
                      {zone.moodCounts.stressed + zone.moodCounts.anxious > 5 && (
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                      )}
                      {zone.moodCounts.good + zone.moodCounts.calm > 10 && (
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                      {total > 0 && (
                        <span className="text-[9px] ml-0.5" style={{ color: s.lc, opacity: 0.5 }}>
                          {total}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Obs badge */}
                  {obsCount > 0 && (
                    <div
                      className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-medium text-white"
                      style={{ backgroundColor: s.lc }}
                    >
                      {obsCount}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* "NEW OBSERVATION" floating tooltip */}
        <AnimatePresence>
          {selectedZone && !showTagForm && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="fixed z-40"
              style={{
                top: Math.min(tooltipPos.y - 28, typeof window !== "undefined" ? window.innerHeight - 80 : 600),
                left: Math.min(tooltipPos.x, typeof window !== "undefined" ? window.innerWidth - 220 : 600),
              }}
            >
              <button
                onClick={() => setShowTagForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-black/8 text-left transition-all hover:shadow-lg active:scale-95"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                    New Observation
                  </p>
                  <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    Click to tag area
                  </p>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tag form modal */}
        <AnimatePresence>
          {showTagForm && selectedZone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
              onClick={() => setShowTagForm(false)}
            >
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm bg-white rounded-3xl p-6 border border-black/5"
                style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.12)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                      Tag Observation
                    </p>
                    <p className="text-base font-medium mt-0.5" style={{ color: "var(--text-primary)" }}>
                      {selectedZone.name}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTagForm(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <textarea
                  value={tagNote}
                  onChange={(e) => setTagNote(e.target.value)}
                  placeholder="What did you observe? (e.g. 'Students seem tense before math exam')"
                  rows={3}
                  className="w-full bg-black/[0.03] border border-black/[0.06] rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#5a70f3]/30 transition-colors"
                  style={{ color: "var(--text-primary)" }}
                  autoFocus
                />

                <div className="flex items-center justify-between mt-4">
                  <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Visible to teachers only</p>
                  <button
                    onClick={submitObs}
                    disabled={!tagNote.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-30 active:scale-95"
                    style={{ backgroundColor: "#5a70f3" }}
                  >
                    <Send size={14} /> Tag
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-1 z-30">
          <button
            onClick={zoomIn}
            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-black/8 hover:shadow-md active:scale-95"
            style={{ color: "var(--text-primary)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <Plus size={18} />
          </button>
          <button
            onClick={zoomOut}
            className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-black/8 hover:shadow-md active:scale-95"
            style={{ color: "var(--text-primary)", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            <Minus size={18} />
          </button>
        </div>

        {/* Scale indicator */}
        <div className="absolute bottom-6 left-6 z-30">
          <span
            className="text-[10px] font-medium px-2 py-1 rounded-lg bg-white border border-black/8"
            style={{ color: "var(--text-secondary)" }}
          >
            {Math.round(scale * 100)}%
          </span>
        </div>
      </div>

      {/* Selected zone detail panel */}
      <AnimatePresence>
        {selectedZone && !showTagForm && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-30"
          >
            <div
              className="bg-white rounded-2xl p-5 border border-black/5"
              style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: CAT[selectedZone.category].bg }}
                  >
                    <selectedZone.icon size={16} style={{ color: CAT[selectedZone.category].dot }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {selectedZone.name}
                    </p>
                    <p
                      className="text-[10px] font-medium uppercase tracking-wider"
                      style={{ color: CAT[selectedZone.category].lc }}
                    >
                      {CAT[selectedZone.category].label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Mood breakdown chips */}
              {selectedZone.moodCounts && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {MOOD_COLORS.map((m) => {
                    const c = selectedZone.moodCounts![m.key];
                    if (c === 0) return null;
                    return (
                      <div
                        key={m.key}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium"
                        style={{ backgroundColor: m.color + "10", color: m.color }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }} />
                        {c}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Recent observations */}
              {observations.filter((o) => o.zoneId === selectedZone.id).length > 0 && (
                <div className="border-t border-black/5 pt-3 mt-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: "var(--text-secondary)" }}>
                    Recent observations
                  </p>
                  {observations
                    .filter((o) => o.zoneId === selectedZone.id)
                    .slice(0, 3)
                    .map((o) => (
                      <p key={o.id} className="text-xs leading-relaxed mb-1" style={{ color: "var(--text-secondary)" }}>
                        {o.note}
                      </p>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
