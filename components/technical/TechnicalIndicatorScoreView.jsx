"use client";

import { useState, useEffect } from "react";
import {
  getIndicatorNames as getTechnicalIndicatorNames,
} from "@/lib/api/technical";

import CardWrapper from "@/components/ui/CardWrapper";
import UniversalSearchDropdown from "@/components/ui/UniversalSearchDropdown";
import IndicatorScorePanel from "@/components/scoring/IndicatorScorePanel";

import { BarChart2, Plus } from "lucide-react";
import { useModal } from "@/components/modal/ModalProvider";

/* =========================================================
   Technical Indicator Score View — Uses IndicatorScorePanel
========================================================= */
export default function TechnicalIndicatorScoreView({
  addTechnicalIndicator,
  activeTechnicalIndicatorNames = [],
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
        const list = await getTechnicalIndicatorNames();
        setAllIndicators(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("❌ technical indicators ophalen", err);
        showSnackbar("Kon indicatorlijst niet ophalen.", "danger");
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
    selected &&
    activeTechnicalIndicatorNames.includes(selected.name);

  /* -------------------------------------------------------
     ➕ Toevoegen
  ------------------------------------------------------- */
  const handleAdd = async () => {
    if (!selected?.name || isAlreadyAdded) return;

    try {
      await addTechnicalIndicator(selected.name);

      showSnackbar(
        `${selected.display_name || selected.name} toegevoegd aan technische analyse.`,
        "success"
      );
    } catch (err) {
      console.error("❌ Toevoegen mislukt", err);
      showSnackbar("Toevoegen mislukt. Probeer opnieuw.", "danger");
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
          <span>Technische Indicator Scorelogica</span>
        </div>
      }
    >
      {/* 🔍 Search */}
      <UniversalSearchDropdown
        label="Zoek een technische indicator"
        items={allIndicators}
        selected={selected}
        onSelect={handleSelect}
        placeholder="RSI, MA200, Volume..."
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

      {/* SCORE PANEL */}
      {selected && (
        <div className="mt-5 border-t pt-5">
          <IndicatorScorePanel
            category="technical"
            indicator={selected.name}
          />
        </div>
      )}

      {/* ➕ ADD */}
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
            : "Voeg toe aan technische analyse"}
        </button>
      )}
    </CardWrapper>
  );
}
