"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  Target,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pencil,
  Save,
  RotateCcw,
  Plus,
  Trash2,
} from "lucide-react";

/**
 * TradePlanCard — TradeLayer 3.0
 *
 * Doel:
 * - 1 plek waar een "trade klaarzetten" plan staat (paper/live later)
 * - zowel AUTO (backend) als MANUAL (user edits) ondersteund
 * - execution readiness checks: budget + risk limits + completeness
 *
 * Verwacht contract (voorbeeld):
 * tradePlan = {
 *   status: "ready" | "draft" | "blocked" | "none",
 *   symbol: "BTC",
 *   side: "buy" | "sell",
 *   entry_plan: [{ type: "buy"|"breakout"|"limit", price: 64200, note?: "" }],
 *   stop_loss: { price: 59900 } | null,
 *   targets: [{ label: "TP1", price: 71000 }, ...],
 *   risk: {
 *     risk_eur: 320,
 *     position_size_qty: 0.0047,
 *     rr: 3.6,
 *   },
 *   constraints: {
 *     max_risk_per_trade: 500,
 *     max_daily_allocation: 200,
 *     budget_remaining_today: 150,
 *     within_budget: true,
 *     within_risk: true,
 *   },
 *   notes: { summary?: "", rationale?: "" }
 * }
 */

const fmtEur = (v) => {
  const n = Number(v);
  if (!isFinite(n)) return "—";
  return `€${Math.round(n).toLocaleString("nl-NL")}`;
};

const fmtPrice = (v) => {
  const n = Number(v);
  if (!isFinite(n)) return "—";
  return n.toLocaleString("nl-NL");
};

const clampArr = (arr) => (Array.isArray(arr) ? arr : []);

function Badge({ ok, labelOk, labelFail }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold",
        ok
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-red-50 text-red-700 border-red-200",
      ].join(" ")}
    >
      {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      {ok ? labelOk : labelFail}
    </span>
  );
}

function MiniRow({ icon, label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-right text-gray-900">{children}</div>
    </div>
  );
}

function SectionTitle({ icon, title, right }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        {icon}
        <span>{title}</span>
      </div>
      {right}
    </div>
  );
}

