'use client';

import { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import GaugeChart from '@/components/ui/GaugeChart';

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

      {/* 🔁 Asset selector + loading status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="assetSelect" className="font-semibold text-sm">🔁 Select asset:</label>
          <select
            id="assetSelect"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="BTC">BTC</option>
            <option value="SOL">SOL</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          {loading ? '📡 Loading data...' : '✅ Live data'}
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
          label="Technical"
          emoji="📈"
          score={technicalScore}
          explanation={technicalExplanation}
        />
        <GaugeCard
          label="Setup"
          emoji="⚙️"
          score={setupScore}
          explanation={setupExplanation}
        />
      </div>
    </div>
  );
}

function GaugeCard({ label, emoji, score, explanation }) {
  const displayScore = typeof score === 'number' ? score : 0;
  const displayExplanation = explanation?.trim() || '📡 No explanation available';

  // 🎨 Scorekleur bepalen
  let color = '#9ca3af'; // Gray
  if (displayScore >= 2) color = '#34d399'; // Green
  else if (displayScore <= -2) color = '#f87171'; // Red
  else if (displayScore > 0) color = '#60a5fa'; // Blue
  else if (displayScore < 0) color = '#facc15'; // Yellow

  return (
    <div className="p-4 border rounded-xl shadow bg-white dark:bg-gray-900 text-center flex flex-col justify-between h-full space-y-4">
      <h3 className="font-bold text-lg">{emoji} {label}</h3>
      <GaugeChart value={displayScore} label={label} color={color} />
      <p className="text-sm text-muted-foreground">{displayExplanation}</p>
    </div>
  );
}
