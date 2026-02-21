"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, RefreshCw, Info } from "lucide-react";

/**
 * IndicatorScoreEditor
 *
 * ✔ Sync met backend via hook
 * ✔ Reset bij indicator wissel
 * ✔ Ondersteunt standard / contrarian / custom
 * ✔ Weight badge altijd zichtbaar (read-only bij standard/contrarian)
 * ✔ Weight slider alleen bij custom
 * ✔ Custom editor met duidelijke header + validatie
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
    setMode(scoreMode || "standard");
    setCustomRules(Array.isArray(rules) ? rules : []);
    setLocalWeight(weight ?? 1);
  }, [indicator, scoreMode, rules, weight]);

  /* --------------------------------------------------
     Auto save STANDARD & CONTRARIAN
  -------------------------------------------------- */
  useEffect(() => {
    if (loading) return;
    if (!indicator || !category) return;
    if (mode === "custom") return;

    onSave?.({
      score_mode: mode,
      weight: localWeight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, localWeight, loading, indicator, category]);

  /* --------------------------------------------------
     Helpers
  -------------------------------------------------- */
  const modes = [
    { key: "standard", label: "Standard" },
    { key: "contrarian", label: "Contrarian" },
    { key: "custom", label: "Custom" },
  ];

  const weightBadgeLabel = mode === "custom" ? "custom" : "standaard";

  const displayScore = (s) =>
    mode === "contrarian" ? 100 - Number(s || 0) : Number(s || 0);

  const sortedRules = useMemo(() => {
    const arr = Array.isArray(rules) ? [...rules] : [];
    return arr.sort((a, b) => (a?.range_min ?? 0) - (b?.range_min ?? 0));
  }, [rules]);

  const sortedCustom = useMemo(() => {
    const arr = Array.isArray(customRules) ? [...customRules] : [];
    return arr.sort((a, b) => (a?.range_min ?? 0) - (b?.range_min ?? 0));
  }, [customRules]);

  const isValidRule = (r) => {
    const min = Number(r?.range_min);
    const max = Number(r?.range_max);
    const score = Number(r?.score);

    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      !Number.isFinite(score)
    )
      return false;
    if (min >= max) return false;
    if (score < 0 || score > 100) return false;
    return true;
  };

  const hasInvalidCustom = useMemo(() => {
    if (mode !== "custom") return false;
    if (!Array.isArray(customRules) || customRules.length === 0) return true;
    return customRules.some((r) => !isValidRule(r));
  }, [customRules, mode]);

  const getTrend = (score) => {
    const s = Number(score);
    if (s <= 25) return "Zeer laag";
    if (s <= 45) return "Laag";
    if (s <= 60) return "Neutraal";
    if (s <= 80) return "Actief";
    return "Hoog";
  };

  const addRule = () => {
    const base = sortedCustom[sortedCustom.length - 1];
    const lastMax = base ? Number(base.range_max) : 100;

    setCustomRules([
      ...(Array.isArray(customRules) ? customRules : []),
      {
        range_min: Number.isFinite(lastMax) ? lastMax : 0,
        range_max: Number.isFinite(lastMax) ? lastMax + 10 : 100,
        score: 50,
        trend: "",
      },
    ]);
  };

  const updateRule = (index, field, value) => {
    const updated = [...(Array.isArray(customRules) ? customRules : [])];
    const v = field === "trend" ? String(value) : Number(value);

    updated[index] = {
      ...updated[index],
      [field]: v,
    };
    setCustomRules(updated);
  };

  const removeRule = (index) => {
    setCustomRules(
      (Array.isArray(customRules) ? customRules : []).filter(
        (_, i) => i !== index
      )
    );
  };

  const saveCustomRules = async () => {
    await onSave?.({
      score_mode: "custom",
      weight: localWeight,
    });

    await onSaveCustom?.(sortedCustom);
  };

  if (loading) {
    return <div className="p-6 text-sm text-[var(--text-light)]">Laden…</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 space-y-6 border border-gray-200 dark:border-gray-800">
      {/* HEADER + WEIGHT BADGE */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Score Logica</h3>
          <p className="text-sm text-[var(--text-light)]">
            Pas aan hoe deze indicator wordt geïnterpreteerd.
          </p>
        </div>

        {/* WEIGHT BADGE + TOOLTIP */}
        <div className="relative group inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
          <span className="font-medium">Weight</span>
          <span className="tabular-nums font-semibold">
            {Number(localWeight).toFixed(1)}
          </span>
          <span className="text-[var(--text-light)]">
            ({weightBadgeLabel})
          </span>

          <Info
            size={14}
            className="text-[var(--text-light)] cursor-help"
          />

          {/* Tooltip */}
          <div
            className="
              absolute right-0 top-full mt-2 w-64
              opacity-0 group-hover:opacity-100
              pointer-events-none
              transition
              bg-black text-white text-xs rounded-lg p-3 shadow-xl
              z-50
            "
          >
            Weight bepaalt hoeveel invloed deze indicator heeft op de totale
            categorie-score. Hogere weight = meer impact.
          </div>
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
                ? "bg-[var(--primary)] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "standard" && (
        <div className="text-sm text-[var(--text-light)]">
          Standard = normale interpretatie van de standaard scoreregels.
        </div>
      )}

      {mode === "contrarian" && (
        <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-xl px-3 py-2">
          <RefreshCw size={14} />
          Contrarian = score wordt omgekeerd gebruikt.
        </div>
      )}

      {mode === "custom" && (
        <div className="text-sm text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 rounded-xl px-3 py-2">
          Custom = je definieert je eigen ranges + scores.
        </div>
      )}

      {/* STANDARD / CONTRARIAN TABLE */}
      {(mode === "standard" || mode === "contrarian") && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Scoreregels</div>

          <div className="border rounded-xl overflow-hidden border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800 text-left">
                <tr>
                  <th className="p-3">Min–Max (waarde)</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Trend</th>
                </tr>
              </thead>
              <tbody>
                {sortedRules.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 dark:border-gray-800"
                  >
                    <td className="p-3">
                      {r.range_min} – {r.range_max}
                    </td>
                    <td className="p-3 text-center font-semibold">
                      {displayScore(r.score)}
                    </td>
                    <td className="p-3 text-center text-[var(--text-light)] italic">
                      {r.trend || getTrend(r.score)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-[var(--text-light)]">
            Gewicht aanpassen kan alleen via{" "}
            <span className="font-medium">Custom</span>.
          </div>
        </div>
      )}

      {/* CUSTOM SECTION */}
      {mode === "custom" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Indicator weight</div>

            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={localWeight}
              onChange={(e) => setLocalWeight(Number(e.target.value))}
              className="w-full"
            />

            <div className="text-sm text-[var(--text-light)]">
              Gewicht: {Number(localWeight).toFixed(1)}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Custom ranges</div>
              <div className="text-xs text-[var(--text-light)]">
                Min &lt; max en score tussen 0–100.
              </div>
            </div>

            <button
              onClick={addRule}
              className="flex items-center gap-2 text-sm bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:brightness-95"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          <div className="border rounded-xl overflow-hidden border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-12 gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs font-semibold text-[var(--text-light)]">
              <div className="col-span-5">Min–Max (waarde)</div>
              <div className="col-span-3 text-center">Score</div>
              <div className="col-span-3 text-center">Trend</div>
              <div className="col-span-1"></div>
            </div>

            <div className="p-3 space-y-2">
              {sortedCustom.map((rule, idx) => {
                const valid = isValidRule(rule);

                const inputCls = `w-full p-2 rounded-lg border bg-white dark:bg-gray-900 ${
                  valid
                    ? "border-gray-200 dark:border-gray-800"
                    : "border-red-400"
                }`;

                return (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-5 flex gap-2">
                      <input
                        type="number"
                        value={rule.range_min}
                        onChange={(e) =>
                          updateRule(idx, "range_min", e.target.value)
                        }
                        className={inputCls}
                        placeholder="min"
                      />
                      <input
                        type="number"
                        value={rule.range_max}
                        onChange={(e) =>
                          updateRule(idx, "range_max", e.target.value)
                        }
                        className={inputCls}
                        placeholder="max"
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        value={rule.score}
                        onChange={(e) =>
                          updateRule(idx, "score", e.target.value)
                        }
                        className={inputCls}
                        placeholder="score"
                      />
                    </div>

                    <div className="col-span-3 text-center text-[var(--text-light)] italic">
                      {getTrend(rule.score)}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <button
                        onClick={() => removeRule(idx)}
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {!valid && (
                      <div className="col-span-12 text-xs text-red-600">
                        Ongeldige regel: controleer min/max en score (0–100).
                      </div>
                    )}
                  </div>
                );
              })}

              {sortedCustom.length === 0 && (
                <div className="text-sm text-[var(--text-light)] italic">
                  Nog geen custom rules.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={saveCustomRules}
            disabled={hasInvalidCustom}
            className="
              inline-flex items-center justify-center
              bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium
              hover:brightness-95
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            Save Custom Rules
          </button>
        </div>
      )}
    </div>
  );
}
