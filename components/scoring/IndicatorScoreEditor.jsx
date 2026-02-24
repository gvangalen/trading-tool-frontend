"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { RefreshCw, Info } from "lucide-react";
import ScoreModeBadge from "./ScoreModeBadge";
import { useModal } from "@/components/modal/ModalProvider";

/**
 * IndicatorScoreEditor — Grip Theme PRO 3.0 (100% theme-driven)
 *
 * ✅ 5 vaste buckets (0–20, 20–40, 40–60, 60–80, 80–100)
 * ✅ Standard / Contrarian / Custom: visueel IDENTIEK (zelfde tabel)
 * ✅ Standard/Contrarian tonen score als badge (geen input)
 * ✅ Contrarian is exact inverse van Standard template (100 - score)
 * ✅ Custom = DB-rules (editable score + weight + save)
 * ✅ Units (%, USD, index) zichtbaar in de UI header (0–100, unit)
 *
 * UX regels:
 * - Tabel ranges blijven ALTIJD 0–100 (design), ook al clampen we scores naar 10–100
 * - Contrarian moet net zo “vol” aanvoelen als Standard
 */

const FIXED_BUCKETS = [
  { min: 0, max: 20 },
  { min: 20, max: 40 },
  { min: 40, max: 60 },
  { min: 60, max: 80 },
  { min: 80, max: 100 },
];

// Global template scores for Standard mode (stable everywhere)
const STANDARD_TEMPLATE_SCORES = [10, 25, 50, 75, 100];

// Keep consistent with backend normalize_indicator_name
const NAME_ALIASES = {
  fear_and_greed_index: "fear_greed_index",
  fear_greed: "fear_greed_index",
  sandp500: "sp500",
  "s&p500": "sp500",
  "s&p_500": "sp500",
  sp_500: "sp500",
};

