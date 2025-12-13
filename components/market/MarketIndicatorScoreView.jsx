"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import UniversalSearchDropdown from "@/components/ui/UniversalSearchDropdown";
import { Coins, Plus } from "lucide-react";

import { useModal } from "@/components/modal/ModalProvider";

export default function MarketIndicatorScoreView({
  availableIndicators,
  selectedIndicator,
  scoreRules,
  selectIndicator,
  addMarketIndicator,
}) {
  const { showSnackbar } = useModal();

  /* -------------------------------------------------------
     ➕ Toevoegen (via centrale snackbar)
  ------------------------------------------------------- */
  const handleAdd = async () => {
    if (!selectedIndicator?.name) return;

    try {
      await addMarketIndicator(selectedIndicator.name);
      showSnackbar("Market-indicator toegevoegd", "success");
    } catch (err) {
      console.error("❌ Toevoegen mislukt:", err);
      showSnackbar("Toevoegen van market-indicator mislukt", "danger");
    }
  };

  /* -------------------------------------------------------
     Scorekleur
  ------------------------------------------------------- */
  const scoreClass = (score) => {
    if (typeof score !== "number") return "text-[var(--text-light)]";

    if (score >= 80) return "score-strong-buy";
    if (score >= 60) return "score-buy";
    if (score >= 40) return "score-neutral";
    if (score >= 20) return "score-sell";
    return "score-strong-sell";
  };

  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-[var(--primary)]" />
          <span>Market Indicator Scorelogica</span>
        </div>
      }
    >
      {/* -------------------------------------------------------
         🔍 Indicator zoeken
      ------------------------------------------------------- */}
      <UniversalSearchDropdown
        label="Zoek een market-indicator"
        placeholder="Typ bijvoorbeeld Price, Volume, Change 24h…"
        items={availableIndicators}
        selected={selectedIndicator}
        onSelect={selectIndicator}
      />

      {/* -------------------------------------------------------
         📊 Scoreregels
      ------------------------------------------------------- */}
      {selectedIndicator && scoreRules.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-3">
            Scoreregels voor:{" "}
            <span className="text-[var(--primary)]">
              {selectedIndicator.display_name || selectedIndicator.name}
            </span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--bg-soft)] text-xs uppercase text-[var(--text-light)]">
                <tr>
                  <th className="p-3 text-left">Range</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Trend</th>
                  <th className="p-3 text-left">Interpretatie</th>
                  <th className="p-3 text-left">Actie</th>
                </tr>
              </thead>

              <tbody>
                {[...scoreRules]
                  .sort((a, b) => a.range_min - b.range_min)
                  .map((r, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition"
                    >
                      <td className="p-3">
                        {r.range_min} – {r.range_max}
                      </td>

                      <td
                        className={`p-3 text-center font-semibold ${scoreClass(
                          r.score
                        )}`}
                      >
                        {r.score}
                      </td>

                      <td className="p-3 text-center italic text-[var(--text-light)]">
                        {r.trend}
                      </td>

                      <td className="p-3 text-[var(--text-dark)]">
                        {r.interpretation}
                      </td>

                      <td className="p-3 text-[var(--text-light)]">
                        {r.action}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedIndicator && (
        <p className="mt-4 text-sm text-[var(--text-light)] italic">
          Selecteer een indicator om de scoreregels te bekijken.
        </p>
      )}

      {/* -------------------------------------------------------
         ➕ Toevoegen knop
      ------------------------------------------------------- */}
      <div className="mt-5">
        <button
          onClick={handleAdd}
          disabled={!selectedIndicator}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-[var(--primary)]
            text-white
            font-medium
            hover:brightness-90
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          <Plus size={18} />
          Voeg toe aan market-analyse
        </button>
      </div>
    </CardWrapper>
  );
}
