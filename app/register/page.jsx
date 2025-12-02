"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-light)] px-4">
      <div className="bg-white dark:bg-[var(--card)] shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-800">

        <h1 className="text-2xl font-bold text-center mb-2">Account aanmaken</h1>
        <p className="text-center text-gray-500 mb-6">
          Maak een nieuw TradeLayer-account
        </p>

        {/* Email */}
        <label className="block text-sm font-medium mb-1">E-mail</label>
        <input
          type="email"
          className="w-full mb-4 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="jij@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Wachtwoord */}
        <label className="block text-sm font-medium mb-1">Wachtwoord</label>
        <input
          type="password"
          className="w-full mb-6 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Knop */}
        <button
          className="
            w-full bg-blue-600 hover:bg-blue-700
            text-white font-semibold py-3 rounded-lg
            transition-all shadow-md
          "
        >
          ➜ Account aanmaken
        </button>

        {/* Terug link */}
        <p className="text-center text-gray-500 mt-6">
          Heb je al een account?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Log in →
          </Link>
        </p>
      </div>
    </div>
  );
}
