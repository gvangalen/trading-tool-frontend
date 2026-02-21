"use client";

import { useState, useEffect } from "react";
import {
  getMacroIndicatorNames,
} from "@/lib/api/macro";

import CardWrapper from "@/components/ui/CardWrapper";
import UniversalSearchDropdown from "@/components/ui/UniversalSearchDropdown";
import IndicatorScorePanel from "@/components/scoring/IndicatorScorePanel";

import { BarChart2, Plus } from "lucide-react";
import { useModal } from "@/components/modal/ModalProvider";

/* =========================================================
   Macro Indicator Score View — Uses IndicatorScorePanel
========================================================= */
export default function MacroIndicatorScoreView({
  addMacroIndicator,
  activeMacroIndicatorNames = [],
}) {
  const [allIndicators, setAllIndicators] = useState([]);
  const [selected, setSelected] = useState(null);

  const { showSnackbar } = useModal();

  /* -------------------------------------------------------
     📡 Indicatorlijst ophalen
  ------------------------------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        const list = await getMacroIndicatorNames();
        setAllIndicators(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("❌ macro indicators ophalen:", err);
        showSnackbar("Kon macro-indicatoren niet ophalen.", "danger");
      }
    }
    load();
  }, []);

  /* -------------------------------------------------------
     Select indicator
  ------------------------------------------------------- */
  const handleSelect = (indicator) => {
    setSelected(indicator);
  };

  /* -------------------------------------------------------
     Already added?
  ------------------------------------------------------- */
  const isAlreadyAdded =
    selected && activeMacroIndicatorNames.includes(selected.name);

  /* -------------------------------------------------------
     Add indicator
  ------------------------------------------------------- */
  const handleAdd = async () => {
    if (!selected?.name || isAlreadyAdded) return;

    try {
      await addMacroIndicator(selected.name);
      showSnackbar(
        `${selected.display_name || selected.name} toegevoegd aan macro-analyse.`,
        "success"
      );
    } catch {
      showSnackbar("Toevoegen mislukt.", "danger");
    }
  };

  const displayName =
    selected?.display_name ||
    selected?.label ||
    selected?.name;

  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[var(--primary)]" />
          <span>Macro Indicator Scorelogica</span>
        </div>
      }
    >
      {/* SEARCH */}
      <UniversalSearchDropdown
        label="Zoek een macro-indicator"
        placeholder="DXY, CPI, rente, BTC dominantie…"
        items={allIndicators}
        selected={selected}
        onSelect={handleSelect}
      />

      {/* EMPTY STATE */}
      {!selected && (
        <div className="mt-4 text-sm text-[var(--text-light)] italic">
          Selecteer een indicator om de scorelogica te bekijken en aan te passen.
        </div>
      )}

      {/* SELECTED HEADER */}
      {selected && (
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

      {/* SCORE PANEL (zelfde als market) */}
      {selected && (
        <div className="mt-5 border-t pt-5">
          <IndicatorScorePanel
            category="macro"
            indicator={selected.name}
          />
        </div>
      )}

      {/* ADD BUTTON */}
      {selected && (
        <button
          onClick={handleAdd}
          disabled={isAlreadyAdded}
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
          {isAlreadyAdded
            ? "Indicator al toegevoegd"
            : "Toevoegen aan Macro-analyse"}
        </button>
      )}
    </CardWrapper>
  );
}
