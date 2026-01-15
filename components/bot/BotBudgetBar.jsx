// components/bot/BotBudgetBar.jsx
"use client";

export default function BotBudgetBar({
  total = 0,
  spent = 0,
  label = "Budget",
}) {
  if (total <= 0) {
    return (
      <div className="text-xs text-[var(--text-muted)]">
        Geen budget ingesteld
      </div>
    );
  }

  const pct = Math.min((spent / total) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span>
          €{spent.toFixed(0)} / €{total.toFixed(0)}
        </span>
      </div>

      <div className="h-2 rounded bg-[var(--card-muted)] overflow-hidden">
        <div
          className={`h-full ${
            pct > 90
              ? "bg-red-500"
              : pct > 70
              ? "bg-orange-500"
              : "bg-green-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
