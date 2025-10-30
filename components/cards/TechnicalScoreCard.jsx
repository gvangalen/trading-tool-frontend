// ✅ ScoreCard.jsx
import { Card, CardContent } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

export default function ScoreCard({
  score = 50,
  label = 'Technisch',
  icon: Icon = Gauge,
}) {
  // 🎨 Dynamische kleur op basis van score
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 dark:text-green-300';
    if (score <= 40) return 'text-red-600 dark:text-red-300';
    return 'text-yellow-600 dark:text-yellow-300';
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        </div>
        <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}
        </p>
      </CardContent>
    </Card>
  );
}
