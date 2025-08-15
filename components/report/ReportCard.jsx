export default function ReportCard({
  title,
  content,
  icon = null,
  pre = false,
  color = 'default',
  full = false,
}) {
  const colors = {
    default: 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
    blue: 'bg-blue-50 border border-blue-200 dark:bg-blue-900 dark:border-blue-700',
    green: 'bg-green-50 border border-green-200 dark:bg-green-900 dark:border-green-700',
    yellow: 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-900 dark:border-yellow-700',
    red: 'bg-red-50 border border-red-200 dark:bg-red-900 dark:border-red-700',
    gray: 'bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700',
  };

  const colorClasses = colors[color] || colors.default;

  function safeContentToString(content) {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) return content.join('\n');
    if (typeof content === 'object' && content !== null) return JSON.stringify(content, null, 2);
    return String(content ?? '–');
  }

  return (
    <div
      className={`
        ${colorClasses}
        p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200
        ${full ? 'col-span-1 md:col-span-2' : ''}
      `}
    >
      <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </h2>
      <div className="text-sm text-gray-800 dark:text-gray-200">
        {pre ? (
          <pre className="whitespace-pre-wrap">{safeContentToString(content)}</pre>
        ) : (
          <p>{safeContentToString(content)}</p>
        )}
      </div>
    </div>
  );
}
