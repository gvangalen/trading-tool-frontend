"use client";

import { useState } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import UniversalSearchDropdown from "@/components/ui/UniversalSearchDropdown";
import { Coins, Plus, RefreshCw } from "lucide-react";
import { useModal } from "@/components/modal/ModalProvider";
import { fetchAuth } from "@/lib/api/auth";

export default function MarketIndicatorScoreView({
  availableIndicators = [],
  selectedIndicator,
  scoreRules = [],
  selectIndicator,
  addMarketIndicator,
  activeIndicators = [],
}) {
  const { showSnackbar } = useModal();

  const [scoreMode, setScoreMode] = useState("standard");
  const [weight, setWeight] = useState(1);

  /* -------------------------------------------------------
     Indicator select + config ophalen
  ------------------------------------------------------- */
  const handleSelect = async (indicator) => {
    selectIndicator(indicator);

    if (!indicator?.name) return;

    try {
      const config = await fetchAuth(
        `/api/indicator-rules?category=market&indicator=${indicator.name}`
      );

      setScoreMode(config.score_mode || "standard");
      setWeight(config.weight ?? 1);

    } catch (err) {
      console.error("❌ config ophalen", err);
    }
  };

  /* -------------------------------------------------------
     Already added?
  ------------------------------------------------------- */
  const isAlreadyAdded =
    selectedIndicator &&
    activeIndicators.includes(selectedIndicator.name);

  /* -------------------------------------------------------
     Add indicator
  ------------------------------------------------------- */
  const handleAdd = async () => {
    if (!selectedIndicator?.name || isAlreadyAdded) return;

    try {
      await addMarketIndicator(selectedIndicator.name);
      showSnackbar("Market-indicator toegevoegd", "success");
    } catch (err) {
      console.error("❌ Toevoegen mislukt:", err);

      if (err?.response?.status === 409) {
        showSnackbar("Indicator is al toegevoegd", "info");
        return;
      }

      showSnackbar("Toevoegen mislukt", "danger");
    }
  };

  /* -------------------------------------------------------
     Score helpers
  ------------------------------------------------------- */
  const scoreClass = (score) => {
    if (typeof score !== "number") return "text-[var(--text-light)]";
    if (score >= 80) return "score-strong-buy";
    if (score >= 60) return "score-buy";
    if (score >= 40) return "score-neutral";
    if (score >= 20) return "score-sell";
    return "score-strong-sell";
  };

  const displayScore = (score) => {
    if (scoreMode === "contrarian") return 100 - score;
    return score;
  };

  const modeBadge = () => {
    if (scoreMode === "contrarian")
      return "bg-yellow-100 text-yellow-700";
    if (scoreMode === "custom")
      return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-600";
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
      {/* SEARCH */}
      <UniversalSearchDropdown
        label="Zoek een market-indicator"
        placeholder="Typ bijvoorbeeld Price, Volume, Change 24h…"
        items={availableIndicators}
        selected={selectedIndicator}
        onSelect={handleSelect}
      />

      {/* MODE + WEIGHT */}
      {selectedIndicator && (
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className={`px-2 py-1 rounded ${modeBadge()}`}>
            Mode: {scoreMode}
          </span>

          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
            Weight: {weight}
          </span>

          {scoreMode === "contrarian" && (
            <span className="flex items-center gap-1 text-yellow-600">
              <RefreshCw size={12} />
              Omgekeerde interpretatie
            </span>
          )}
        </div>
      )}

      {/* RULES */}
      {selectedIndicator && scoreRules.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">
            Scoreregels voor:{" "}
            <span className="text-[var(--primary)]">
              {selectedIndicator.display_name ||
                selectedIndicator.name}
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
                      className="border-t hover:bg-[var(--bg-soft)] transition"
                    >
                      <td className="p-3">
                        {r.range_min} – {r.range_max}
                      </td>

                      <td
                        className={`p-3 text-center font-semibold ${scoreClass(
                          displayScore(r.score)
                        )}`}
                      >
                        {displayScore(r.score)}
                      </td>

                      <td className="p-3 text-center italic text-[var(--text-light)]">
                        {r.trend}
                      </td>

                      <td className="p-3">
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
        <p className="mt-4 text-sm italic text-[var(--text-light)]">
          Selecteer een indicator om de scoreregels te bekijken.
        </p>
      )}

      {/* ADD BUTTON */}
      <div className="mt-5">
        <button
          onClick={handleAdd}
          disabled={!selectedIndicator || isAlreadyAdded}
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
          {isAlreadyAdded
            ? "Indicator al toegevoegd"
            : "Voeg toe aan market-analyse"}
        </button>
      </div>
    </CardWrapper>
  );
}
