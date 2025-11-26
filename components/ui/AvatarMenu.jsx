'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Globe,
  Brain,
  LineChart,
  LogOut,
} from 'lucide-react';

export default function AvatarMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  /* Klik buiten = sluiten */
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
      {/* AVATAR KNOP */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="
          w-9 h-9 rounded-full
          bg-[var(--primary)]
          text-white
          flex items-center justify-center
          font-semibold
          hover:opacity-90
          transition-all
          shadow-sm
        "
        title="Open profielmenu"
      >
        G
      </button>

      {/* DROPDOWN */}
      {showDropdown && (
        <div
          className="
            absolute right-0 mt-3 w-52
            bg-[var(--card-bg)]
            border border-[var(--card-border)]
            rounded-xl
            shadow-[var(--shadow-lg)]
            py-1 z-50 animate-fade-slide
          "
        >
          <ul className="text-sm text-[var(--text-dark)]">

            <DropdownItem href="/profile" icon={<User size={16} />}>
              Profiel
            </DropdownItem>

            <DropdownButton icon={<Globe size={16} />}>
              Taal & Regio
            </DropdownButton>

            <DropdownButton icon={<Brain size={16} />}>
              AI Instellingen
            </DropdownButton>

            <DropdownButton icon={<LineChart size={16} />}>
              Tradingstijl
            </DropdownButton>

            <DropdownButton icon={<LogOut size={16} />} danger>
              Uitloggen
            </DropdownButton>

          </ul>
        </div>
      )}
    </div>
  );
}

/* 📌 Component voor links */
function DropdownItem({ href, icon, children }) {
  return (
    <li>
      <Link
        href={href}
        className="
          flex items-center gap-3 px-4 py-2.5
          hover:bg-[var(--bg-soft)]
          rounded-lg transition
        "
      >
        <span className="text-[var(--text-light)]">{icon}</span>
        <span>{children}</span>
      </Link>
    </li>
  );
}

/* 📌 Component voor knoppen */
function DropdownButton({ icon, children, danger = false }) {
  return (
    <li>
      <button
        className={`
          w-full text-left flex items-center gap-3 px-4 py-2.5
          rounded-lg transition
          hover:bg-[var(--bg-soft)]
          ${danger ? "text-red-500 hover:text-red-600" : "text-[var(--text-dark)]"}
        `}
      >
        <span className={`${danger ? "text-red-400" : "text-[var(--text-light)]"}`}>
          {icon}
        </span>
        <span>{children}</span>
      </button>
    </li>
  );
}
