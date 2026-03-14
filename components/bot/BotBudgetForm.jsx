"use client";

import { useEffect, useState } from "react";

/* =====================================================
   Field wrapper
===================================================== */

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}

/* =====================================================
   Slider (zelfde stijl als TradePanel)
===================================================== */

function Slider({ value, min = 1, max = 100, onChange }) {
  return (
    <div className="space-y-3">

      {/* track */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">

        <div
          className="absolute h-full bg-green-500 transition-all duration-200"
          style={{ width: `${value}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />

      </div>

      {/* markers */}
      <div className="relative flex justify-between items-center">

        {[1, 25, 50, 75, 100].map((step) => {

          const active = value >= step;

          return (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              className={`w-4 h-4 rounded-full border transition
                ${
                  active
                    ? "bg-green-500 border-green-500"
                    : "bg-gray-200 border-gray-300"
                }`}
            />
          );
        })}

      </div>

      {/* labels */}
      <div className="flex justify-between text-xs text-[var(--text-muted)]">

        <span>1%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>

      </div>

    </div>
  );
}

/* =====================================================
   BotBudgetForm
===================================================== */

export default function BotBudgetForm({ initialBudget, onChange }) {

  const [form, setForm] = useState({
    total_eur: 0,
    daily_limit_eur: 0,
    max_order_eur: 0,
    max_asset_exposure_pct: 100,
  });

  useEffect(() => {
    if (!initialBudget) return;

    setForm({
      total_eur: initialBudget.total_eur ?? 0,
      daily_limit_eur: initialBudget.daily_limit_eur ?? 0,
      max_order_eur: initialBudget.max_order_eur ?? 0,
      max_asset_exposure_pct: initialBudget.max_asset_exposure_pct ?? 100,
    });
  }, [initialBudget]);

  useEffect(() => {
    onChange?.(form);
  }, [form, onChange]);

  return (
    <div className="space-y-4 text-sm">

      <p className="text-[var(--text-muted)]">
        Dit budget begrenst wat deze bot maximaal mag uitvoeren.
      </p>

      {/* Total budget */}

      <Field label="Totaal budget (€)">
        <input
          type="number"
          className="input w-full"
          value={form.total_eur}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              total_eur: Number(e.target.value),
            }))
          }
        />
      </Field>

      {/* Daily limit */}

      <Field label="Daglimiet (€)">
        <input
          type="number"
          className="input w-full"
          value={form.daily_limit_eur}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              daily_limit_eur: Number(e.target.value),
            }))
          }
        />
      </Field>

      {/* Max order */}

      <Field label="Max per trade (€)">
        <input
          type="number"
          className="input w-full"
          value={form.max_order_eur}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              max_order_eur: Number(e.target.value),
            }))
          }
        />
      </Field>

      {/* Asset exposure slider */}

      <Field label="Max asset exposure (%)">

        <Slider
          value={form.max_asset_exposure_pct}
          min={1}
          max={100}
          onChange={(value) =>
            setForm((s) => ({
              ...s,
              max_asset_exposure_pct: value,
            }))
          }
        />

        <div className="text-xs text-[var(--text-muted)] mt-1">
          Maximum percentage van botkapitaal dat in één asset mag zitten
        </div>

      </Field>

    </div>
  );
}
