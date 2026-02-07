'use client';

import ReportCard from '@/components/report/sections/ReportCard';

export default function WeeklyRegimeOverviewCard({ report }) {
  if (!report) return null;

  return (
    <ReportCard title="Weekregime Overzicht">
      <div className="grid grid-cols-2 gap-4">

        <RegimePill label="Markt" value="Bearish / defensief" />
        <RegimePill label="Macro" value="Sterk / ondersteunend" />
        <RegimePill label="Technisch" value="Zwak / range" />
        <RegimePill label="Setups" value="Laag vertrouwen" />

      </div>
    </ReportCard>
  );
}

function RegimePill({ label, value }) {
  return (
    <div className="rounded-lg border px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
