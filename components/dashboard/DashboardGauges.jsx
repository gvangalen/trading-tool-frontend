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
    <div className="space-y-8">
      {/* 🔁 Asset selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <label htmlFor="assetSelect" className="font-semibold">🔁 Kies asset:</label>
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
        <div className="text-sm text-gray-500">
          {loading ? '📡 Data laden...' : '✅ Data geladen'}
        </div>
      </div>

      {/* 📊 Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GaugeCard
          label="Macro"
          emoji="🌍"
          score={macroScore}
          explanation={macroExplanation}
        />
        <GaugeCard
          label="Technisch"
          emoji="📈"
          score={technicalScore}
          explanation={technicalExplanation}
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

function GaugeCard({ label, emoji, score, explanation, showTopSetups = false }) {
  const displayScore = typeof score === 'number' ? score : 0;
  const displayExplanation = typeof explanation === 'string' && explanation.trim()
    ? explanation
    : '📡 Geen uitleg beschikbaar';

  // 🔵 Kleur op basis van score
  let color = '#9ca3af'; // Grijs
  if (displayScore >= 2) color = '#34d399'; // Groen
  else if (displayScore <= -2) color = '#f87171'; // Rood
  else if (displayScore > 0) color = '#60a5fa'; // Blauw
  else if (displayScore < 0) color = '#facc15'; // Geel

  return (
    <div className="p-4 border rounded shadow bg-white dark:bg-gray-800 text-center space-y-4">
      <h3 className="font-bold text-lg">{emoji} {label}</h3>
      <GaugeChart value={displayScore} label={label} color={color} />
      <p className="text-sm text-gray-500">{displayExplanation}</p>

      {showTopSetups && (
        <div className="mt-4">
          <TopSetupsMini />
        </div>
      )}
    </div>
  );
}
