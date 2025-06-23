'use client';

import { MessageSquareQuote } from 'lucide-react';
import CardWrapper from '@/components/ui/CardWrapper';

export default function ReportCard() {
  return (
    <CardWrapper className="bg-green-50 border-green-200">
      <div className="flex items-center mb-2 text-sm font-medium text-green-600">
        <MessageSquareQuote className="w-4 h-4 mr-2 text-green-500" />
        Daily rapport
      </div>
      <p className="text-sm text-gray-800 italic">
        “We blijven bullish zolang $101.500 standhoudt.”
      </p>
      <a
        href="/rapport"
        className="text-xs text-blue-600 mt-2 inline-block hover:underline"
      >
        Bekijk volledig rapport →
      </a>
    </CardWrapper>
  );
}
