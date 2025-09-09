'use client';

import { useTechnicalData } from '@/hooks/useTechnicalData';
import TechnicalTabs from '@/components/technical/TechnicalTabs';
import CardWrapper from '@/components/ui/CardWrapper';

export default function TechnicalPage() {
  const { avgScore, advies } = useTechnicalData();

  const scoreColor = (score) => {
    if (score >= 1.5) return 'text-green-600';
    if (score <= -1.5) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">🧪 Technische Analyse</h1>

      {/* ✅ Samenvatting in CardWrapper */}
      <CardWrapper>
        <h3 className="text-lg font-semibold">
          📊 Technische Score: <span className={scoreColor(avgScore)}>{avgScore}</span>
        </h3>
        <h3 className="text-lg font-semibold">
          🧠 Advies: <span className="text-blue-600">{advies}</span>
        </h3>
      </CardWrapper>

      {/* 🔁 Tabs */}
      <TechnicalTabs />
    </div>
  );
}
