'use client';

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl shadow-sm border bg-white dark:bg-gray-900 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}
