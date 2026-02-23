"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { RefreshCw, Info } from "lucide-react";

/**
 * IndicatorScoreEditor (V2 — Fixed Buckets) — TradeLayer 2.0
 *
 * ✅ 5 vaste buckets (0–20, 20–40, 40–60, 60–80, 80–100)
 * ✅ Standard / Contrarian / Custom: visueel IDENTIEK (zelfde tabel)
 * ✅ Alleen score editable (en dan alleen in Custom)
 * ✅ Weight badge altijd zichtbaar + tooltip
 * ✅ Weight slider alleen bij Custom
 * ✅ Trend auto (geen input)
 * ✅ Custom: Save knop (geen autosave)
 * ✅ Standard/Contrarian: autosave (alleen mode; weight niet editable)
 *
 * ✅ Update (multi-tenant / user-aware):
 * - Frontend stuurt géén user_id mee (auth header bepaalt user).
 * - Maar we sturen wél consistent genormaliseerde indicator-name door naar onSave/onSaveCustom,
 *   zodat backend rules altijd dezelfde key gebruikt (en dus user/template rules correct matchen).
 *
 * Props:
 *  indicator: string
 *  category: "macro" | "market" | "technical"
 *  rules: array
 *  scoreMode: "standard" | "contrarian" | "custom"
 *  weight: number
 *  loading: boolean
 *  onSave(settings) -> Promise|void
 *  onSaveCustom(rules) -> Promise|void
 */

const FIXED_BUCKETS = [
  { min: 0, max: 20 },
  { min: 20, max: 40 },
  { min: 40, max: 60 },
  { min: 60, max: 80 },
  { min: 80, max: 100 },
];

// Houd dit bewust gelijk aan backend normalize_indicator_name (scoring_utils)
const NAME_ALIASES = {
  fear_and_greed_index: "fear_greed_index",
  fear_greed: "fear_greed_index",
  sandp500: "sp500",
  "s&p500": "sp500",
  "s&p_500": "sp500",
  sp_500: "sp500",
};

function normalizeIndicatorName(name) {
  const normalized = String(name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/s&p/g, "sp")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .trim();

  return NAME_ALIASES[normalized] || normalized;
}

const clampScore = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return 50;
  if (n < 10) return 10;
  if (n > 100) return 100;
  return n;
};

const getTrend = (score) => {
  const s = Number(score);
  if (s <= 20) return "Zeer laag";
  if (s <= 40) return "Laag";
  if (s <= 60) return "Neutraal";
  if (s <= 80) return "Actief";
  return "Hoog";
};

function getScoreStyle(score) {
  const s = Number(score);

  if (s <= 20)
    return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
  if (s <= 40)
    return "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300";
  if (s <= 60)
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  if (s <= 80)
    return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";

  return "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300";
}

