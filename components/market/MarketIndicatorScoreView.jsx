"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import UniversalSearchDropdown from "@/components/ui/UniversalSearchDropdown";
import IndicatorScorePanel from "@/components/scoring/IndicatorScorePanel";

import { Coins, Plus } from "lucide-react";
import { useModal } from "@/components/modal/ModalProvider";

export default function MarketIndicatorScoreView({
  availableIndicators = [],
  selectedIndicator,
  scoreRules = [],
  selectIndicator,
  addMarketIndicator,
  activeIndicators = [],
}) {
  const { showSnackbar } = useModal();

  /* -------------------------------------------------------
     Indicator select (parent regelt rules ophalen)
  ------------------------------------------------------- */
  const handleSelect = (indicator) => {
    selectIndicator(indicator);
  };

  /* -------------------------------------------------------
     Already added?
  ------------------------------------------------------- */
  const isAlreadyAdded =
    !!selectedIndicator?.name &&
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

      {!selectedIndicator?.name && (
        <p className="mt-4 text-sm italic text-[var(--text-light)]">
          Selecteer een indicator om de scoreregels en instellingen te bekijken.
        </p>
      )}

      {selectedIndicator?.name && (
        <>
          {/* ======================================================
              ✅ PRO SCORE CONFIG (nieuw systeem)
              - standard / contrarian / custom
              - weight
              - custom rules editor
              - opslaan / reset
             ====================================================== */}
          <div className="mt-6">
            <IndicatorScorePanel
              category="market"
              indicator={selectedIndicator.name}
            />
          </div>

          {/* ======================================================
              RULES VIEW (read-only) — regels uit market_indicator_rules
             ====================================================== */}
          {scoreRules?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">
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
                          className="border-t hover:bg-[var(--bg-soft)] transition"
                        >
                          <td className="p-3">
                            {r.range_min} – {r.range_max}
                          </td>

                          <td className="p-3 text-center font-semibold">
                            {r.score}
                          </td>

                          <td className="p-3 text-center italic text-[var(--text-light)]">
                            {r.trend}
                          </td>

                          <td className="p-3">{r.interpretation}</td>

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

          {/* ADD BUTTON */}
          <div className="mt-6">
            <button
              onClick={handleAdd}
              disabled={!selectedIndicator?.name || isAlreadyAdded}
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
        </>
      )}
    </CardWrapper>
  );
}
