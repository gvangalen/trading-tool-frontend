// ✅ components/SkeletonTable.jsx
'use client';

export default function SkeletonTable({ rows = 5, columns = 5 }) {
  return (
    <div className="animate-pulse space-y-2">
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {[...Array(columns)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded w-full"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
}