// Map ANY incoming rules to our 5 fixed buckets (0–100 normalized).
// Keeps UI stable even if DB has partial rules.
function bucketizeRules(rules = []) {
  const arr = Array.isArray(rules) ? rules : [];

  return FIXED_BUCKETS.map((b) => {
    const mid = (b.min + b.max) / 2;

    const match =
      arr.find(
        (r) => Number(r?.range_min) <= mid && mid <= Number(r?.range_max)
      ) ||
      arr.find(
        (r) =>
          Number(r?.range_min) === b.min && Number(r?.range_max) === b.max
      );

    const s = clampScore(match?.score ?? 50);

    return {
      range_min: b.min,
      range_max: b.max,
      score: s,
      trend: getTrend(s),
    };
  });
}

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
  const normalizedIndicator = useMemo(
    () => normalizeIndicatorName(indicator),
    [indicator]
  );

  const [mode, setMode] = useState(scoreMode);
  const [localWeight, setLocalWeight] = useState(weight);

  // Custom scores only (always 5 buckets)
  const [customRules, setCustomRules] = useState(bucketizeRules(rules));

  /* --------------------------------------------------
     Sync wanneer backend data verandert
  -------------------------------------------------- */
  useEffect(() => {
    setMode(scoreMode || "standard");
    setLocalWeight(weight ?? 1);
    setCustomRules(bucketizeRules(rules));
  }, [normalizedIndicator, scoreMode, rules, weight]);

  /* --------------------------------------------------
     Auto save STANDARD & CONTRARIAN (mode only)
     Custom: save via button
  -------------------------------------------------- */
  useEffect(() => {
    if (loading) return;
    if (!normalizedIndicator || !category) return;
    if (mode === "custom") return;

    onSave?.({
      indicator: normalizedIndicator,
      category,
      score_mode: mode,
      // weight blijft bestaan in backend, maar is hier niet editable buiten custom
      weight: localWeight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, loading, normalizedIndicator, category]);

  /* --------------------------------------------------
     Helpers
  -------------------------------------------------- */
  const modes = [
    { key: "standard", label: "Standard" },
    { key: "contrarian", label: "Contrarian" },
    { key: "custom", label: "Custom" },
  ];

  const isCustom = mode === "custom";
  const weightBadgeLabel = isCustom ? "custom" : "standaard";

  const displayScore = useCallback(
    (s) => {
      const base = clampScore(s);
      // Contrarian = score-mode transform; buckets blijven magnitude-based
      if (mode === "contrarian") return clampScore(100 - base);
      return base;
    },
    [mode]
  );

  // Standard rules also bucketized so the table is ALWAYS identical
  const standardRules = useMemo(() => bucketizeRules(rules), [rules]);

  const rows = isCustom ? customRules : standardRules;

  /* --------------------------------------------------
     Custom edit: score only (ranges locked)
  -------------------------------------------------- */
  const updateCustomScore = (idx, value) => {
    setCustomRules((prev) => {
      const next = Array.isArray(prev) ? [...prev] : bucketizeRules([]);
      const b = FIXED_BUCKETS[idx];
      const s = clampScore(value);

      next[idx] = {
        range_min: b.min,
        range_max: b.max,
        score: s,
        trend: getTrend(s),
      };

      return next;
    });
  };

  const saveCustomRules = async () => {
    if (!normalizedIndicator || !category) return;

    // 1) save settings
    await onSave?.({
      indicator: normalizedIndicator,
      category,
      score_mode: "custom",
      weight: localWeight,
    });

    // 2) save 5 fixed bucket rules
    const payload = FIXED_BUCKETS.map((b, i) => {
      const s = clampScore(customRules?.[i]?.score ?? 50);
      return {
        indicator: normalizedIndicator,
        category,
        range_min: b.min,
        range_max: b.max,
        score: s,
        trend: getTrend(s),
      };
    });

    await onSaveCustom?.(payload);
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-[var(--text-light)]">Laden…</div>
    );
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
          <div className="mt-1 text-xs text-[var(--text-light)]">
            Indicator key:{" "}
            <span className="font-mono">{normalizedIndicator || "—"}</span>
          </div>
        </div>

        {/* WEIGHT BADGE + TOOLTIP */}
        <div className="relative group inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
          <span className="font-medium">Weight</span>
          <span className="tabular-nums font-semibold">
            {Number(localWeight).toFixed(1)}
          </span>
          <span className="text-[var(--text-light)]">({weightBadgeLabel})</span>

          <Info size={14} className="text-[var(--text-light)] cursor-help" />

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

      {/* MODE INFO (zelfde plek) */}
      <div className="min-h-[40px]">
        {mode === "standard" && (
          <div className="text-sm text-[var(--text-light)]">
            Standard = normale interpretatie van de bucket-scores (magnitude).
          </div>
        )}

        {mode === "contrarian" && (
          <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-xl px-3 py-2">
            <RefreshCw size={14} />
            Contrarian = bucket-score wordt omgekeerd toegepast (100 - score).
          </div>
        )}

        {mode === "custom" && (
          <div className="text-sm text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 rounded-xl px-3 py-2">
            Custom = vaste buckets (0–100). Je past alleen score + weight aan.
          </div>
        )}
      </div>

      {/* WEIGHT SLIDER (alleen custom) */}
      {isCustom && (
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
      )}

      {/* UNIFIED TABLE (ALL MODES IDENTICAL) */}
      <div className="space-y-2">
        <div className="text-sm font-semibold">Scoreregels</div>

        <div className="border rounded-xl overflow-hidden border-gray-200 dark:border-gray-800">
          {/* Header grid */}
          <div className="grid grid-cols-12 gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs font-semibold text-[var(--text-light)]">
            <div className="col-span-5">Genormaliseerde waarde (0–100)</div>
            <div className="col-span-3 text-center">
              Score {mode === "contrarian" ? "(inverted)" : ""}
            </div>
            <div className="col-span-4 text-center">Trend</div>
          </div>

          <div className="p-3 space-y-2">
            {FIXED_BUCKETS.map((b, idx) => {
              const rawScore = rows?.[idx]?.score ?? 50;
              const shownScore = displayScore(rawScore);

              const inputCls = `
                w-full p-2 rounded-lg border bg-white dark:bg-gray-900
                border-gray-200 dark:border-gray-800
                ${!isCustom ? "opacity-70 cursor-not-allowed" : ""}
              `;

              return (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-sm font-medium">
                    {b.min} – {b.max}
                  </div>

                  <div className="col-span-3">
                    {isCustom ? (
                      <input
                        type="number"
                        min="10"
                        max="100"
                        step="5"
                        value={rawScore}
                        onChange={(e) => updateCustomScore(idx, e.target.value)}
                        className="
                          w-full p-2 rounded-lg border
                          bg-white dark:bg-gray-900
                          border-gray-200 dark:border-gray-800
                        "
                        aria-label={`Score bucket ${b.min}-${b.max}`}
                      />
                    ) : (
                      <div
                        className={`
                          w-full py-2 rounded-lg text-center font-semibold
                          ${getScoreStyle(shownScore)}
                        `}
                      >
                        {shownScore}
                      </div>
                    )}
                  </div>

                  <div className="col-span-4 text-center text-[var(--text-light)] italic">
                    {getTrend(isCustom ? rawScore : shownScore)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!isCustom && (
          <div className="text-xs text-[var(--text-light)]">
            Score/weight aanpassen kan alleen via{" "}
            <span className="font-medium">Custom</span>.
          </div>
        )}
      </div>

      {/* SAVE only for custom */}
      {isCustom && (
        <button
          onClick={saveCustomRules}
          className="
            inline-flex items-center justify-center
            bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium
            hover:brightness-95
          "
        >
          Save Custom Rules
        </button>
      )}
    </div>
  );
}
