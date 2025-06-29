export default function ReportCard({ title, content, icon = null, pre = false, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm ${className}`}>
      <h2 className="text-base font-semibold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
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
