'use client';

import Link from 'next/link';

export default function RightSidebarCard() {
  return (
    <div className="sticky top-24 w-full max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-4 space-y-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">📌 Actief Tradingplan</h3>

      <div className="text-sm space-y-2">
        <div><strong>Asset:</strong> BTC/USDT</div>
        <div><strong>Entry:</strong> $63.500</div>
        <div><strong>Targets:</strong> $66.000 / $68.500</div>
        <div><strong>Stop-loss:</strong> $61.200</div>
        <div><strong>Status:</strong> ✅ Actief · R/R 2.5</div>
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />

      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">🤖 AI Bot Status</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">Laatst gegenereerd: 07:34</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">AI advies: Hold positie · wacht op breakout</p>
      </div>

      <div className="flex gap-2 pt-2">
        <Link href="/strategie" className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">📂 Bekijk Strategie</Link>
        <button className="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">
          🔁 Genereer Opnieuw
        </button>
      </div>
    </div>
  );
}
