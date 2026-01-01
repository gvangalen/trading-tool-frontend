import ReportCard from '../ReportCard';
import { ListChecks } from 'lucide-react';

export default function DataListBlock({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <ReportCard
      icon={<ListChecks size={18} />}
      title={title}
      pre
      color="gray"
    >
      {items.map((i, idx) => `- ${i}`).join('\n')}
    </ReportCard>
  );
}
