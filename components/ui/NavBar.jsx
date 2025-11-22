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
  Sun
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
        bg-[var(--primary-light)]/70
        backdrop-blur-xl
        border-r border-[var(--border)]
        rounded-r-3xl
        shadow-xl
        flex flex-col
        p-6
        z-50
      "
    >

      {/* LOGO */}
      <div className="flex items-center gap-3 mb-10 px-1">
        <div className="p-2 rounded-xl bg-white shadow-sm">
          <Image src="/logo.png" alt="logo" width={34} height={34} />
        </div>

        <div>
          <h1 className="text-lg font-semibold text-[var(--text-dark)] leading-none">
            TradeLayer
          </h1>
          <p className="text-xs text-[var(--text-light)] mt-1">
            AI Trading Suite
          </p>
        </div>
      </div>

      {/* LINKS */}
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

      {/* FOOTER BUTTONS */}
      <div className="mt-auto border-t border-[var(--border)] pt-5 flex flex-col gap-3">

        <button
          className="
            flex items-center gap-2 px-4 py-2 rounded-xl
            text-[var(--text-light)]
            hover:text-[var(--text-dark)]
            hover:bg-[var(--primary-hover)]
            transition-all
          "
        >
          <Settings size={18} />
          Instellingen
        </button>

        <button
          className="
            flex items-center gap-2 px-4 py-2 rounded-xl
            text-[var(--text-light)]
            hover:text-[var(--text-dark)]
            hover:bg-[var(--primary-hover)]
            transition-all
          "
        >
          <Sun size={18} />
          Thema
        </button>

      </div>

    </aside>
  );
}

/* -------------------- SIDEBAR ITEM -------------------- */

function SidebarItem({ href, icon, active, children }) {
  return (
    <Link
      href={href}
      className="relative group flex items-center px-3 py-2 rounded-xl gap-3 font-medium"
    >
      {/* ACTIVE BACKGROUND */}
      {active && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-[var(--primary)] rounded-xl shadow-md"
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        />
      )}

      {/* ICON */}
      <span
        className={`
          relative z-10 transition
          ${active ? "text-white" : "text-[var(--text-dark)] group-hover:scale-110"}
        `}
      >
        {icon}
      </span>

      {/* LABEL */}
      <span
        className={`
          relative z-10 transition-all
          ${
            active
              ? "text-white"
              : "text-[var(--text-dark)] group-hover:translate-x-1"
          }
        `}
      >
        {children}
      </span>
    </Link>
  );
}
