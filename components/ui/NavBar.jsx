"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Scores", icon: "🌡️" },
    { href: "/market", label: "Market", icon: "💰" },
    { href: "/macro", label: "Macro", icon: "🌍" },
    { href: "/technical", label: "Technisch", icon: "📈" },
    { href: "/setup", label: "Setups", icon: "⚙️" },
    { href: "/strategy", label: "Strategieën", icon: "📊" },
    { href: "/report", label: "Rapport", icon: "📄" },
  ];

  return (
    <aside
      className="
        fixed left-0 top-0 h-screen w-64 
        bg-[var(--primary-light)]
        border-r border-[var(--border)]
        flex flex-col p-4 shadow-sm z-50 select-none
      "
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3 px-2 mb-10 mt-2">
        <Image src="/logo.png" alt="TradeLayer Logo" width={42} height={42} />
        <span className="text-xl font-semibold text-[var(--text-dark)]">
          TradeLayer
        </span>
      </div>

      {/* Navigation */}
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

      <div className="flex-grow" />
    </aside>
  );
}

/* ---------------------- ITEM COMPONENT ---------------------- */

function SidebarItem({ href, active, icon, children }) {
  return (
    <Link
      href={href}
      className={`
        group flex items-center gap-3 px-4 py-2 text-sm rounded-lg relative
        transition-all duration-200 font-medium
        ${active ? "text-white" : "text-[var(--text-dark)]"}
      `}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Active Background Animatie */}
      {active && (
        <motion.div
          layoutId="active-bg"
          className="
            absolute inset-0 
            rounded-lg 
            bg-[var(--primary)] shadow-md
          "
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}

      {/* Hover Glow Accent (alleen bij inactive) */}
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
          relative z-10 text-lg
          transition-transform duration-200
          group-hover:scale-110
          ${active ? "text-white" : "text-[var(--text-dark)]"}
        `}
      >
        {icon}
      </span>

      {/* TEXT */}
      <span className="relative z-10 group-hover:translate-x-1 transition-all duration-200">
        {children}
      </span>
    </Link>
  );
}
