'use client';

export default function ReportCardGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {children}
    </div>
  );
}
