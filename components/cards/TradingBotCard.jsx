// components/cards/TradingBotCard.jsx
'use client';

import { Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TradingBotCard() {
  return (
    <Card className="bg-purple-100 dark:bg-purple-900">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="text-purple-600 w-4 h-4" />
          <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
            AI TradingBot
          </span>
        </div>
        <p className="text-sm text-gray-800 dark:text-gray-100">
          <strong>Status:</strong> Actief
        </p>
        <p className="text-sm text-gray-800 dark:text-gray-100">
          <strong>Volgende actie:</strong> Over 3 uur
        </p>
        <p className="text-sm text-gray-800 dark:text-gray-100">
          <strong>Strategie:</strong> DCA + Swing
        </p>
      </CardContent>
    </Card>
  );
}
