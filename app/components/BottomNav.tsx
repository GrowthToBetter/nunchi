"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

type NavItem = { href: string; iconPath: React.ReactNode; label: string; teacherOnly?: boolean };

const DOCK: NavItem[] = [
  {
    href: "/mood",
    label: "Check-in",
    iconPath: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></>,
  },
  {
    href: "/chat",
    label: "Nuri",
    iconPath: <><path d="M9.94 14.06 8 19l-1.94-4.94L1 12.13l4.95-1.94L8 5l1.94 4.95L15 12l-5.06 2.06zM18 4l.94 2.06L21 7l-2.06.94L18 10l-.94-2.06L15 7l2.06-.94L18 4z"/></>,
  },
  {
    href: "/therapy",
    label: "Therapy",
    iconPath: <><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="6"/></>,
  },
  {
    href: "/planner",
    label: "Planner",
    iconPath: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  },
];

const MORE_ITEMS: NavItem[] = [
  { href: "/study",     label: "Study",     iconPath: <><line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="14" x2="15" y2="11"/><circle cx="12" cy="14" r="8"/></> },
  { href: "/breaks",    label: "Breaks",    iconPath: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></> },
  { href: "/vent",      label: "Vent",      iconPath: <><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></> },
  { href: "/profile",   label: "Profile",   iconPath: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
  { href: "/dashboard", label: "Insight",   iconPath: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
  { href: "/denah",     label: "Floor plan", teacherOnly: true, iconPath: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></> },
  { href: "/teacher",   label: "Class map",  teacherOnly: true, iconPath: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
];

function NavIcon({ path, size = 22, active }: { path: React.ReactNode; size?: number; active: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={active ? 2.25 : 1.75}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {path}
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const [moreOpen, setMoreOpen] = useState(false);

  if (pathname === "/" || pathname === "/onboarding" || pathname === "/login") return null;

  const visibleMore = MORE_ITEMS.filter(i => !i.teacherOnly || role === "TEACHER");

  return (
    <>
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "var(--surface)", borderTop: "1px solid var(--border)",
        padding: "8px 12px calc(8px + env(safe-area-inset-bottom))",
        display: "flex", justifyContent: "space-around",
      }}>
        {DOCK.map(item => {
          const active = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMoreOpen(false)}
              style={{
                flex: 1, maxWidth: 84,
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                padding: "6px 4px",
                color: active ? "var(--accent)" : "var(--ink-3)",
                transition: "var(--t-fast)", textDecoration: "none",
              }}>
              <NavIcon path={item.iconPath} active={active} />
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 500 }}>{item.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", marginTop: -2 }}/>}
            </Link>
          );
        })}

        <button
          onClick={() => setMoreOpen(v => !v)}
          style={{
            flex: 1, maxWidth: 84,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: "6px 4px",
            color: moreOpen ? "var(--accent)" : "var(--ink-3)",
            transition: "var(--t-fast)",
          }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth={moreOpen ? 2.25 : 1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
          </svg>
          <span style={{ fontSize: 10, fontWeight: moreOpen ? 600 : 500 }}>More</span>
        </button>
      </nav>

      {moreOpen && (
        <div onClick={() => setMoreOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(10,10,15,0.4)",
          backdropFilter: "blur(6px)", zIndex: 60, display: "flex", alignItems: "flex-end",
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "var(--surface)", width: "100%",
            borderRadius: "24px 24px 0 0",
            padding: "20px 16px calc(20px + env(safe-area-inset-bottom))",
            border: "1px solid var(--border)", boxShadow: "var(--sh-4)",
          }}>
            <div style={{ width: 40, height: 4, borderRadius: 4, background: "var(--border-strong)", margin: "0 auto 16px" }}/>
            <div className="eyebrow" style={{ marginBottom: 12 }}>All features</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {visibleMore.map(item => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      padding: 14, borderRadius: 16,
                      background: active ? "var(--accent-soft)" : "var(--bg-2)",
                      color: active ? "var(--accent-ink)" : "var(--ink-2)",
                      textDecoration: "none",
                    }}>
                    <NavIcon path={item.iconPath} size={22} active={active} />
                    <span style={{ fontSize: 11, fontWeight: 500 }}>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
