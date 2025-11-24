"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Gauge,
  DollarSign,
  Globe,
  LineChart,
  Layers,
  BarChart3,
  FileText,
  Settings,
  Sun,
} from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Scores", icon: <Gauge size={18} /> },
    { href: "/market", label: "Market", icon: <DollarSign size={18} /> },
    { href: "/macro", label: "Macro", icon: <Globe size={18} /> },
    { href: "/technical", label: "Technisch", icon: <LineChart size={18} /> },
    { href: "/setup", label: "Setups", icon: <Layers size={18} /> },
    { href: "/strategy", label: "Strategieën", icon: <BarChart3 size={18} /> },
    { href: "/report", label: "Rapport", icon: <FileText size={18} /> },
  ];

  return (
    <aside
      className="
        fixed left-0 top-0 h-screen w-64
        bg-[var(--sidebar-bg)]
        border-r border-[var(--sidebar-border)]
        flex flex-col
        p-6
        z-50

        /* depth */
        shadow-[var(--surface-shadow)]
        before:absolute before:inset-0 before:bg-[var(--surface-glow)]
        before:pointer-events-none
      "
    >
      {/* Logo */}
      <div className="relative flex items-center gap-3 mb-12 px-1">
        <div className="p-2 rounded-xl bg-white/95 shadow-md">
          <Image src="/logo.png" alt="logo" width={34} height={34} />
        </div>

        <div>
          <h1 className="text-lg font-semibold text-[var(--sidebar-text)] leading-none">
            TradeLayer
          </h1>
          <p className="text-xs text-[var(--sidebar-text-muted)] mt-1">
            AI Trading Suite
          </p>
        </div>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            active={pathname === item.href}
          >
            {item.label}
          </SidebarItem>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="
          mt-auto 
          border-t border-[var(--sidebar-border)]
          pt-5 
          flex flex-col gap-3
        "
      >
        <SidebarFooterButton icon={<Settings size={18} />}>
          Instellingen
        </SidebarFooterButton>

        <SidebarFooterButton icon={<Sun size={18} />}>
          Thema
        </SidebarFooterButton>
      </div>
    </aside>
  );
}

/* ------------------------------
   SIDEBAR ITEM
--------------------------------*/
function SidebarItem({ href, icon, active, children }) {
  return (
    <Link
      href={href}
      className="
        relative group 
        flex items-center px-4 py-2.5 
        rounded-xl gap-3 font-medium text-sm
        cursor-pointer select-none
        transition-all
      "
    >
      {/* Active pill with glow */}
      {active && (
        <motion.div
          layoutId="active-pill"
          className="
            absolute inset-0 rounded-xl
            bg-[var(--sidebar-active)]
            shadow-[inset_0_0_8px_rgba(255,255,255,0.08)]
            backdrop-blur-sm
          "
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        />
      )}

      {/* Icon */}
      <span
        className={`
          relative z-10 transition-all
          ${
            active
              ? "text-[var(--sidebar-text)]"
              : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]"
          }
        `}
      >
        {icon}
      </span>

      {/* Label */}
      <span
        className={`
          relative z-10 transition-all
          ${
            active
              ? "text-[var(--sidebar-text)] font-semibold"
              : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]"
          }
        `}
      >
        {children}
      </span>
    </Link>
  );
}

/* ------------------------------
   FOOTER BUTTON
--------------------------------*/
function SidebarFooterButton({ icon, children }) {
  return (
    <button
      className="
        flex items-center gap-3 px-4 py-2 rounded-xl
        text-[var(--sidebar-text-muted)]
        hover:text-[var(--sidebar-text)]
        hover:bg-[var(--sidebar-hover)]
        transition-all
      "
    >
      {icon}
      {children}
    </button>
  );
}
