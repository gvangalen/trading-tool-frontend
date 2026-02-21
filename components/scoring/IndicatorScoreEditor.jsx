"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

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

  /* sync bij wissel */
  useEffect(() => {
    setMode(scoreMode);
    setCustomRules(rules || []);
    setLocalWeight(weight ?? 1);
  }, [indicator, scoreMode, rules, weight]);

  /* autosave standard & contrarian */
  useEffect(() => {
    if (loading) return;
    if (mode === "custom") return;

    onSave?.({
      score_mode: mode,
      weight: 1, // standaard weight
    });
  }, [mode]);

  /* helpers */

  const addRule = () => {
    setCustomRules([
      ...customRules,
      { range_min: 0, range_max: 100, score: 50, trend: "" },
    ]);
  };

  const updateRule = (i, field, value) => {
    const copy = [...customRules];
    copy[i][field] = value;
    setCustomRules(copy);
  };

  const removeRule = (i) =>
    setCustomRules(customRules.filter((_, idx) => idx !== i));

  const saveCustomRules = () => {
    onSaveCustom?.(customRules, localWeight);
  };

  const modes = [
    { key: "standard", label: "Standard" },
    { key: "contrarian", label: "Contrarian" },
    { key: "custom", label: "Custom" },
  ];

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Laden…</div>;
  }

  return (
    <div className="mt-6 p-5 rounded-2xl border border-[var(--card-border)] bg-[var(--bg-soft)] space-y-6">

      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold">Score Logica</h3>
        <p className="text-sm text-[var(--text-light)]">
          Pas aan hoe deze indicator wordt geïnterpreteerd.
        </p>
      </div>

      {/* MODE SELECTOR */}
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

      {/* CONTRARIAN INFO */}
      {mode === "contrarian" && (
        <div className="text-sm text-yellow-600">
          Score wordt automatisch omgekeerd geïnterpreteerd.
        </div>
      )}

      {/* STANDARD / CONTRARIAN VIEW */}
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
                      {mode === "contrarian" ? 100 - r.score : r.score}
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

      {/* CUSTOM MODE */}
      {mode === "custom" && (
        <div className="space-y-4">

          <div className="text-sm text-[var(--text-light)]">
            Gebruik custom ranges als je eigen interpretatie wilt definiëren.
            Niet nodig voor standaard gebruik.
          </div>

          <div className="flex justify-between items-center">
            <div className="font-medium text-sm">
              Definieer eigen score ranges
            </div>

            <button
              onClick={addRule}
              className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded-lg"
            >
              <Plus size={14} /> Add
            </button>
          </div>

          {customRules.map((rule, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <input
                type="number"
                value={rule.range_min}
                onChange={(e) => updateRule(i, "range_min", Number(e.target.value))}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800"
              />
              <input
                type="number"
                value={rule.range_max}
                onChange={(e) => updateRule(i, "range_max", Number(e.target.value))}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800"
              />
              <input
                type="number"
                value={rule.score}
                onChange={(e) => updateRule(i, "score", Number(e.target.value))}
                className="p-2 rounded bg-gray-100 dark:bg-gray-800"
              />
              <button onClick={() => removeRule(i)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button
            onClick={saveCustomRules}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Opslaan & toepassen
          </button>

          {/* WEIGHT SLIDER */}
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Indicator gewicht
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
              Gewicht: {localWeight.toFixed(1)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
