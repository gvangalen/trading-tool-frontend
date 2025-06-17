'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function NavBar() {
  const [isDark, setIsDark] = useState(false);

  // ✅ Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const userPref = localStorage.getItem('theme');
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (userPref === 'dark' || (!userPref && systemPref)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 shadow bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="text-xl font-bold text-gray-800 dark:text-white">📊 Trading Tool</div>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-gray-700 dark:text-gray-300 hover:underline">
          Dashboard
        </Link>
        <Link href="/setups" className="text-gray-700 dark:text-gray-300 hover:underline">
          Setups
        </Link>
        <Link href="/strategy" className="text-gray-700 dark:text-gray-300 hover:underline">
          Strategies
        </Link>
        <button
          onClick={toggleDarkMode}
          className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
          <Image
            src="/avatar.png"
            alt="Avatar"
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
      </div>
    </nav>
  );
}
