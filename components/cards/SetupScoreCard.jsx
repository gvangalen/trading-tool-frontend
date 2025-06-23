import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function SetupScoreCard() {
  return (
    <Card className="bg-orange-50 dark:bg-orange-900 border border-orange-200 dark:border-orange-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1 text-orange-700 dark:text-orange-300">
          <Star className="w-4 h-4" />
          <span className="text-sm font-semibold">1 actieve setup</span>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-100">
          A-Plus Setup – <span className="font-semibold text-green-600 dark:text-green-300">Score 85,0</span>
        </p>
      </CardContent>
    </Card>
  );
}
