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
        <div className="mb-5 flex items-center gap-3">
          {icon && (
            <span className="p-2 rounded-xl bg-[var(--card-icon-bg)] text-[var(--primary)]">
              {icon}
            </span>
          )}

          <h3 className="text-base font-semibold text-[var(--text-dark)] tracking-tight">
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
