"use client";

import { useState, useEffect } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import UniversalSearchDropdown from "@/components/ui/UniversalSearchDropdown";
import IndicatorScorePanel from "@/components/scoring/IndicatorScorePanel";
import { Coins, Plus } from "lucide-react";
import { useModal } from "@/components/modal/ModalProvider";

export default function MarketIndicatorScoreView({
  availableIndicators = [],
  selectedIndicator,
  selectIndicator,
  addMarketIndicator,
  activeIndicators = [],
}) {
  const { showSnackbar } = useModal();
  const [indicator, setIndicator] = useState(selectedIndicator || null);

  /* --------------------------------------------------
     Sync met parent state
  -------------------------------------------------- */
  useEffect(() => {
    if (selectedIndicator) {
      setIndicator(selectedIndicator);
    }
  }, [selectedIndicator]);

  /* --------------------------------------------------
     Select indicator
  -------------------------------------------------- */
  const handleSelect = (item) => {
    setIndicator(item);
    selectIndicator?.(item);
  };

  /* --------------------------------------------------
     Already added?
  -------------------------------------------------- */
  const isAdded =
    indicator && activeIndicators.includes(indicator.name);

  /* --------------------------------------------------
     Add indicator
  -------------------------------------------------- */
  const handleAdd = async () => {
    if (!indicator || isAdded) return;

    try {
      await addMarketIndicator(indicator.name);
      showSnackbar("Indicator toegevoegd", "success");
    } catch {
      showSnackbar("Toevoegen mislukt", "danger");
    }
  };

  /* --------------------------------------------------
     Display name helper
  -------------------------------------------------- */
  const displayName =
    indicator?.display_name ||
    indicator?.label ||
    indicator?.name;

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
        placeholder="Price, Volume, Change 24h…"
        items={availableIndicators}
        selected={indicator}
        onSelect={handleSelect}
      />

      {/* EMPTY STATE (clean & rustig) */}
      {!indicator && (
        <div className="mt-4 text-sm text-[var(--text-light)] italic">
          Selecteer een indicator om de scorelogica te bekijken en aan te passen.
        </div>
      )}

      {/* SELECTED INDICATOR HEADER */}
      {indicator && (
        <div className="mt-5 flex items-center gap-3">
          <span
            className="
              inline-flex items-center
              px-3 py-1 rounded-full
              bg-[var(--primary)]
              text-white text-sm font-semibold
            "
          >
            {displayName}
          </span>

          <span className="text-sm text-[var(--text-light)]">
            momenteel bewerken
          </span>
        </div>
      )}

      {/* SCORE PANEL */}
      {indicator && (
        <div className="mt-5 border-t pt-5">
          <IndicatorScorePanel
            category="market"
            indicator={indicator.name}
          />
        </div>
      )}

      {/* ADD BUTTON */}
      {indicator && (
        <button
          onClick={handleAdd}
          disabled={isAdded}
          className="
            mt-6 flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-[var(--primary)]
            text-white
            font-medium
            hover:brightness-90
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          <Plus size={16} />
          {isAdded
            ? "Indicator al toegevoegd"
            : "Voeg toe aan analyse"}
        </button>
      )}
    </CardWrapper>
  );
}
