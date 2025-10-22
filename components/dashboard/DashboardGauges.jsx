'use client';

import { useState } from 'react';
import { useScoresData } from '@/hooks/useScoresData'; // ✅ nieuwe hook
import GaugeChart from '@/components/ui/GaugeChart';
import TopSetupsMini from '@/components/setup/TopSetupsMini';
import CardWrapper from '@/components/ui/CardWrapper';

export default function DashboardGauges() {
  const [selectedAsset, setSelectedAsset] = useState('BTC');

  const {
    macro,
    technical,
    setup,
    sentiment,
    loading,
  } = useScoresData();

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
            disabled
          >
            <option value="BTC">BTC</option>
            <option value="SOL">SOL</option>
          </select>
        </div>
        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
          ✅ Live data
        </div>
      </div>

      {/* 📊 Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GaugeCard
          title="🌍 Macro"
          score={macro?.score}
          explanation={macro?.interpretation}
          topContributors={macro?.top_contributors}
        />
        <GaugeCard
          title="📈 Technical"
          score={technical?.score}
          explanation={technical?.interpretation}
          topContributors={technical?.top_contributors}
        />
        <GaugeCard
          title="⚙️ Setup"
          score={setup?.score}
          explanation={setup?.interpretation}
          topContributors={setup?.top_contributors}
          showTopSetups
        />
      </div>
    </div>
  );
}

function GaugeCard({ title, score, explanation, topContributors = [], showTopSetups = false }) {
  const displayScore = typeof score === 'number' ? score : 0;
  const displayExplanation = explanation?.trim() || '📡 Geen uitleg beschikbaar';
  const label = title.replace(/^[^a-zA-Z]+/, ''); // Strip emoji uit label

  return (
    <CardWrapper title={title}>
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
    </CardWrapper>
  );
}
