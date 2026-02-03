"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = useMemo(
    () => [
      { href: "/", label: "Scores", icon: <Gauge size={18} /> },
      { href: "/market", label: "Market", icon: <DollarSign size={18} /> },
      { href: "/macro", label: "Macro", icon: <Globe size={18} /> },
      { href: "/technical", label: "Technisch", icon: <LineChart size={18} /> },
      { href: "/setup", label: "Setups", icon: <Layers size={18} /> },
      { href: "/strategy", label: "Strategieën", icon: <BarChart3 size={18} /> },
      { href: "/bot", label: "Bots", icon: <Bot size={18} /> },
      { href: "/report", label: "Rapporten", icon: <FileText size={18} /> },
    ],
    []
  );

  // ✅ sluit drawer automatisch bij navigatie
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* =====================================================
          MOBILE TOPBAR (hamburger)
      ====================================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-[60] bg-white border-b border-[var(--border-subtle)]">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="icon-muted hover:icon-primary"
            aria-label="Open menu"
            type="button"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
              <Image
                src="/logo-icon.png"
                alt="TradeLayer logo"
                width={28}
                height={28}
                className="rounded-md"
              />
            </div>
            <div className="font-semibold">TradeLayer</div>
          </div>

          <div className="w-10" />
        </div>
      </div>

      {/* Spacer zodat content niet onder mobile topbar valt */}
      <div className="md:hidden h-14" />

      {/* =====================================================
          DESKTOP SIDEBAR (altijd zichtbaar)
      ====================================================== */}
      <aside
        className="
          hidden md:flex
          sidebar-surface
          fixed top-0 left-0 z-50
          h-screen w-64
          flex-col
        "
      >
        <SidebarInner
          links={links}
          pathname={pathname}
          onNavigate={() => {}}
        />
      </aside>

      {/* =====================================================
          MOBILE DRAWER SIDEBAR
      ====================================================== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* overlay */}
            <motion.div
              key="overlay"
              className="md:hidden fixed inset-0 z-[70] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* drawer */}
            <motion.aside
              key="drawer"
              className="
                md:hidden
                sidebar-surface
                fixed top-0 left-0 z-[80]
                h-screen w-72 max-w-[85vw]
                flex flex-col
              "
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            >
              {/* drawer header */}
              <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--sidebar-border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white shadow-sm">
                    <Image
                      src="/logo-icon.png"
                      alt="TradeLayer logo"
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--sidebar-text)]">
                      TradeLayer
                    </div>
                    <div className="text-xs text-[var(--sidebar-text-muted)]">
                      AI Trading Suite
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="icon-muted hover:icon-primary"
                  aria-label="Close menu"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>

              <SidebarInner
                links={links}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* =====================================================
   SIDEBAR INNER (shared)
===================================================== */
function SidebarInner({ links, pathname, onNavigate }) {
  return (
    <>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Desktop-only logo block (mobile heeft eigen header) */}
        <div className="hidden md:flex items-center gap-3 mb-10">
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
            <h1 className="text-lg font-semibold text-[var(--sidebar-text)]">
              TradeLayer
            </h1>
            <p className="text-xs text-[var(--sidebar-text-muted)]">
              AI Trading Suite
            </p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1">
          {links.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              active={pathname === item.href}
              onClick={onNavigate}
            >
              {item.label}
            </SidebarItem>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--sidebar-border)] px-6 py-5 flex flex-col gap-3">
        <SidebarFooterButton icon={<Settings size={18} />}>
          Instellingen
        </SidebarFooterButton>
        <SidebarFooterButton icon={<Sun size={18} />}>
          Thema
        </SidebarFooterButton>
      </div>
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
            shadow-[inset_0_0_8px_rgba(0,0,0,0.12)]
            backdrop-blur-sm
          "
        />
      )}

      <span
        className={`
          relative z-10
          ${
            active
              ? "text-[var(--sidebar-text)]"
              : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]"
          }
        `}
      >
        {icon}
      </span>

      <span
        className={`
          relative z-10
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

function SidebarFooterButton({ icon, children }) {
  return (
    <button
      type="button"
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
