'use client';

import { MessageSquare } from 'lucide-react'; 
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function ReportCard() {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent>
        <div className="flex items-center mb-2 text-sm font-medium text-green-600">
          <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
          Daily rapport
        </div>
        <p className="text-sm text-gray-800 italic">
          “We blijven bullish zolang $101.500 standhoudt.”
        </p>
        <Link
          href="/report"
          className="text-xs text-blue-600 mt-2 inline-block hover:underline"
        >
          Bekijk volledig rapport →
        </Link>
      </CardContent>
    </Card>
  );
}
