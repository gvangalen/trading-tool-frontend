'use client';

import ReportCard from '@/components/report/sections/ReportCard';

export default function WeeklyScoreTrendCard() {
  return (
    <ReportCard title="Scoretrend (Week)">
      <div className="space-y-3">

        <TrendRow label="Macro" trend="up" note="Blijft dominant" />
        <TrendRow label="Technisch" trend="flat" note="Geen verbetering" />
        <TrendRow label="Setups" trend="down" note="Afname kwaliteit" />

      </div>
    </ReportCard>
  );
}

function TrendRow({ label, trend, note }) {
  const icon =
    trend === 'up' ? '↗' :
    trend === 'down' ? '↘' : '→';

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium">{label}</span>
      <span className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-muted-foreground">{note}</span>
      </span>
    </div>
  );
}
