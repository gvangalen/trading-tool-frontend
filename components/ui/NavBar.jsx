"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const pathname = usePathname();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#F7FAFF] border-r border-gray-200 flex flex-col p-4 shadow-sm z-50 select-none">

      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8 mt-2">
        <Image
          src="/logo.png"
          alt="TradeLayer Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <span className="text-xl font-semibold text-gray-800">TradeLayer</span>
      </div>

      {/* Navigation Links */}
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

      {/* Push profile dropdown to bottom */}
      <div className="flex-grow" />

      {/* Profile dropdown */}
      <div className="relative px-2" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:ring-2 ring-blue-300 transition"
          title="Open profielmenu"
        >
          G
        </button>

        {showDropdown && (
          <div className="absolute left-0 bottom-12 w-48 bg-white border border-gray-200 rounded shadow-lg py-2">
            <LinkMenu href="/profile">👤 Profiel</LinkMenu>
            <MenuButton>🌐 Taal & Regio</MenuButton>
            <MenuButton>🧠 AI Instellingen</MenuButton>
            <MenuButton>📈 Tradingstijl</MenuButton>
            <MenuButton>📤 Uitloggen</MenuButton>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ---------------------- COMPONENTS ---------------------- */

function SidebarLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition 
      ${active ? "bg-blue-600 text-white shadow-sm" : "text-gray-700 hover:bg-blue-50"}`}
    >
      {children}
    </Link>
  );
}

function LinkMenu({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
    >
      {children}
    </Link>
  );
}

function MenuButton({ children }) {
  return (
    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700">
      {children}
    </button>
  );
}
