'use client';

import { useEffect, useState } from 'react';

export default function ReportGenerateOverlay({ text = 'AI genereert het rapport…' }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);

    // UX-progress: langzaam naar ~90%
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 4 + 2;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      {/* card */}
      <div className="relative z-50 bg-white rounded-2xl shadow-xl px-10 py-8 flex flex-col items-center gap-4">
        {/* progress circle */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              stroke="#6366f1"
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
            {Math.floor(progress)}%
          </div>
        </div>

        {/* text */}
        <div className="text-sm text-center">
          <div className="font-medium">{text}</div>
          <div className="text-[var(--text-muted)] mt-1">
            Dit kan ± 1 minuut duren
          </div>
        </div>
      </div>
    </div>
  );
}
