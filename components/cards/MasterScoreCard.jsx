'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { useScoresData } from '@/hooks/useScoresData';

export default function MasterScoreCard() {
  const { master, loading, error } = useScoresData();

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-4 text-center text-gray-500 dark:text-gray-400">
          ⏳ Laden van AI Master Score...
        </CardContent>
      </Card>
    );
  }

  if (error || !master) {
    return (
      <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-4 text-center text-red-500">
          ❌ Fout bij laden van AI Master Score
        </CardContent>
      </Card>
    );
  }

  // 🎨 Dynamische kleur op basis van score
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 dark:text-green-300';
    if (score <= 40) return 'text-red-600 dark:text-red-300';
    return 'text-yellow-600 dark:text-yellow-300';
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md transition-transform hover:scale-[1.02]">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-5 h-5 text-purple-500" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            AI Master Score
          </h2>
        </div>

        {/* Hoofdscore */}
        <p className={`text-3xl font-bold ${getScoreColor(master.score)}`}>
          {master.score ? master.score.toFixed(1) : '–'}
        </p>

        {/* Details */}
        <div className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <strong>Trend:</strong> {master.trend || '–'}
          </p>
          <p>
            <strong>Bias:</strong> {master.bias || '–'}
          </p>
          <p>
            <strong>Risico:</strong> {master.risk || '–'}
          </p>
          <p>
            <strong>Outlook:</strong>{' '}
            <span className="italic">{master.outlook || '–'}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
