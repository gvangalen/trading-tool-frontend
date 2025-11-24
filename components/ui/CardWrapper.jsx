"use client";

export default function CardWrapper({ title, children, icon }) {
  return (
    <div
      className="
        card-surface
        p-6
        transition-all duration-200
        hover:shadow-[var(--card-shadow-hover)]
        hover:-translate-y-[2px]
        rounded-[var(--card-radius)]
      "
    >
      {/* Titel */}
      {title && (
        <div className="mb-5 flex items-center gap-3">
          {icon && (
            <span
              className="
                p-2 rounded-xl 
                bg-[var(--card-icon-bg)]
                text-[var(--primary)]
              "
            >
              {icon}
            </span>
          )}

          <h3 className="text-base font-semibold text-[var(--text-dark)] tracking-tight">
            {title}
          </h3>
        </div>
      )}

      <div className="text-[var(--text-dark)]">
        {children}
      </div>
    </div>
  );
}
