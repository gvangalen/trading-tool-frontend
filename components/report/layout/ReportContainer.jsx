"use client";

export default function ReportContainer({ children }) {
  return (
    <div
      className="
        animate-fade-slide

        bg-[var(--card-bg)]
        border border-[var(--card-border)]
        rounded-[var(--card-radius)]
        shadow-md

        p-6 md:p-8
        space-y-8
      "
    >
      {children}
    </div>
  );
}
