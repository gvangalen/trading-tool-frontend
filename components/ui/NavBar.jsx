"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <aside
      className="
        fixed left-0 top-0 h-screen w-64
        bg-[var(--bg-soft)]
        border-r border-[var(--border)]
        flex flex-col p-4 shadow-sm z-50 select-none
      "
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <Image
          src="/logo.png"
          alt="TradeLayer Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-xl font-semibold text-[var(--text-dark)]">
          TradeLayer
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">

        <SidebarLink href="/" active={isActive("/")}>
          🌡️ Scores
        </SidebarLink>

        <SidebarLink href="/market" active={isActive("/market")}>
          💰 Market
        </SidebarLink>

        <SidebarLink href="/macro" active={isActive("/macro")}>
          🌍 Macro
        </SidebarLink>

        <SidebarLink href="/technical" active={isActive("/technical")}>
          📈 Technisch
        </SidebarLink>

        <SidebarLink href="/setup" active={isActive("/setup")}>
          ⚙️ Setups
        </SidebarLink>

        <SidebarLink href="/strategy" active={isActive("/strategy")}>
          📊 Strategieën
        </SidebarLink>

        <SidebarLink href="/report" active={isActive("/report")}>
          📄 Rapport
        </SidebarLink>

      </nav>

      <div className="flex-grow" />
    </aside>
  );
}

/* ---------------------- COMPONENTS ---------------------- */

function SidebarLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
        ${
          active
            ? "bg-[var(--primary)] text-white shadow-sm"
            : "text-[var(--text-dark)] hover:bg-[var(--primary-light)]"
        }
      `}
    >
      {children}
    </Link>
  );
}
}
