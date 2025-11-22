"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/* Lucide Icons */
import {
  Gauge,
  LineChart,
  Globe,
  Settings2,
  Layers,
  FileText,
  BarChart3,
} from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();

  /* Sidebar links */
  const links = [
    { href: "/", label: "Scores", icon: <Gauge className="w-5 h-5" /> },
    { href: "/market", label: "Market", icon: <BarChart3 className="w-5 h-5" /> },
    { href: "/macro", label: "Macro", icon: <Globe className="w-5 h-5" /> },
    { href: "/technical", label: "Technisch", icon: <LineChart className="w-5 h-5" /> },
    { href: "/setup", label: "Setups", icon: <Settings2 className="w-5 h-5" /> },
    { href: "/strategy", label: "Strategieën", icon: <Layers className="w-5 h-5" /> },
    { href: "/report", label: "Rapport", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <aside
      className="
        fixed left-0 top-0 h-screen w-64 
        bg-[var(--primary-light)]
        border-r border-[var(--border)]
        flex flex-col p-5 shadow-md z-50 select-none
      "
    >
      {/* LOGO SECTION */}
      <div className="flex items-center gap-3 px-1 mb-10">
        <Image
          src="/logo.png"
          alt="TradeLayer Logo"
          width={34}
          height={34}
          className="object-contain rounded-md shadow-sm"
        />
        <span className="text-xl font-semibold text-[var(--text-dark)] tracking-tight">
          TradeLayer
        </span>
      </div>

      {/* LINKS */}
      <nav className="flex flex-col gap-1 relative">
        {links.map((item) => {
          const isActive = pathname === item.href;

          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              active={isActive}
              icon={item.icon}
            >
              {item.label}
            </SidebarItem>
          );
        })}
      </nav>

      <div className="flex-grow"></div>
    </aside>
  );
}

/* ---------------------- SIDEBAR ITEM ---------------------- */

function SidebarItem({ href, active, icon, children }) {
  return (
    <Link
      href={href}
      className="
        group flex items-center gap-3 px-4 py-2 
        text-sm font-medium rounded-lg relative
        transition-all duration-200
      "
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* ACTIVE Background */}
      {active && (
        <motion.div
          layoutId="active-pill"
          className="
            absolute inset-0 
            rounded-lg 
            bg-[var(--primary)]
            shadow-md
          "
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        />
      )}

      {/* Hover background (alleen inactief) */}
      {!active && (
        <div
          className="
            absolute inset-0 rounded-lg opacity-0 
            group-hover:opacity-100 
            group-hover:bg-[var(--primary-hover)]
            transition-all duration-200
          "
        />
      )}

      {/* ICON */}
      <span
        className={`
          relative z-10 
          transition-transform duration-200 
          group-hover:scale-110
          ${active ? "text-white" : "text-[var(--text-dark)]"}
        `}
      >
        {icon}
      </span>

      {/* TEXT */}
      <span
        className={`
          relative z-10 
          group-hover:translate-x-1 
          transition-all duration-200
          ${active ? "text-white" : "text-[var(--text-dark)]"}
        `}
      >
        {children}
      </span>
    </Link>
  );
}
