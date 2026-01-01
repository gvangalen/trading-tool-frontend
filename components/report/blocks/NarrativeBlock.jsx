import ReportCard from '../ReportCard';
import { FileText } from 'lucide-react';

export default function NarrativeBlock({
  title,
  text,
  color = 'gray',
}) {
  if (!text) return null;

  return (
    <ReportCard
      icon={<FileText size={18} />}
      title={title}
      pre
      color={color}
    >
      {text}
    </ReportCard>
  );
}
