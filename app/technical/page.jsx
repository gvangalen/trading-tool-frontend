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

      {/* 📊 Scoreblok */}
      <div className="pt-2 text-sm sm:text-base space-y-2">
        <p>
          <strong>📊 Technische Score:</strong>{' '}
          <span className={scoreColor(avgScore)}>{avgScore}</span>
        </p>
        <p>
          <strong>🧠 Advies:</strong>{' '}
          <span className="text-blue-600 font-medium">{advies}</span>
        </p>
      </div>

      {/* 🔁 Tabs */}
      <TechnicalTabs />
    </div>
  );
}
