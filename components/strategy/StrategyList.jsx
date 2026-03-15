"use client";

import StrategyCard from "@/components/strategy/StrategyCard";

export default function StrategyList({
  strategies = [],
  searchTerm = "",
  onRefresh,
  onDelete,
  onUpdate,
}) {

  /* ---------------------------------------------------------
   * 🔍 Zoeken / filteren
   * --------------------------------------------------------- */
  const filtered = (Array.isArray(strategies) ? strategies : []).filter((s) => {
    if (!s || !s.id) return false;

    const lower = String(searchTerm || "").toLowerCase();

    /* 🛡 tags veilig maken */
    const tags = Array.isArray(s.tags)
      ? s.tags
      : typeof s.tags === "string"
      ? s.tags.split(",").map((t) => t.trim())
      : [];

    return (
      !searchTerm ||
      String(s.symbol || "").toLowerCase().includes(lower) ||
      String(s.setup_name || "").toLowerCase().includes(lower) ||
      tags.some((t) => String(t).toLowerCase().includes(lower))
    );
  });

  /* ---------------------------------------------------------
   * 🗂 Sorteren (nieuwste eerst)
   * --------------------------------------------------------- */
  const sortedStrategies = [...filtered].sort(
    (a, b) =>
      new Date(b?.created_at || 0).getTime() -
      new Date(a?.created_at || 0).getTime()
  );

  /* ---------------------------------------------------------
   * 🧱 Render
   * --------------------------------------------------------- */
  return (
    <div className="space-y-6">
      {sortedStrategies.length === 0 ? (
        <div className="text-center text-gray-500 pt-6">
          📭 Geen strategieën gevonden
        </div>
      ) : (
        sortedStrategies.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            strategy={strategy}
            onRefresh={onRefresh}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))
      )}
    </div>
  );
}
