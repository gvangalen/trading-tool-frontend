"use client";

import { useEffect, useState } from "react";

import {
  getIndicatorNames as getTechnicalIndicatorNames,
  getScoreRulesForIndicator,
} from "@/lib/api/technical";

import CardWrapper from "@/components/ui/CardWrapper";
import UniversalSearchDropdown from "@/components/ui/UniversalSearchDropdown";

import { BarChart2, Plus } from "lucide-react";

// ⭐ Jouw snackbar + modal systeem
import { useModal } from "@/components/ui/ModalProvider";

export default function TechnicalIndicatorScoreView({ addTechnicalIndicator }) {
  const [allIndicators, setAllIndicators] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);

  // ⭐ Snackbar functie uit eigen systeem
  const { showSnackbar } = useModal();

  /* -------------------------------------------------------
     📡 Indicatorlijst ophalen
  ------------------------------------------------------- */
  useEffect(() => {
    async function load() {
      try {
        const list = await getTechnicalIndicatorNames();
        setAllIndicators(list || []);
      } catch (err) {
        console.error("❌ technical indicators ophalen", err);

        showSnackbar(
          "Kon indicatorlijst niet ophalen.",
          "danger"
        );
      }
    }
    load();
  }, []);

  /* -------------------------------------------------------
     📊 Scoreregels ophalen
  ------------------------------------------------------- */
  const onSelect = async (indicator) => {
    setSelected(indicator);

    if (!indicator?.name) {
      setScoreRules([]);
      return;
    }

    try {
      const rules = await getScoreRulesForIndicator(indicator.name);
      setScoreRules(rules || []);
    } catch (err) {
      console.error("❌ scoreregels ophalen", err);

      showSnackbar(
        "Kon scoreregels niet ophalen.",
        "danger"
      );
    }
  };

  /* -------------------------------------------------------
     ➕ Toevoegen
  ------------------------------------------------------- */
  const handleAdd = async () => {
    if (!selected) return;

    if (!addTechnicalIndicator) {
      console.warn("⚠️ addTechnicalIndicator missing in parent");

      showSnackbar("Toevoegfunctie ontbreekt!", "danger");
      return;
    }

    try {
      await addTechnicalIndicator(selected.name);

      // ⭐ Gebruik snackbar i.p.v. simpele melding
      showSnackbar(
        `${selected.display_name || selected.name} toegevoegd aan technische analyse.`,
        "success"
      );
    } catch (err) {
      console.error("❌ Toevoegen mislukt", err);

      showSnackbar("Toevoegen mislukt. Probeer opnieuw.", "danger");
    }
  };

  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-[var(--primary)]" />
          <span>Technische Indicator Scorelogica</span>
        </div>
      }
    >
      <UniversalSearchDropdown
        label="Zoek een technische indicator"
        items={allIndicators}
        selected={selected}
        onSelect={onSelect}
        placeholder="Typ bijvoorbeeld RSI, MA200, Volume..."
      />

      {/* -------------------------------------------------------
         📊 TABEL MET SCOREREGELS
      ------------------------------------------------------- */}
      {selected && scoreRules.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-3">
            Scoreregels voor:{" "}
            <span className="text-[var(--primary)]">
              {selected.display_name || selected.name}
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
                {scoreRules
                  .sort((a, b) => Number(a.range_min) - Number(b.range_min))
                  .map((r, idx) => {
                    const scoreClass =
                      r.score >= 80
                        ? "score-strong-buy"
                        : r.score >= 60
                        ? "score-buy"
                        : r.score >= 40
                        ? "score-neutral"
                        : r.score >= 20
                        ? "score-sell"
                        : "score-strong-sell";

                    return (
                      <tr
                        key={idx}
                        className="border-t border-[var(--card-border)] hover:bg-[var(--bg-soft)] transition"
                      >
                        <td className="p-3">{r.range_min} – {r.range_max}</td>
                        <td className={`p-3 text-center font-semibold ${scoreClass}`}>
                          {r.score}
                        </td>
                        <td className="p-3 text-center italic text-[var(--text-light)]">
                          {r.trend}
                        </td>
                        <td className="p-3">{r.interpretation}</td>
                        <td className="p-3 text-[var(--text-light)]">{r.action}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selected && (
        <p className="mt-4 text-sm text-[var(--text-light)] italic">
          Selecteer een indicator om de scoreregels te bekijken.
        </p>
      )}

      {/* -------------------------------------------------------
         ➕ KNOP
      ------------------------------------------------------- */}
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={handleAdd}
          disabled={!selected}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-[var(--primary)]
            text-white
            font-medium
            hover:bg-blue-700
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
          "
        >
          <Plus size={18} />
          Voeg toe aan technische analyse
        </button>
      </div>
    </CardWrapper>
  );
}