export default function TradePlanCard({
  tradePlan = null,
  decision = null, // optioneel: om constraints/warnings uit decision te halen
  loading = false,
  isGenerating = false,

  /** Auto: laat backend nieuw plan genereren (later /api/trade_plan/generate) */
  onGenerate,

  /** Manual: plan opslaan (later /api/trade_plan/save) */
  onSave,

  /** Manual toggle */
  allowManual = true,
}) {
  const [editing, setEditing] = useState(false);

  // Local editable draft (voor manual overrides)
  const [draft, setDraft] = useState(() => tradePlan || null);

  useEffect(() => {
    // als backend plan verandert -> sync, tenzij user in edit mode zit
    if (!editing) setDraft(tradePlan || null);
  }, [tradePlan, editing]);

  const plan = draft;

  const derived = useMemo(() => {
    // Fallback: altijd iets tonen (jullie rule)
    if (!plan) {
      return {
        status: "none",
        symbol: decision?.symbol || "BTC",
        side: decision?.action === "sell" ? "sell" : "buy",
        entry_plan: [],
        stop_loss: null,
        targets: [],
        risk: null,
        constraints: {
          max_risk_per_trade: decision?.max_risk_per_trade ?? null,
          max_daily_allocation: decision?.max_daily_allocation ?? null,
          within_budget: false,
          within_risk: false,
          budget_remaining_today: null,
        },
        notes: { summary: "Nog geen trade plan beschikbaar." },
      };
    }

    const entry = clampArr(plan.entry_plan);
    const targets = clampArr(plan.targets);

    const maxRisk = plan?.constraints?.max_risk_per_trade ?? decision?.max_risk_per_trade ?? null;
    const maxDaily = plan?.constraints?.max_daily_allocation ?? decision?.max_daily_allocation ?? null;

    const withinBudget =
      typeof plan?.constraints?.within_budget === "boolean"
        ? plan.constraints.within_budget
        : true;

    const withinRisk =
      typeof plan?.constraints?.within_risk === "boolean"
        ? plan.constraints.within_risk
        : true;

    const ready =
      entry.length > 0 &&
      !!plan.stop_loss?.price &&
      targets.length > 0 &&
      withinBudget &&
      withinRisk;

    return {
      ...plan,
      entry_plan: entry,
      targets,
      constraints: {
        ...plan.constraints,
        max_risk_per_trade: maxRisk,
        max_daily_allocation: maxDaily,
        within_budget: withinBudget,
        within_risk: withinRisk,
      },
      _ready: ready,
    };
  }, [plan, decision]);

  const canEdit = allowManual && !!onSave;
  const canGenerate = !!onGenerate;

  const setEntry = (idx, patch) => {
    setDraft((p) => {
      const next = { ...(p || {}) };
      const arr = clampArr(next.entry_plan).slice();
      arr[idx] = { ...(arr[idx] || {}), ...patch };
      next.entry_plan = arr;
      return next;
    });
  };

  const addEntry = () => {
    setDraft((p) => {
      const next = { ...(p || {}) };
      next.entry_plan = [...clampArr(next.entry_plan), { type: "buy", price: 0 }];
      return next;
    });
  };

  const removeEntry = (idx) => {
    setDraft((p) => {
      const next = { ...(p || {}) };
      const arr = clampArr(next.entry_plan).slice();
      arr.splice(idx, 1);
      next.entry_plan = arr;
      return next;
    });
  };

  const setTarget = (idx, patch) => {
    setDraft((p) => {
      const next = { ...(p || {}) };
      const arr = clampArr(next.targets).slice();
      arr[idx] = { ...(arr[idx] || {}), ...patch };
      next.targets = arr;
      return next;
    });
  };

  const addTarget = () => {
    setDraft((p) => {
      const next = { ...(p || {}) };
      const i = clampArr(next.targets).length + 1;
      next.targets = [...clampArr(next.targets), { label: `TP${i}`, price: 0 }];
      return next;
    });
  };

  const removeTarget = (idx) => {
    setDraft((p) => {
      const next = { ...(p || {}) };
      const arr = clampArr(next.targets).slice();
      arr.splice(idx, 1);
      next.targets = arr;
      return next;
    });
  };

  const setStop = (price) => {
    setDraft((p) => ({
      ...(p || {}),
      stop_loss: { price: Number(price) || 0 },
    }));
  };

  const setRiskField = (key, value) => {
    setDraft((p) => ({
      ...(p || {}),
      risk: { ...(p?.risk || {}), [key]: Number(value) },
    }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    await onSave(draft);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <div className="text-sm text-gray-500">Trade plan laden…</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <Bot size={18} />
            Trade Plan
          </div>
          <div className="text-sm text-gray-500">
            {derived.symbol || "BTC"} · {(derived.side || "buy").toUpperCase()}
            {derived.status ? ` · ${derived.status}` : ""}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canGenerate && (
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="btn-outline flex items-center gap-2"
              title="Genereer nieuw plan (AI/backend)"
            >
              <RotateCcw size={16} />
              {isGenerating ? "Genereren…" : "Genereer"}
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => setEditing((v) => !v)}
              className="btn-secondary flex items-center gap-2"
              title="Handmatig aanpassen"
            >
              <Pencil size={16} />
              {editing ? "Stop edit" : "Edit"}
            </button>
          )}

          {canEdit && editing && (
            <button
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
              title="Opslaan"
            >
              <Save size={16} />
              Opslaan
            </button>
          )}
        </div>
      </div>

      {/* Execution readiness badges */}
      <div className="flex flex-wrap gap-2">
        <Badge
          ok={derived._ready}
          labelOk="klaar om te plaatsen"
          labelFail="niet klaar"
        />
        <Badge
          ok={!!derived.constraints?.within_budget}
          labelOk="binnen budget"
          labelFail="budget limiet"
        />
        <Badge
          ok={!!derived.constraints?.within_risk}
          labelOk="binnen risk limits"
          labelFail="risk limiet"
        />
      </div>

      {/* Notes */}
      {(derived?.notes?.summary || derived?.notes?.rationale) && (
        <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
          {derived?.notes?.summary && (
            <div className="font-medium">{derived.notes.summary}</div>
          )}
          {derived?.notes?.rationale && (
            <div className="mt-1 text-gray-600">{derived.notes.rationale}</div>
          )}
        </div>
      )}

      {/* Entry plan */}
      <div className="rounded-xl border p-4 space-y-3">
        <SectionTitle
          icon={<TrendingUp size={16} />}
          title="Entry Plan"
          right={
            editing ? (
              <button
                onClick={addEntry}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
              >
                <Plus size={14} />
                entry
              </button>
            ) : null
          }
        />

        {derived.entry_plan.length === 0 ? (
          <div className="text-sm text-gray-500">
            Geen entries ingesteld.
          </div>
        ) : (
          <div className="space-y-2">
            {derived.entry_plan.map((e, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="rounded-md border bg-white px-2 py-0.5 text-xs font-semibold text-gray-700">
                    {(e.type || "buy").toUpperCase()}
                  </span>

                  {editing ? (
                    <select
                      value={e.type || "buy"}
                      onChange={(ev) => setEntry(idx, { type: ev.target.value })}
                      className="rounded-md border bg-white px-2 py-1 text-sm"
                    >
                      <option value="buy">buy</option>
                      <option value="limit">limit</option>
                      <option value="breakout">breakout</option>
                    </select>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {editing ? (
                    <input
                      type="number"
                      value={Number(e.price || 0)}
                      onChange={(ev) => setEntry(idx, { price: Number(ev.target.value) })}
                      className="w-36 rounded-md border bg-white px-2 py-1 text-sm text-right"
                      placeholder="prijs"
                    />
                  ) : (
                    <div className="text-sm font-semibold text-gray-900">
                      {fmtPrice(e.price)}
                    </div>
                  )}

                  {editing && (
                    <button
                      onClick={() => removeEntry(idx)}
                      className="text-gray-400 hover:text-red-600"
                      title="Verwijder entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stop loss + Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stop loss */}
        <div className="rounded-xl border p-4 space-y-3">
          <SectionTitle icon={<Shield size={16} />} title="Stop Loss" />
          <div className="rounded-lg bg-gray-50 p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Stop</span>
            {editing ? (
              <input
                type="number"
                value={Number(derived.stop_loss?.price || 0)}
                onChange={(ev) => setStop(ev.target.value)}
                className="w-36 rounded-md border bg-white px-2 py-1 text-sm text-right"
                placeholder="stop"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-900">
                {fmtPrice(derived.stop_loss?.price)}
              </span>
            )}
          </div>
        </div>

        {/* Targets */}
        <div className="rounded-xl border p-4 space-y-3">
          <SectionTitle
            icon={<Target size={16} />}
            title="Targets"
            right={
              editing ? (
                <button
                  onClick={addTarget}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  <Plus size={14} />
                  target
                </button>
              ) : null
            }
          />

          {derived.targets.length === 0 ? (
            <div className="text-sm text-gray-500">
              Geen targets ingesteld.
            </div>
          ) : (
            <div className="space-y-2">
              {derived.targets.map((t, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 p-3"
                >
                  <div className="text-sm font-semibold text-gray-700">
                    {t.label || `TP${idx + 1}`}
                  </div>

                  <div className="flex items-center gap-2">
                    {editing ? (
                      <>
                        <input
                          type="text"
                          value={t.label || `TP${idx + 1}`}
                          onChange={(ev) => setTarget(idx, { label: ev.target.value })}
                          className="w-20 rounded-md border bg-white px-2 py-1 text-sm"
                        />
                        <input
                          type="number"
                          value={Number(t.price || 0)}
                          onChange={(ev) => setTarget(idx, { price: Number(ev.target.value) })}
                          className="w-28 rounded-md border bg-white px-2 py-1 text-sm text-right"
                          placeholder="prijs"
                        />
                        <button
                          onClick={() => removeTarget(idx)}
                          className="text-gray-400 hover:text-red-600"
                          title="Verwijder target"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="text-sm font-semibold text-gray-900">
                        {fmtPrice(t.price)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Risk */}
      <div className="rounded-xl border p-4 space-y-3">
        <SectionTitle
          icon={<AlertTriangle size={16} />}
          title="Risk"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg bg-gray-50 p-3 space-y-1">
            <div className="text-xs text-gray-500">Risk per trade</div>
            {editing ? (
              <input
                type="number"
                value={Number(derived.risk?.risk_eur || 0)}
                onChange={(ev) => setRiskField("risk_eur", ev.target.value)}
                className="w-full rounded-md border bg-white px-2 py-1 text-sm text-right"
              />
            ) : (
              <div className="text-sm font-bold">{fmtEur(derived.risk?.risk_eur)}</div>
            )}
            {derived.constraints?.max_risk_per_trade ? (
              <div className="text-xs text-gray-500">
                Max: {fmtEur(derived.constraints.max_risk_per_trade)}
              </div>
            ) : null}
          </div>

          <div className="rounded-lg bg-gray-50 p-3 space-y-1">
            <div className="text-xs text-gray-500">Position size</div>
            {editing ? (
              <input
                type="number"
                step="0.00000001"
                value={Number(derived.risk?.position_size_qty || 0)}
                onChange={(ev) => setRiskField("position_size_qty", ev.target.value)}
                className="w-full rounded-md border bg-white px-2 py-1 text-sm text-right"
              />
            ) : (
              <div className="text-sm font-bold">
                {isFinite(Number(derived.risk?.position_size_qty))
                  ? `${Number(derived.risk.position_size_qty).toFixed(8)} ${derived.symbol || ""}`.trim()
                  : "—"}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-3 space-y-1">
            <div className="text-xs text-gray-500">R:R ratio</div>
            {editing ? (
              <input
                type="number"
                step="0.1"
                value={Number(derived.risk?.rr || 0)}
                onChange={(ev) => setRiskField("rr", ev.target.value)}
                className="w-full rounded-md border bg-white px-2 py-1 text-sm text-right"
              />
            ) : (
              <div className="text-sm font-bold">
                {isFinite(Number(derived.risk?.rr))
                  ? Number(derived.risk.rr).toFixed(2)
                  : "—"}
              </div>
            )}
          </div>
        </div>

        {/* Extra context */}
        <div className="pt-2">
          <MiniRow icon={<Shield size={14} />} label="Risk limits">
            <span className="text-gray-700">
              {derived.constraints?.max_risk_per_trade
                ? `max risk ${fmtEur(derived.constraints.max_risk_per_trade)}`
                : "—"}
              {derived.constraints?.max_daily_allocation
                ? ` · max daily ${fmtEur(derived.constraints.max_daily_allocation)}`
                : ""}
            </span>
          </MiniRow>
        </div>
      </div>

      {/* Execution block */}
      <div className="rounded-xl border p-4 space-y-3">
        <SectionTitle
          icon={<CheckCircle2 size={16} />}
          title="Execution"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Ready</div>
            <div className="mt-1">
              <Badge
                ok={derived._ready}
                labelOk="✔ klaar om te plaatsen"
                labelFail="✖ niet klaar"
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Budget</div>
            <div className="mt-1">
              <Badge
                ok={!!derived.constraints?.within_budget}
                labelOk="✔ binnen budget"
                labelFail="✖ budget overschreden"
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <div className="text-xs text-gray-500">Risk</div>
            <div className="mt-1">
              <Badge
                ok={!!derived.constraints?.within_risk}
                labelOk="✔ binnen risk limits"
                labelFail="✖ risk overschreden"
              />
            </div>
          </div>
        </div>

        {/* Warnings */}
        {Array.isArray(derived?.constraints?.warnings) && derived.constraints.warnings.length > 0 && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
            <div className="font-semibold mb-1">Warnings</div>
            <ul className="list-disc pl-5 space-y-1">
              {derived.constraints.warnings.map((w, i) => (
                <li key={i}>{String(w)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="text-xs text-gray-500">
        Tip: dit plan is de basis voor <span className="font-semibold">paper trading</span> én later
        <span className="font-semibold"> exchange execution</span>. Backend blijft de bron; manual edits zijn overrides.
      </div>
    </div>
  );
}
