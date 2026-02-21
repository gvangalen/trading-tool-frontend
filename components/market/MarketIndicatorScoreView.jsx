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

  const [mode, setMode] = useState("standard");
  const [weight, setWeight] = useState(1);
  const [customRules, setCustomRules] = useState([]);

  /* -------------------------------------------------------
     Load indicator config (NEW API)
  ------------------------------------------------------- */
  const handleSelect = async (indicator) => {
    selectIndicator(indicator);
    if (!indicator?.name) return;

    try {
      const config = await fetchAuth(
        `/api/indicator_config/market/${indicator.name}`
      );

      setMode(config?.score_mode || "standard");
      setWeight(config?.weight ?? 1);
      setCustomRules(config?.rules || []);

    } catch (err) {
      console.error("config load error", err);
    }
  };

  /* -------------------------------------------------------
     ADD indicator
  ------------------------------------------------------- */
  const handleAdd = async () => {
    if (!selectedIndicator?.name) return;

    try {
      await addMarketIndicator(selectedIndicator.name);
      showSnackbar("Indicator toegevoegd", "success");
    } catch {
      showSnackbar("Toevoegen mislukt", "danger");
    }
  };

  /* -------------------------------------------------------
     CUSTOM RULES HELPERS
  ------------------------------------------------------- */

  const addRule = () =>
    setCustomRules([
      ...customRules,
      { range_min: 0, range_max: 100, score: 50 },
    ]);

  const updateRule = (i, field, value) => {
    const copy = [...customRules];
    copy[i][field] = Number(value);
    setCustomRules(copy);
  };

  const removeRule = (i) =>
    setCustomRules(customRules.filter((_, idx) => idx !== i));

  const saveCustom = async () => {
    await fetchAuth(`/api/indicator_config/custom`, {
      method: "POST",
      body: JSON.stringify({
        category: "market",
        indicator: selectedIndicator.name,
        rules: customRules,
      }),
    });

    showSnackbar("Custom regels opgeslagen", "success");
  };

  const saveMode = async (newMode) => {
    setMode(newMode);

    await fetchAuth(`/api/indicator_config/settings`, {
      method: "PUT",
      body: JSON.stringify({
        category: "market",
        indicator: selectedIndicator.name,
        score_mode: newMode,
        weight,
      }),
    });
  };

  /* -------------------------------------------------------
     UI helpers
  ------------------------------------------------------- */

  const displayScore = (score) =>
    mode === "contrarian" ? 100 - score : score;

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
        label="Zoek indicator"
        placeholder="Price, Volume, Change 24h…"
        items={availableIndicators}
        selected={selectedIndicator}
        onSelect={handleSelect}
      />

      {selectedIndicator && (
        <>
          {/* MODE SELECTOR */}
          <div className="flex gap-2 mt-4">
            {["standard", "contrarian", "custom"].map((m) => (
              <button
                key={m}
                onClick={() => saveMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  mode === m
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {mode === "contrarian" && (
            <div className="flex items-center gap-2 text-yellow-600 text-sm mt-2">
              <RefreshCw size={14} />
              Score wordt omgekeerd geïnterpreteerd
            </div>
          )}

          {/* WEIGHT — ONLY CUSTOM */}
          {mode === "custom" && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-1">
                Indicator gewicht
              </div>

              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full"
              />

              <div className="text-sm text-gray-500">
                Gewicht: {weight.toFixed(1)}
              </div>
            </div>
          )}

          {/* STANDARD RULE TABLE */}
          {mode !== "custom" && scoreRules.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">
                Scoreregels
              </h3>

              <table className="w-full text-sm border rounded-xl overflow-hidden">
                <tbody>
                  {scoreRules.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">
                        {r.range_min} – {r.range_max}
                      </td>
                      <td className="p-2 font-semibold text-center">
                        {displayScore(r.score)}
                      </td>
                      <td className="p-2 text-gray-500 italic">
                        {r.trend}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CUSTOM EDITOR */}
          {mode === "custom" && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold">Custom ranges</h3>

              {customRules.map((rule, i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    value={rule.range_min}
                    onChange={(e) =>
                      updateRule(i, "range_min", e.target.value)
                    }
                    className="p-2 rounded bg-gray-100"
                  />
                  <input
                    type="number"
                    value={rule.range_max}
                    onChange={(e) =>
                      updateRule(i, "range_max", e.target.value)
                    }
                    className="p-2 rounded bg-gray-100"
                  />
                  <input
                    type="number"
                    value={rule.score}
                    onChange={(e) =>
                      updateRule(i, "score", e.target.value)
                    }
                    className="p-2 rounded bg-gray-100"
                  />
                  <button
                    onClick={() => removeRule(i)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={addRule}
                className="text-blue-600 text-sm"
              >
                + Range toevoegen
              </button>

              <button
                onClick={saveCustom}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Custom regels opslaan
              </button>
            </div>
          )}

          {/* ADD BUTTON */}
          <button
            onClick={handleAdd}
            className="mt-6 px-4 py-2 rounded-lg bg-[var(--primary)] text-white"
          >
            <Plus size={16} /> Voeg toe
          </button>
        </>
      )}
    </CardWrapper>
  );
}
