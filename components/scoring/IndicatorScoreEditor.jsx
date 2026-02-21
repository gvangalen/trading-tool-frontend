"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

/**
 * IndicatorScoreEditor
 *
 * ✔ Sync met backend via hook/panel
 * ✔ Reset bij indicator wissel
 * ✔ Ondersteunt standard / contrarian / custom
 * ✔ Weight support:
 *    - Weight ALTIJD zichtbaar
 *    - Slider ALLEEN bij custom
 */

export default function IndicatorScoreEditor({
  indicator,
  category,
  rules = [],
  scoreMode = "standard",
  weight = 1,
  loading = false,
  onSave,
  onSaveCustom,
}) {
  const [mode, setMode] = useState(scoreMode);
  const [customRules, setCustomRules] = useState(rules);
  const [localWeight, setLocalWeight] = useState(weight);

  /* --------------------------------------------------
     Sync wanneer backend data verandert
  -------------------------------------------------- */
  useEffect(() => {
    setMode(scoreMode);
    setCustomRules(rules || []);
    setLocalWeight(weight ?? 1);
  }, [indicator, scoreMode, rules, weight]);

  /* --------------------------------------------------
     Auto save STANDARD & CONTRARIAN (mode + weight opslaan)
     (custom wordt apart opgeslagen via Save Custom Rules)
  -------------------------------------------------- */
  useEffect(() => {
    if (loading) return;
    if (mode === "custom") return;

    onSave?.({
      score_mode: mode,
      weight: localWeight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, localWeight, loading]);

  /* --------------------------------------------------
     Custom rule helpers
  -------------------------------------------------- */
  const addRule = () => {
    setCustomRules([
      ...customRules,
      { range_min: 0, range_max: 100, score: 50, trend: "" },
    ]);
  };

  const updateRule = (index, field, value) => {
    const updated = [...customRules];
    updated[index][field] = value;
    setCustomRules(updated);
  };

  const removeRule = (index) => {
    setCustomRules(customRules.filter((_, i) => i !== index));
  };

  const saveCustomRules = () => {
    onSaveCustom?.(customRules);
  };

  /* --------------------------------------------------
     UI modes
  -------------------------------------------------- */
  const modes = [
    { key: "standard", label: "Standard" },
    { key: "contrarian", label: "Contrarian" },
    { key: "custom", label: "Custom" },
  ];

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Laden…
      </div>
    );
  }

  const weightBadge = (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs">
      <span className="font-medium">Weight</span>
      <span className="font-semibold">{Number(localWeight).toFixed(1)}</span>
      {mode !== "custom" && (
        <span className="text-gray-400">(standaard)</span>
      )}
    </span>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-gray-800">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            Score Logica
          </h3>
          <p className="text-sm text-gray-500">
            Pas aan hoe deze indicator wordt geïnterpreteerd.
          </p>
        </div>

        {/* Weight altijd zichtbaar (badge) */}
        <div className="shrink-0">
          {weightBadge}
        </div>
      </div>

      {/* MODE TOGGLE */}
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === m.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* INFO */}
      {mode === "contrarian" && (
        <div className="text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-900/40 rounded-xl px-4 py-3">
          Score wordt automatisch omgekeerd gebruikt (contrarian / mean-reversion).
        </div>
      )}

      {mode === "custom" && (
        <div className="text-sm text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 rounded-xl px-4 py-3">
          Custom = je definieert je eigen ranges + scores. Hier kun je ook het gewicht aanpassen.
        </div>
      )}

      {/* STANDARD / CONTRARIAN RULES */}
      {(mode === "standard" || mode === "contrarian") && (
        <div className="space-y-2">
          <div className="text-sm font-medium">
            Scoreregels
          </div>

          <div className="border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-left">
                <tr>
                  <th className="p-2">Range</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">
                      {r.range_min} – {r.range_max}
                    </td>
                    <td className="p-2 font-semibold">
                      {mode === "contrarian"
                        ? 100 - r.score
                        : r.score}
                    </td>
                    <td className="p-2 text-gray-500">
                      {r.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bij standard/contrarian: géén slider, alleen badge bovenaan */}
        </div>
      )}

      {/* CUSTOM EDITOR */}
      {mode === "custom" && (
        <div className="space-y-4">
          {/* Weight slider alleen bij custom */}
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Indicator weight
            </div>

            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={localWeight}
              onChange={(e) => setLocalWeight(Number(e.target.value))}
              className="w-full"
            />

            <div className="text-sm text-gray-500">
              Gewicht: {Number(localWeight).toFixed(1)}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="font-medium text-sm">
              Custom ranges
            </div>

            <button
              onClick={addRule}
              className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {/* Custom rows */}
          <div className="space-y-2">
            {customRules.map((rule, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-2 items-center"
              >
                <input
                  type="number"
                  value={rule.range_min}
                  onChange={(e) =>
                    updateRule(index, "range_min", Number(e.target.value))
                  }
                  className="p-2 rounded bg-gray-100 dark:bg-gray-800"
                  placeholder="min"
                />

                <input
                  type="number"
                  value={rule.range_max}
                  onChange={(e) =>
                    updateRule(index, "range_max", Number(e.target.value))
                  }
                  className="p-2 rounded bg-gray-100 dark:bg-gray-800"
                  placeholder="max"
                />

                <input
                  type="number"
                  value={rule.score}
                  onChange={(e) =>
                    updateRule(index, "score", Number(e.target.value))
                  }
                  className="p-2 rounded bg-gray-100 dark:bg-gray-800"
                  placeholder="score"
                />

                <button
                  onClick={() => removeRule(index)}
                  className="text-red-500"
                  title="Verwijder range"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={saveCustomRules}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:brightness-95"
          >
            Save Custom Rules
          </button>
        </div>
      )}
    </div>
  );
}
