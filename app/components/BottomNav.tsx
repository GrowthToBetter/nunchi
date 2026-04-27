"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/mood",     icon: "🌅", label: "Check-in"  },
  { href: "/planner",  icon: "📅", label: "Planner"   },
  { href: "/therapy",  icon: "🎮", label: "Therapy"   },
  { href: "/chat",     icon: "🌙", label: "Nuri"      },
  { href: "/profile",  icon: "◉",  label: "Profile"   },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Sembunyikan di onboarding & home (punya UI sendiri)
  if (pathname === "/" || pathname === "/onboarding") return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: "rgba(250,250,248,0.92)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {NAV.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all"
            style={{
              color: active ? "var(--accent-blue)" : "var(--text-secondary)",
              opacity: active ? 1 : 0.55,
            }}
          >
            <span
              className="text-xl leading-none transition-transform"
              style={{ transform: active ? "translateY(-1px)" : "none" }}
            >
              {item.icon}
            </span>
            <span
              className="text-[10px] font-medium tracking-wide"
              style={{ letterSpacing: "0.03em" }}
            >
              {item.label}
            </span>
            {active && (
              <span
                className="absolute bottom-0 w-6 h-0.5 rounded-full"
                style={{ background: "var(--accent-blue)" }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}