'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // 🔒 Sluit dropdown bij klikken buiten
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md py-3 px-4 flex flex-wrap justify-between items-center rounded mb-8">
      <h1 className="text-xl font-bold">📊 Dashboard</h1>

      <div className="flex flex-wrap items-center gap-6">
        {/* 🔗 Navigatielinks */}
        <div className="flex flex-wrap gap-4 text-sm">
          <button onClick={() => scrollToSection('gauges')} className="hover:underline">🌡️ Scores</button>
          <button onClick={() => scrollToSection('advies')} className="hover:underline">🚀 Advies</button>
          <button onClick={() => scrollToSection('market')} className="hover:underline">💰 Market</button>
          <button onClick={() => scrollToSection('macro')} className="hover:underline">🌍 Macro</button>
          <button onClick={() => scrollToSection('technical')} className="hover:underline">📈 Technisch</button>
          <button onClick={() => scrollToSection('setups')} className="hover:underline">⚙️ Setups</button>
        </div>

        {/* 👤 Avatar met dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:ring-2 ring-blue-400 transition"
            title="Open profile menu"
          >
            G
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50">
              <ul className="py-1 text-sm text-gray-800 dark:text-gray-200">
                <li><Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">👤 Profiel</Link></li>
                <li><button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">🌐 Taal & Regio</button></li>
                <li><button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">🧠 AI Instellingen</button></li>
                <li><button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">📈 Tradingstijl</button></li>
                <li><button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">📤 Uitloggen</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}
