'use client';

export default function CardWrapper({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      )}
      <div>{children}</div>
    </div>
  );
}
