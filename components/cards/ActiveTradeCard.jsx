'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function ActiveTradeCard() {
  return (
    <Card className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1 text-green-700 dark:text-green-300">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">Actieve Trade</span>
        </div>
        <div className="text-sm text-gray-800 dark:text-gray-100 space-y-1">
          <p><strong>Setup:</strong> BTC Swing Buy</p>
          <p><strong>Entry:</strong> $97.000</p>
          <p><strong>TP1:</strong> $104.000</p>
          <p><strong>Stop:</strong> $94.500</p>
        </div>
      </CardContent>
    </Card>
  );
}
