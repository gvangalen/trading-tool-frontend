"use client";

import { useEffect, useState } from "react";

export default function BotBudgetForm({ initialBudget, onChange }) {
  const [form, setForm] = useState({
    total_eur: 0,
    daily_limit_eur: 0,
    max_order_eur: 0,
  });

  useEffect(() => {
    if (!initialBudget) return;

    setForm({
      total_eur: initialBudget.total_eur ?? 0,
      daily_limit_eur: initialBudget.daily_limit_eur ?? 0,
      max_order_eur: initialBudget.max_order_eur ?? 0,
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

      <Field label="Totaal budget (€)">
        <input
          type="number"
          className="input w-full"
          value={form.total_eur}
          onChange={(e) =>
            setForm((s) => ({ ...s, total_eur: Number(e.target.value) }))
          }
        />
      </Field>

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
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      {children}
    </div>
  );
}
