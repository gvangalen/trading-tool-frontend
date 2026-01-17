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

  let barClass = "score-buy";
  if (pct > 90) barClass = "score-sell";
  else if (pct > 70) barClass = "score-neutral";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span>
          €{spent.toFixed(0)} / €{total.toFixed(0)}
        </span>
      </div>

      <div className="h-2 rounded-[var(--radius-xs)] bg-[var(--surface-3)] overflow-hidden">
        <div
          className={`h-full ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
