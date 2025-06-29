export default function ReportCard({ title, children, color = 'default' }) {
  const colors = {
    default: 'bg-white border border-gray-200',
    blue: 'bg-blue-50 border border-blue-200',
    green: 'bg-green-50 border border-green-200',
    yellow: 'bg-yellow-50 border border-yellow-200',
    red: 'bg-red-50 border border-red-200',
    gray: 'bg-gray-50 border border-gray-200',
  };

  const colorClasses = colors[color] || colors.default;

  return (
    <div className={`${colorClasses} p-4 rounded-md shadow-sm`}>
      <h2 className="text-sm font-semibold mb-2">{title}</h2>
      <div className="text-sm text-gray-800 dark:text-gray-200">
        {children}
      </div>
    </div>
  );
}
