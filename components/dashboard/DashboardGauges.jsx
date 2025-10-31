'use client';

import { useScoresData } from '@/hooks/useScoresData';
import GaugeChart from '@/components/ui/GaugeChart';
import TopSetupsMini from '@/components/setup/TopSetupsMini';
import CardWrapper from '@/components/ui/CardWrapper';

export default function DashboardGauges() {
  const {
    macro,
    technical,
    setup,
    loading,
  } = useScoresData();

  return (
    <div className="space-y-6">
      {/* 📊 Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GaugeCard
          title="🌍 Macro"
          score={macro?.score}
          explanation={macro?.explanation || macro?.uitleg || macro?.interpretation}
          topContributors={macro?.top_contributors}
        />
        <GaugeCard
          title="📈 Technical"
          score={technical?.score}
          explanation={technical?.explanation || technical?.uitleg || technical?.interpretation}
          topContributors={technical?.top_contributors}
        />
        <GaugeCard
          title="⚙️ Setup"
          score={setup?.score}
          explanation={setup?.explanation || setup?.uitleg || setup?.interpretation}
          topContributors={setup?.top_contributors}
          showTopSetups
        />
      </div>
    </div>
  );
}

function GaugeCard({ title, score, explanation, topContributors = [], showTopSetups = false }) {
  const displayScore = typeof score === 'number' ? score : 0;
  const label = title.replace(/^[^a-zA-Z]+/, ''); // Strip emoji uit label

  // 🧠 Automatische fallback uitleg
  const autoExplanation = topContributors.length > 0
    ? `Belangrijkste factoren: ${topContributors.join(', ')}`
    : '📡 Geen uitleg beschikbaar';

  const displayExplanation = explanation?.trim() || autoExplanation;

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