// Meta map for unit display
const INDICATOR_META = {
  volume: { unit: "%", label: "Volume (relatief)" },
  market_volume: { unit: "%", label: "Volume (relatief)" },
  volume_change: { unit: "%", label: "Volume change" },
  change_24h: { unit: "%", label: "Change 24h" },
  change_7d: { unit: "%", label: "Change 7d" },
  fear_greed_index: { unit: "index", label: "Fear & Greed" },
  sp500: { unit: "index", label: "S&P 500" },
  dxy: { unit: "index", label: "DXY" },
  price: { unit: "USD", label: "Price" },
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

// Score-engine clamp (business) ≠ UI-range (design)
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

/**
 * BELANGRIJK:
 * Deze classes moeten in je global CSS bestaan (je wilde geen local <style> meer).
 * Als je ze nog niet globaal hebt, zet ze in je global style.css.
 */
function getScoreBadgeClass(score) {
  const s = Number(score);
  if (s <= 20) return "score-badge score-badge-sell";
  if (s <= 60) return "score-badge score-badge-neutral";
  if (s <= 80) return "score-badge score-badge-buy";
  return "score-badge score-badge-strong-buy";
}

// Custom rules (DB) bucketize → keeps UI stable even if DB partial
function bucketizeRules(rules = []) {
  const arr = Array.isArray(rules) ? rules : [];

  return FIXED_BUCKETS.map((b) => {
    const mid = (b.min + b.max) / 2;

    const match =
      arr.find(
        (r) => Number(r?.range_min) <= mid && mid <= Number(r?.range_max)
      ) ||
      arr.find(
        (r) => Number(r?.range_min) === b.min && Number(r?.range_max) === b.max
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
  const { showSnackbar } = useModal();

  const normalizedIndicator = useMemo(
    () => normalizeIndicatorName(indicator),
    [indicator]
  );
  const meta = INDICATOR_META[normalizedIndicator] || null;

  const [mode, setMode] = useState(scoreMode);
  const [localWeight, setLocalWeight] = useState(weight);

  const [customRules, setCustomRules] = useState(bucketizeRules(rules));

  const [savingCustom, setSavingCustom] = useState(false);

  /* Sync wanneer backend data verandert */
  useEffect(() => {
    setMode(scoreMode || "standard");
    setLocalWeight(weight ?? 1);
    setCustomRules(bucketizeRules(rules));
  }, [normalizedIndicator, scoreMode, rules, weight]);

  /* Auto save STANDARD & CONTRARIAN (mode only) */
  useEffect(() => {
    if (loading) return;
    if (!normalizedIndicator || !category) return;
    if (mode === "custom") return;

    onSave?.({
      indicator: normalizedIndicator,
      category,
      score_mode: mode,
      weight: localWeight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, loading, normalizedIndicator, category]);

  const modes = [
    { key: "standard", label: "Standard" },
    { key: "contrarian", label: "Contrarian" },
    { key: "custom", label: "Custom" },
  ];

  const isCustom = mode === "custom";

  /* Template rows (standard baseline) */
  const templateRows = useMemo(() => {
    return FIXED_BUCKETS.map((b, idx) => {
      const s = clampScore(STANDARD_TEMPLATE_SCORES[idx]);
      return {
        range_min: b.min,
        range_max: b.max,
        score: s,
        trend: getTrend(s),
      };
    });
  }, []);

  /* Display transform for contrarian */
  const displayScore = useCallback(
    (baseScore) => {
      const base = clampScore(baseScore);
      if (mode === "contrarian") return clampScore(100 - base);
      return base;
    },
    [mode]
  );

  const rows = isCustom ? customRules : templateRows;

  /* Custom edit: score only */
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
  if (savingCustom) return;

  setSavingCustom(true);

  try {
    // 1) save settings (mode+weight)
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

    // ✅ FIX: weight meegeven
    await onSaveCustom?.(payload, localWeight);

    // 👉 deze snackbar liever verwijderen als Panel er ook 1 toont
    // showSnackbar("Custom rules opgeslagen", "success");
  } catch (e) {
    console.error("Save custom rules failed", e);
    showSnackbar("Custom opslaan mislukt", "danger");
  } finally {
    setSavingCustom(false);
  }
};

  if (loading) {
    return <div className="p-6 text-sm text-[var(--text-light)]">Laden…</div>;
  }

  const valueLabel = meta?.unit
    ? `Genormaliseerde waarde (0–100, ${meta.unit})`
    : "Genormaliseerde waarde (0–100)";

  return (
    <div className="card-surface p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[var(--text-dark)]">
              Score Logica
            </h3>
            <ScoreModeBadge mode={mode} />
          </div>

          <p className="text-sm text-[var(--text-light)]">
            Pas aan hoe deze indicator wordt geïnterpreteerd.
          </p>

          <div className="text-xs text-[var(--text-light)]">
            Indicator key:{" "}
            <span className="font-mono">{normalizedIndicator || "—"}</span>
            {meta?.label ? <span className="ml-2">• {meta.label}</span> : null}
          </div>
        </div>

        {/* WEIGHT BADGE + TOOLTIP */}
        <div className="relative group inline-flex items-center gap-2 rounded-full bg-[var(--surface-2)] px-3 py-1 text-sm border border-[var(--border)]">
          <span className="font-medium text-[var(--text-dark)]">Weight</span>
          <span className="tabular-nums font-semibold text-[var(--text-dark)]">
            {Number(localWeight).toFixed(1)}
          </span>
          <span className="text-[var(--text-light)]">
            ({isCustom ? "custom" : "standaard"})
          </span>

          <Info size={14} className="text-[var(--text-light)] cursor-help" />

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
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition border ${
              mode === m.key
                ? "bg-[var(--primary)] text-white border-transparent"
                : "bg-[var(--surface-2)] text-[var(--text-dark)] border-[var(--border)]"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* MODE INFO */}
      <div className="min-h-[40px]">
        {mode === "standard" && (
          <div className="text-sm text-[var(--text-light)]">
            Standard = vaste template scores (zelfde overal).
          </div>
        )}

        {mode === "contrarian" && (
          <div className="flex items-center gap-2 text-sm rounded-[var(--radius-md)] px-3 py-2 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dark)]">
            <RefreshCw size={14} className="icon-muted" />
            Contrarian = exact inverse van Standard template (100 - score).
          </div>
        )}

        {mode === "custom" && (
          <div className="text-sm rounded-[var(--radius-md)] px-3 py-2 border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-dark)]">
            Custom = vaste buckets (0–100). Je past alleen score + weight aan.
          </div>
        )}
      </div>

      {/* WEIGHT SLIDER (alleen custom) */}
      {isCustom && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-[var(--text-dark)]">
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

          <div className="text-sm text-[var(--text-light)]">
            Gewicht: {Number(localWeight).toFixed(1)}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-[var(--text-dark)]">
          Scoreregels
        </div>

        <div className="border rounded-[var(--radius-lg)] overflow-hidden border-[var(--border)] bg-[var(--surface-1)]">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-[var(--text-light)] bg-[var(--surface-2)] border-b border-[var(--border)]">
            <div className="col-span-5">{valueLabel}</div>
            <div className="col-span-3 text-center">
              Score {mode === "contrarian" ? "(inverted)" : ""}
            </div>
            <div className="col-span-4 text-center">Trend</div>
          </div>

          {/* Rows */}
          <div className="p-3 space-y-2">
            {FIXED_BUCKETS.map((b, idx) => {
              const rawScore = rows?.[idx]?.score ?? 50;
              const shownScore = displayScore(rawScore);

              return (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5 text-sm font-medium text-[var(--text-dark)]">
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
                        onChange={(e) =>
                          updateCustomScore(idx, e.target.value)
                        }
                        className="input text-center"
                        aria-label={`Score bucket ${b.min}-${b.max}`}
                      />
                    ) : (
                      <div
                        className={`w-full py-2 rounded-[var(--radius-md)] text-center font-semibold ${getScoreBadgeClass(
                          shownScore
                        )}`}
                      >
                        {shownScore}
                      </div>
                    )}
                  </div>

                  <div className="col-span-4 text-center text-[var(--text-light)] italic">
                    {getTrend(shownScore)}
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
          className="btn-primary"
          disabled={savingCustom}
          title={savingCustom ? "Bezig met opslaan…" : "Opslaan"}
        >
          {savingCustom ? "Bezig…" : "Save Custom Rules"}
        </button>
      )}
    </div>
  );
}
