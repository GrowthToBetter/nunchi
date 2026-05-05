"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Sun, Calendar, Gamepad2, Sparkles, User, Map } from "lucide-react";

type NavItem = { href: string; icon: any; label: string; teacherOnly?: boolean };

const NAV: NavItem[] = [
  { href: "/mood",     icon: Sun,       label: "Check-in" },
  { href: "/planner",  icon: Calendar,  label: "Planner"  },
  { href: "/denah",    icon: Map,       label: "Denah", teacherOnly: true },
  { href: "/therapy",  icon: Gamepad2,  label: "Therapy"  },
  { href: "/chat",     icon: Sparkles,  label: "Nuri"     },
  { href: "/profile",  icon: User,      label: "Profile"  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  // Hide on these pages
  if (pathname === "/" || pathname === "/onboarding" || pathname === "/login") return null;

  // Filter nav items based on role
  const visibleNav = NAV.filter((item) => {
    if (item.teacherOnly && role !== "TEACHER") return false;
    return true;
  });

  return (
    <div className="fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="flex items-center gap-1 sm:gap-2 px-2 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.8)]"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 100%)",
          backdropFilter: "blur(24px) saturate(200%)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
        }}
      >
        {visibleNav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group flex items-center justify-center w-12 h-12 rounded-full transition-colors duration-300"
              style={{
                color: active ? "var(--accent-blue)" : "var(--text-secondary)",
              }}
            >
              {/* Hover background */}
              <div 
                className={`absolute inset-0 rounded-full transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                style={{ background: active ? "rgba(90, 112, 243, 0.1)" : "rgba(0,0,0,0.03)" }} 
              />

              <Icon 
                size={22} 
                strokeWidth={active ? 2.5 : 2} 
                className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-active:scale-95"
              />
              
              {/* Tooltip */}
              <span className="absolute -top-12 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 px-3 py-1.5 bg-white text-[11px] font-medium text-[var(--text-primary)] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] whitespace-nowrap pointer-events-none">
                {item.label}
              </span>
              
              {/* Animated active indicator */}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}