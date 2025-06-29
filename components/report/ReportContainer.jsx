export default function ReportContainer({ children }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow p-6 space-y-6">
      {children}
    </div>
  );
}
