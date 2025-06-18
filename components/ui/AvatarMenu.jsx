'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AvatarMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ⛔️ Klik buiten menu = sluit menu
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
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                👤 Profiel
              </Link>
            </li>
            <li>
              <button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                🌐 Taal & Regio
              </button>
            </li>
            <li>
              <button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                🧠 AI Instellingen
              </button>
            </li>
            <li>
              <button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                📈 Tradingstijl
              </button>
            </li>
            <li>
              <button className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                📤 Uitloggen
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
