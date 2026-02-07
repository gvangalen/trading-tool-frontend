'use client';

import ReportCard from '@/components/report/sections/ReportCard';

export default function WeeklyBotBehaviorCard({ report }) {
  if (!report) return null;

  return (
    <ReportCard title="Botgedrag (Week)">
      <div className="space-y-2 text-sm">

        <BehaviorRow label="Activiteit" value="Laag" />
        <BehaviorRow label="Selectiviteit" value="Hoog" />
        <BehaviorRow label="Discipline" value="Consistent" />

        <p className="pt-2 text-muted-foreground">
          {report.bot_performance}
        </p>
      </div>
    </ReportCard>
  );
}

function BehaviorRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
