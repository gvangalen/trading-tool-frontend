export default function ReportCard({ title, content, icon = null, pre = false }) {
  return (
    <div className="space-y-1 border-b pb-4 last:border-b-0">
      <h2 className="text-base font-semibold flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      {pre ? (
        <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{content || '–'}</pre>
      ) : (
        <p className="text-sm text-gray-800 dark:text-gray-200">{content || '–'}</p>
      )}
    </div>
  );
}
