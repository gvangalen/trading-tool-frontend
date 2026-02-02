"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
  Bot,
  Menu,
  X,
} from "lucide-react";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Scores", icon: <Gauge size={18} /> },
    { href: "/market", label: "Market", icon: <DollarSign size={18} /> },
    { href: "/macro", label: "Macro", icon: <Globe size={18} /> },
    { href: "/technical", label: "Technisch", icon: <LineChart size={18} /> },
    { href: "/setup", label: "Setups", icon: <Layers size={18} /> },
    { href: "/strategy", label: "Strategieën", icon: <BarChart3 size={18} /> },
    { href: "/bot", label: "Bots", icon: <Bot size={18} /> },
    { href: "/report", label: "Rapporten", icon: <FileText size={18} /> },
  ];

  return (
    <>
      {/* ===================== */}
      {/* 🍔 HAMBURGER (MOBILE) */}
      {/* ===================== */}
      <button
        onClick={() => setOpen(true)}
        className="
          fixed top-4 left-4 z-[100]
          p-2 rounded-lg
          bg-white shadow
          md:hidden
        "
      >
        <Menu size={22} />
      </button>

      {/* ===================== */}
      {/* 🌫 OVERLAY (MOBILE)   */}
      {/* ===================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ===================== */}
      {/* 📚 SIDEBAR            */}
      {/* ===================== */}
      <AnimatePresence>
        {(open || typeof window === "undefined") && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="
              sidebar-surface
              fixed top-0 left-0
              z-50
              h-screen w-64
              flex flex-col
              md:translate-x-0
            "
          >
            {/* CLOSE (MOBILE) */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 md:hidden"
            >
              <X size={20} />
            </button>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* LOGO */}
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2 rounded-xl bg-white shadow-sm">
                  <Image
                    src="/logo-icon.png"
                    alt="TradeLayer logo"
                    width={56}
                    height={56}
                    className="rounded-md"
                  />
                </div>

                <div>
                  <h1 className="text-lg font-semibold">
                    TradeLayer
                  </h1>
                  <p className="text-xs opacity-70">
                    AI Trading Suite
                  </p>
                </div>
              </div>

              {/* NAV */}
              <nav className="flex flex-col gap-1">
                {links.map((item) => (
                  <SidebarItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    active={pathname === item.href}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </SidebarItem>
                ))}
              </nav>
            </div>

            {/* FOOTER */}
            <div className="border-t px-6 py-5 flex flex-col gap-3">
              <SidebarFooterButton icon={<Settings size={18} />}>
                Instellingen
              </SidebarFooterButton>
              <SidebarFooterButton icon={<Sun size={18} />}>
                Thema
              </SidebarFooterButton>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarItem({ href, icon, active, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        relative group
        flex items-center gap-3
        px-4 py-2.5
        rounded-xl text-sm
        transition-all
      "
    >
      {active && (
        <motion.div
          layoutId="sidebar-pill"
          className="absolute inset-0 rounded-xl bg-[var(--sidebar-active)]"
        />
      )}

      <span className="relative z-10">{icon}</span>
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

function SidebarFooterButton({ icon, children }) {
  return (
    <button className="flex items-center gap-3 px-4 py-2 rounded-xl">
      {icon}
      {children}
    </button>
  );
}
