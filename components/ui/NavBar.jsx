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
    { href: "/report", label: "Rapporten", icon: <FileText size={18} /> },
  ];

  return (
    <aside
      className="
        sidebar-surface
        fixed top-0 left-0
        z-50
        h-screen w-64
        flex flex-col
      "
    >
      {/* ======================= */}
      {/* Scrollable content      */}
      {/* ======================= */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        {/* LOGO + TEXT */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 rounded-xl bg-white shadow-sm">
            <Image src="/logo.png" alt="logo" width={34} height={34} />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-[var(--sidebar-text)]">
              TradeLayer
            </h1>
            <p className="text-xs text-[var(--sidebar-text-muted)]">
              AI Trading Suite
            </p>
          </div>
        </div>

        {/* ======================= */}
        {/* NAVIGATION LINKS       */}
        {/* ======================= */}
        <nav className="flex flex-col gap-1">
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
      </div>

      {/* ======================= */}
      {/* FOOTER SETTINGS        */}
      {/* ======================= */}
      <div className="border-t border-[var(--sidebar-border)] px-6 py-5 flex flex-col gap-3">
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

function SidebarItem({ href, icon, active, children }) {
  return (
    <Link
      href={href}
      className="
        relative group
        flex items-center gap-3
        px-4 py-2.5
        rounded-xl text-sm
        cursor-pointer select-none
        transition-all
      "
    >
      {active && (
        <motion.div
          layoutId="sidebar-pill"
          className="
            absolute inset-0 rounded-xl
            bg-[var(--sidebar-active)]
            shadow-[inset_0_0_8px_rgba(255,255,255,0.12)]
            backdrop-blur-sm
          "
        />
      )}

      <span
        className={`
          relative z-10
          ${active
            ? "text-[var(--sidebar-text)]"
            : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]"}
        `}
      >
        {icon}
      </span>

      <span
        className={`
          relative z-10
          ${active
            ? "text-[var(--sidebar-text)] font-semibold"
            : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]"}
        `}
      >
        {children}
      </span>
    </Link>
  );
}

function SidebarFooterButton({ icon, children }) {
  return (
    <button
      className="
        flex items-center gap-3
        px-4 py-2 rounded-xl
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
