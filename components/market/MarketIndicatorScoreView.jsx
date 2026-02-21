"use client";

import { useState } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import UniversalSearchDropdown from "@/components/ui/UniversalSearchDropdown";
import IndicatorScorePanel from "@/components/scoring/IndicatorScorePanel";
import { Coins, Plus } from "lucide-react";
import { useModal } from "@/components/modal/ModalProvider";

export default function MarketIndicatorScoreView({
  availableIndicators = [],
  selectedIndicator, // mag je houden voor parent-state, maar we gebruiken local `indicator` voor UI
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
    selectIndicator?.(item);
  };

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

  const displayName =
    indicator?.display_name || indicator?.label || indicator?.name;

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

      {/* INTRO / EMPTY STATE (terug zoals “begin scherm”) */}
      {!indicator && (
        <div className="mt-4 text-sm text-[var(--text-light)]">
          <p className="italic">
            Selecteer een indicator om de scorelogica te bekijken en eventueel aan te passen.
          </p>

          <div className="mt-3 grid gap-2">
            <div className="flex items-start gap-2">
              <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-[var(--primary)]" />
              <div>
                <span className="font-medium text-[var(--text)]">Standard</span>{" "}
                = normale interpretatie van de standaard scoreregels.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-yellow-500" />
              <div>
                <span className="font-medium text-[var(--text)]">Contrarian</span>{" "}
                = score wordt omgekeerd gebruikt (mean-reversion / contrair).
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-[2px] inline-block h-2 w-2 rounded-full bg-purple-500" />
              <div>
                <span className="font-medium text-[var(--text)]">Custom</span>{" "}
                = eigen ranges + score (en alleen daar kun je het gewicht aanpassen).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SELECTED INDICATOR HEADER (naam fix) */}
      {indicator && (
        <div className="mt-4 flex items-center gap-3">
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

      {/* SCORE PANEL (NEW SYSTEM) */}
      {indicator && (
        <div className="mt-6">
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
