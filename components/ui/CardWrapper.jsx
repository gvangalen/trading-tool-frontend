"use client";

export default function CardWrapper({ title, children, icon }) {
  return (
    <div
      className="
        rounded-2xl
        bg-[var(--card-bg)]
        border border-[var(--card-border)]
        shadow-[0_4px_12px_rgba(0,0,0,0.04)]
        p-6
        transition-all
        duration-200
        hover:shadow-[0_6px_18px_rgba(0,0,0,0.06)]
        hover:-translate-y-[2px]
      "
      style={{
        borderRadius: "var(--card-radius)",
      }}
    >
      {/* ---- Titel (optioneel) ---- */}
      {title && (
        <div className="mb-4 flex items-center gap-2 pb-2 border-b border-[var(--border)]/60">
          {icon && <span className="text-xl">{icon}</span>}

          <h3 className="text-lg font-semibold text-[var(--text-dark)]">
            {title}
          </h3>
        </div>
      )}

      {/* ---- Content ---- */}
      <div className="text-[var(--text-dark)]">
        {children}
      </div>
    </div>
  );
}
