"use client";

import { useState, useEffect } from "react";
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
  const [customRules, setCustomRules] = useState([]);

  /* -------------------------------------------------------
     Load indicator config
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
      setCustomRules(config.rules || []);

    } catch (err) {
      console.error("❌ config ophalen", err);
    }
  };

  /* -------------------------------------------------------
     Save settings
  ------------------------------------------------------- */
  const saveSettings = async (mode = scoreMode, rules = customRules) => {
    if (!selectedIndicator?.name) return;

    await fetchAuth(`/api/indicator-rules`, {
      method: "POST",
      body: JSON.stringify({
        indicator: selectedIndicator.name,
        category: "market",
        score_mode: mode,
        weight,
        rules: mode === "custom" ? rules : undefined,
      }),
    });

    showSnackbar("Score instellingen opgeslagen", "success");
  };

  /* -------------------------------------------------------
     Add custom rule
  ------------------------------------------------------- */
  const addRule = () => {
    setCustomRules([
      ...customRules,
      { range_min: 0, range_max: 100, score: 50, trend: "" },
    ]);
  };

  const updateRule = (i, field, value) => {
    const updated = [...customRules];
    updated[i][field] = value;
    setCustomRules(updated);
  };

  const removeRule = (i) => {
    setCustomRules(customRules.filter((_, idx) => idx !== i));
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

    await addMarketIndicator(selectedIndicator.name);
    showSnackbar("Market-indicator toegevoegd", "success");
  };

  /* -------------------------------------------------------
     Score display helpers
  ------------------------------------------------------- */
  const displayScore = (score) =>
    scoreMode === "contrarian" ? 100 - score : score;

  const scoreClass = (score) => {
    if (score >= 80) return "score-strong-buy";
    if (score >= 60) return "score-buy";
    if (score >= 40) return "score-neutral";
    if (score >= 20) return "score-sell";
    return "score-strong-sell";
  };

  /* -------------------------------------------------------
     Mode button styling
  ------------------------------------------------------- */
  const modeBtn = (mode) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      scoreMode === mode
        ? "bg-[var(--primary)] text-white"
        : "bg-[var(--bg-soft)] text-[var(--text-light)] hover:bg-[var(--card-border)]"
    }`;

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

      {/* MODE TOGGLE */}
      {selectedIndicator && (
        <div className="mt-5 flex gap-2">
          {["standard", "contrarian", "custom"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setScoreMode(m);
                saveSettings(m);
              }}
              className={modeBtn(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* CONTRARIAN INFO */}
      {scoreMode === "contrarian" && (
        <div className="flex items-center gap-2 text-sm text-yellow-600 mt-2">
          <RefreshCw size={14} />
          Score wordt omgekeerd geïnterpreteerd
        </div>
      )}

      {/* WEIGHT */}
      {selectedIndicator && (
        <div className="mt-5">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[var(--text-light)]">Indicator gewicht</span>
            <span className="font-medium">{weight.toFixed(1)}</span>
          </div>

          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={weight}
            onChange={(e) => {
              const w = Number(e.target.value);
              setWeight(w);
              saveSettings(scoreMode);
            }}
            className="w-full"
          />
        </div>
      )}

      {/* RULE TABLE */}
      {selectedIndicator && scoreRules.length > 0 && scoreMode !== "custom" && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3">
            Scoreregels voor:{" "}
            <span className="text-[var(--primary)]">
              {selectedIndicator.display_name || selectedIndicator.name}
            </span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[var(--card-border)]">
            <table className="w-full text-sm">
              <tbody>
                {[...scoreRules]
                  .sort((a, b) => a.range_min - b.range_min)
                  .map((r, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3">{r.range_min} – {r.range_max}</td>
                      <td className={`p-3 text-center font-semibold ${scoreClass(displayScore(r.score))}`}>
                        {displayScore(r.score)}
                      </td>
                      <td className="p-3 italic text-[var(--text-light)]">{r.trend}</td>
                      <td className="p-3">{r.interpretation}</td>
                      <td className="p-3 text-[var(--text-light)]">{r.action}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CUSTOM RULE EDITOR */}
      {scoreMode === "custom" && (
        <div className="mt-6 space-y-3">
          {customRules.map((rule, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <input type="number" value={rule.range_min}
                onChange={(e)=>updateRule(i,"range_min",Number(e.target.value))}
                className="p-2 rounded bg-[var(--bg-soft)]" />
              <input type="number" value={rule.range_max}
                onChange={(e)=>updateRule(i,"range_max",Number(e.target.value))}
                className="p-2 rounded bg-[var(--bg-soft)]" />
              <input type="number" value={rule.score}
                onChange={(e)=>updateRule(i,"score",Number(e.target.value))}
                className="p-2 rounded bg-[var(--bg-soft)]" />
              <button onClick={()=>removeRule(i)} className="text-red-500">✕</button>
            </div>
          ))}

          <button
            onClick={addRule}
            className="text-sm text-[var(--primary)] font-medium"
          >
            + Range toevoegen
          </button>

          <button
            onClick={()=>saveSettings("custom", customRules)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Custom regels opslaan
          </button>
        </div>
      )}

      {/* ADD BUTTON */}
      <div className="mt-6">
        <button
          onClick={handleAdd}
          disabled={!selectedIndicator || isAlreadyAdded}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:brightness-90 disabled:opacity-40"
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
