"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

/**
 * IndicatorScoreEditor
 *
 * ✔ Sync met backend via hook
 * ✔ Reset bij indicator wissel
 * ✔ Ondersteunt standard / contrarian / custom
 * ✔ Weight support
 *
 * Props:
 *  indicator
 *  category
 *  rules
 *  scoreMode
 *  weight
 *  loading
 *  onSave(settings)
 *  onSaveCustom(rules)
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
     Auto save STANDARD & CONTRARIAN
  -------------------------------------------------- */
  useEffect(() => {
    if (loading) return;
    if (mode === "custom") return;

    onSave?.({
      score_mode: mode,
      weight: localWeight,
    });
  }, [mode, localWeight]);

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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-gray-800">

      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold">
          Score Logica
        </h3>
        <p className="text-sm text-gray-500">
          Pas aan hoe deze indicator wordt geïnterpreteerd.
        </p>
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
        <div className="text-sm text-yellow-600">
          Score wordt automatisch omgekeerd gebruikt.
        </div>
      )}

      {/* STANDARD / CONTRARIAN RULES */}
      {(mode === "standard" || mode === "contrarian") && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Scoreregels</div>

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
        </div>
      )}

      {/* CUSTOM EDITOR */}
      {mode === "custom" && (
        <div className="space-y-3">

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
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={saveCustomRules}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Save Custom Rules
          </button>
        </div>
      )}

      {/* WEIGHT */}
      <div className="space-y-2">
        <div className="text-sm font-medium">
          Indicator weight
        </div>

        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={localWeight}
          onChange={(e) => setLocalWeight(Number(e.target.value))}
          className="w-full"
        />

        <div className="text-sm text-gray-500">
          Gewicht: {localWeight.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
