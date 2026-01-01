import ReportCard from '../ReportCard';
import { Activity } from 'lucide-react';

function ScoreItem({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--text-light)]">{label}</span>
      <span className="font-semibold">{value ?? '–'}</span>
    </div>
  );
}

export default function ScoreBarBlock({
  macro,
  technical,
  market,
  setup,
}) {
  return (
    <ReportCard
      icon={<Activity size={18} />}
      title="Scores"
      color="gray"
    >
      <div className="space-y-2">
        <ScoreItem label="Macro" value={macro} />
        <ScoreItem label="Technical" value={technical} />
        <ScoreItem label="Market" value={market} />
        <ScoreItem label="Setup" value={setup} />
      </div>
    </ReportCard>
  );
}
