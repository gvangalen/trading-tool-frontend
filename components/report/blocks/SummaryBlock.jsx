import ReportCard from '../ReportCard';
import { Brain } from 'lucide-react';

export default function SummaryBlock({ title = 'Samenvatting', summary }) {
  if (!summary) return null;

  return (
    <ReportCard
      icon={<Brain size={18} />}
      title={title}
      content={summary}
      full
      color="blue"
    />
  );
}
