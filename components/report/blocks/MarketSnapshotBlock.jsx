import ReportCard from '../ReportCard';
import { TrendingUp } from 'lucide-react';

export default function MarketSnapshotBlock({ report }) {
  if (!report) return null;

  return (
    <ReportCard
      icon={<TrendingUp size={18} />}
      title="Market Snapshot"
      pre
      color="blue"
    >
{`Prijs: $${report.price ?? '–'}
24h: ${report.change_24h ?? '–'}%
Volume: ${report.volume ?? '–'}`}
    </ReportCard>
  );
}
