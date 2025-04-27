'use client';

export default function CardWrapper({ children }) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:scale-105 transition-transform">
      {children}
    </div>
  );
}
