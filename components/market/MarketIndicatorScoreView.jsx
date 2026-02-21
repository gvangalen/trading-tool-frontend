"use client";

import { useState } from "react";
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
  const [indicator, setIndicator] = useState(null);

  /* ---------------------------
     Select indicator
  --------------------------- */
  const handleSelect = (item) => {
    setIndicator(item);
    selectIndicator(item);
  };

  /* ---------------------------
     Indicator display name
  --------------------------- */
  const indicatorName =
    indicator?.display_name ||
    indicator?.name ||
    "";

  /* ---------------------------
     Already added?
  --------------------------- */
  const isAdded =
    indicator && activeIndicators.includes(indicator.name);

  /* ---------------------------
     Add indicator
  --------------------------- */
  const handleAdd = async () => {
    if (!indicator || isAdded) return;

    try {
      await addMarketIndicator(indicator.name);
      showSnackbar("Indicator toegevoegd", "success");
    } catch {
      showSnackbar("Toevoegen mislukt", "danger");
    }
  };

  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-[var(--primary)]" />
          Market Indicator Scorelogica
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

      {/* ACTIVE INDICATOR HEADER */}
      {indicator && (
        <div className="mt-5 mb-2 flex items-center gap-3">
          <div className="
            px-3 py-1 rounded-full
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white text-sm font-semibold
            shadow-sm
          ">
            {indicatorName}
          </div>

          <span className="text-xs text-gray-500">
            momenteel bewerken
          </span>
        </div>
      )}

      {/* SCORE PANEL (NEW SYSTEM) */}
      {indicator && (
        <div className="mt-3">
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
