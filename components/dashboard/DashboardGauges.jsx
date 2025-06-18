'use client';

import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import GaugeChart from '@/components/ui/GaugeChart';
import TopSetupsMini from '@/components/setup/TopSetupsMini';

export default function DashboardGauges() {
  const {
    macroScore,
    technicalScore,
    setupScore,
    macroExplanation,
    technicalExplanation,
    setupExplanation,
    loading,
  } = useDashboardData();

  const [selectedAsset, setSelectedAsset] = useState('BTC');

  return (
    <div className="space-y-6">
      {/* 🔁 Asset selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <label htmlFor="assetSelect" className="font-semibold">🔁 Select asset:</label>
          <select
            id="assetSelect"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="ml-2 p-2 border rounded"
          >
            <option value="BTC">BTC</option>
            <option value="SOL">SOL</option>
          </select>
        </div>
        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
          ✅ Live data
        </div>
      </div>

      {/* 📊 Meters + uitleg */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GaugeCard
          label="Macro"
          emoji="🌍"
          score={macroScore}
          explanation={macroExplanation}
          topContributors={['BTC', 'DXY', 'ETF inflows', 'Obligatierente', 'Inflatie']}
        />
        <GaugeCard
          label="Technical"
          emoji="📈"
          score={technicalScore}
          explanation={technicalExplanation}
          topContributors={['RSI', 'ATR Model', 'Volume', '200MA', 'Stochastics']}
        />
        <GaugeCard
          label="Setup"
          emoji="⚙️"
          score={setupScore}
          explanation={setupExplanation}
          showTopSetups
        />
      </div>
    </div>
  );
}

function GaugeCard({ label, emoji, score, explanation, topContributors = [], showTopSetups = false }) {
  const displayScore = typeof score === 'number' ? score : 0;
  const displayExplanation = explanation?.trim() || '📡 Geen uitleg beschikbaar';

  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-900 space-y-4">
      <h3 className="text-lg font-semibold text-center">{emoji} {label}</h3>
      <div className="flex flex-col items-center justify-center">
        <GaugeChart value={displayScore} label={label} autoColor />
      </div>

      {topContributors.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <div className="font-semibold mt-2 mb-1">Top 5 contributors</div>
          <ul className="list-disc ml-5">
            {topContributors.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      )}

      {showTopSetups && (
        <div className="mt-2">
          <TopSetupsMini />
        </div>
      )}

      <p className="text-xs text-gray-500 italic mt-2">{displayExplanation}</p>
    </div>
  );
}
