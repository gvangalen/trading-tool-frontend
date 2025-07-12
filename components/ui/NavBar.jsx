'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md py-3 px-4 flex flex-wrap justify-between items-center rounded mb-8">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.png"
          alt="TradeLayer Logo"
          width={32}
          height={32}
          className="h-8 w-auto"
          priority
        />
        <span className="text-xl font-bold">TradeLayer</span>
      </Link>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-wrap gap-4 text-sm">
          <NavLink href="/">🌡️ Scores</NavLink>
          <NavLink href="/market">💰 Market</NavLink>
          <NavLink href="/macro">🌍 Macro</NavLink>
          <NavLink href="/technical">📈 Technisch</NavLink>
          <NavLink href="/setup">⚙️ Setups</NavLink>
          <NavLink href="/strategy">📊 Strategieën</NavLink>
          <NavLink href="/report">📄 Rapport</NavLink>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:ring-2 ring-blue-400 transition"
            title="Open profielmenu"
          >
            G
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
              <ul className="py-1 text-sm text-gray-800 dark:text-gray-200">
                <li>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    👤 Profiel
                  </Link>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    🌐 Taal & Regio
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    🧠 AI Instellingen
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    📈 Tradingstijl
                  </button>
                </li>
                <li>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    📤 Uitloggen
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  function NavLink({ href, children }) {
    const isCurrent = isActive(href);
    return (
      <Link
        href={href}
        className={`hover:underline ${
          isCurrent ? 'font-bold text-blue-600' : ''
        }`}
      >
        {children}
      </Link>
    );
  }
}
