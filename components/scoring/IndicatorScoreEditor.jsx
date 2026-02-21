"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, RefreshCw } from "lucide-react";

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

  /* ---------------- sync ---------------- */
  useEffect(() => {
    setMode(scoreMode || "standard");
    setCustomRules(Array.isArray(rules) ? rules : []);
    setLocalWeight(weight ?? 1);
  }, [indicator, scoreMode, rules, weight]);

  /* auto save standard & contrarian */
  useEffect(() => {
    if (loading) return;
    if (!indicator || !category) return;
    if (mode === "custom") return;

    onSave?.({
      score_mode: mode,
      weight: localWeight,
    });
  }, [mode, localWeight, loading, indicator, category]);

  /* ---------------- helpers ---------------- */

  const modes = [
    { key: "standard", label: "Standard" },
    { key: "contrarian", label: "Contrarian" },
    { key: "custom", label: "Custom" },
  ];

  const displayScore = (s) =>
    mode === "contrarian" ? 100 - Number(s || 0) : Number(s || 0);

  const sortedRules = useMemo(() => {
    const arr = Array.isArray(rules) ? [...rules] : [];
    return arr.sort((a, b) => (a.range_min ?? 0) - (b.range_min ?? 0));
  }, [rules]);

  const sortedCustom = useMemo(() => {
    const arr = Array.isArray(customRules) ? [...customRules] : [];
    return arr.sort((a, b) => (a.range_min ?? 0) - (b.range_min ?? 0));
  }, [customRules]);

  const isValidRule = (r) => {
    const min = Number(r.range_min);
    const max = Number(r.range_max);
    const score = Number(r.score);
    return (
      Number.isFinite(min) &&
      Number.isFinite(max) &&
      Number.isFinite(score) &&
      min < max &&
      score >= 0 &&
      score <= 100
    );
  };

  const hasInvalidCustom = useMemo(() => {
    if (mode !== "custom") return false;
    if (!customRules.length) return true;
    return customRules.some((r) => !isValidRule(r));
  }, [customRules, mode]);

  /* trend auto */
  const getTrend = (score) => {
    if (score <= 25) return "Zeer laag";
    if (score <= 45) return "Laag";
    if (score <= 60) return "Neutraal";
    if (score <= 80) return "Actief";
    return "Hoog";
  };

  /* ---------------- custom helpers ---------------- */

  const addRule = () => {
    const last = sortedCustom[sortedCustom.length - 1];
    const lastMax = last ? Number(last.range_max) : 100;

    setCustomRules([
      ...customRules,
      {
        range_min: lastMax,
        range_max: lastMax + 10,
        score: 50,
      },
    ]);
  };

  const updateRule = (index, field, value) => {
    const updated = [...customRules];
    updated[index][field] = Number(value);
    setCustomRules(updated);
  };

  const removeRule = (index) => {
    setCustomRules(customRules.filter((_, i) => i !== index));
  };

  const saveCustomRules = async () => {
    await onSave?.({ score_mode: "custom", weight: localWeight });
    await onSaveCustom?.(sortedCustom);
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Laden…</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-gray-800">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Score Logica</h3>
          <p className="text-sm text-gray-500">
            Pas aan hoe deze indicator wordt geïnterpreteerd.
          </p>
        </div>

        <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
          Weight <span className="font-semibold">{localWeight.toFixed(1)}</span>
        </div>
      </div>

      {/* MODE */}
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-4 py-2 rounded-lg text-sm ${
              mode === m.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* STANDARD / CONTRARIAN */}
      {(mode === "standard" || mode === "contrarian") && (
        <table className="w-full text-sm border rounded-xl overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">Range</th>
              <th className="p-3 text-center">Score</th>
              <th className="p-3 text-center">Trend</th>
            </tr>
          </thead>
          <tbody>
            {sortedRules.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  {r.range_min} – {r.range_max}
                </td>
                <td className="p-3 text-center font-semibold">
                  {displayScore(r.score)}
                </td>
                <td className="p-3 text-center text-gray-500 italic">
                  {r.trend || "–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CUSTOM */}
      {mode === "custom" && (
        <>
          {/* weight slider */}
          <div>
            <div className="text-sm font-semibold mb-2">Indicator weight</div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={localWeight}
              onChange={(e) => setLocalWeight(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* header */}
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">Custom ranges</div>
            <button
              onClick={addRule}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* table */}
          <div className="border rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs font-semibold">
              <div className="col-span-5">Range</div>
              <div className="col-span-3 text-center">Score</div>
              <div className="col-span-3 text-center">Trend</div>
              <div className="col-span-1"></div>
            </div>

            <div className="p-3 space-y-2">
              {sortedCustom.map((rule, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  
                  {/* RANGE */}
                  <div className="col-span-5 flex gap-2">
                    <input
                      type="number"
                      value={rule.range_min}
                      onChange={(e) =>
                        updateRule(idx, "range_min", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      value={rule.range_max}
                      onChange={(e) =>
                        updateRule(idx, "range_max", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  {/* SCORE */}
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={rule.score}
                      onChange={(e) =>
                        updateRule(idx, "score", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  {/* TREND AUTO */}
                  <div className="col-span-3 text-center text-gray-500 italic">
                    {getTrend(rule.score)}
                  </div>

                  {/* DELETE */}
                  <div className="col-span-1 flex justify-end">
                    <button onClick={() => removeRule(idx)}>
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={saveCustomRules}
            disabled={hasInvalidCustom}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Save Custom Rules
          </button>
        </>
      )}
    </div>
  );
}
