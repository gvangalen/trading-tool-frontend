"use client";

/* ---------------------------------------------------------
   Mini utility fn → vervangt clsx / cn / tailwind-merge
   --------------------------------------------------------- */
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ReportCard({
  title,
  content,
  icon = null,
  pre = false,
  color = "default",
  full = false,
}) {
  // 🎨 Kleurenpalet 2.5
  const colors = {
    default:
      "bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-dark)]",
    blue: "bg-blue-50/60 dark:bg-blue-900/40 border-blue-200/60 dark:border-blue-800/60 text-blue-900 dark:text-blue-100",
    green:
      "bg-green-50/60 dark:bg-green-900/40 border-green-200/60 dark:border-green-800/60 text-green-900 dark:text-green-100",
    yellow:
      "bg-yellow-50/60 dark:bg-yellow-900/40 border-yellow-200/60 dark:border-yellow-800/60 text-yellow-900 dark:text-yellow-100",
    red: "bg-red-50/60 dark:bg-red-900/40 border-red-200/60 dark:border-red-800/60 text-red-900 dark:text-red-100",
    gray: "bg-gray-50/60 dark:bg-gray-900/40 border-gray-200/60 dark:border-gray-700/60 text-gray-800 dark:text-gray-200",
  };

  const colorClasses = colors[color] || colors.default;

  // ↪ Veilige formatter
  const safeContentToString = (content) => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) return content.join("\n");
    if (typeof content === "object" && content !== null)
      return JSON.stringify(content, null, 2);
    return String(content ?? "–");
  };

  return (
    <div
      className={cn(
        `
        rounded-2xl p-5
        shadow-sm hover:shadow-md transition-all duration-200
        backdrop-blur-xl
        border
        ${colorClasses}
      `,
        full && "md:col-span-2"
      )}
    >
      {/* Titel + icon */}
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <span
            className="
              inline-flex items-center justify-center
              w-7 h-7 
              rounded-lg 
              bg-black/5 dark:bg-white/10
              backdrop-blur-sm
            "
          >
            {icon}
          </span>
        )}

        <h2 className="text-base font-semibold tracking-tight">
          {title}
        </h2>
      </div>

      {/* Content */}
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {pre ? (
          <pre
            className="
              font-mono text-[13px] leading-snug
              bg-black/5 dark:bg-white/10
              p-3 rounded-lg
              border border-[var(--border)]
              whitespace-pre-wrap
            "
          >
            {safeContentToString(content)}
          </pre>
        ) : (
          safeContentToString(content)
        )}
      </div>
    </div>
  );
}
