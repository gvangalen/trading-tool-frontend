'use client';

import CardWrapper from '@/components/ui/CardWrapper';

export default function NotificationCard({ icon, title, subtitle, color = 'bg-white' }) {
  return (
    <CardWrapper className={`${color}`}>
      <div className="text-xl mb-1 flex items-center gap-2">
        {icon}
        <strong>{title}</strong>
      </div>
      <p className="text-sm text-gray-700">{subtitle}</p>
    </CardWrapper>
  );
}
