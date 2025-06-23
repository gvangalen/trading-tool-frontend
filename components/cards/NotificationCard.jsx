'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function NotificationCard({ icon, title, subtitle, color = 'bg-white' }) {
  return (
    <Card className={`${color} w-full sm:w-60`}>
      <CardContent>
        <div className="text-xl mb-1 flex items-center gap-2">
          {icon}
          <strong>{title}</strong>
        </div>
        <p className="text-sm text-gray-700">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
