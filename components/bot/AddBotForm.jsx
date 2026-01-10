"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

function emptyRule() {
  return {
    id: crypto.randomUUID(),
    condition: "",
    action: "",
    enabled: true,
  };
}

export default function AddBotForm({ initialForm, onChange }) {
  const [local, setLocal] = useState(
    initialForm || {
      name: "",
      bot_type: "dca",
      symbol: "BTC",
      mode: "manual",
      rules: [],
    }
  );

  /* =====================================================
     🔁 SYNC BIJ EDIT (modal opnieuw open)
  ===================================================== */
  useEffect(() => {
    if (initialForm) {
      setLocal({
        name: initialForm.name ?? "",
        bot_type: initialForm.bot_type ?? "dca",
        symbol: initialForm.symbol ?? "BTC",
        mode: initialForm.mode ?? "manual",
        rules: Array.isArray(initialForm.rules)
          ? initialForm.rules
          : [],
      });
    }
  }, [initialForm]);

  /* =====================================================
     📤 PUSH NAAR PARENT
  ===================================================== */
  useEffect(() => {
    onChange?.(local);
  }, [local, onChange]);

  /* =====================================================
     🧠 RULE HANDLERS
  ===================================================== */
  const addRule = () => {
    setLocal((s) => ({
      ...s,
      rules: [...(s.rules || []), emptyRule()],
    }));
  };

  const updateRule = (id, patch) => {
    setLocal((s) => ({
      ...s,
      rules: s.rules.map((r) =>
        r.id === id ? { ...r, ...patch } : r
      ),
    }));
  };

  const removeRule = (id) => {
    setLocal((s) => ({
      ...s,
      rules: s.rules.filter((r) => r.id !== id),
    }));
  };

  /* =====================================================
     🧠 RENDER
  ===================================================== */
  return (
    <div className="space-y-6">
      {/* ================= BASIS ================= */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Naam
          </label>
          <input
            className="input w-full"
            placeholder="DCA BTC Bot"
            value={local.name}
            onChange={(e) =>
              setLocal((s) => ({ ...s, name: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Bot type
          </label>
          <select
            className="input w-full"
            value={local.bot_type}
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                bot_type: e.target.value,
              }))
            }
          >
            <option value="dca">DCA</option>
            <option value="swing">Swing</option>
            <option value="trade">Trade</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Asset
          </label>
          <select
            className="input w-full"
            value={local.symbol}
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                symbol: e.target.value,
              }))
            }
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Mode
          </label>
          <select
            className="input w-full"
            value={local.mode}
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                mode: e.target.value,
              }))
            }
          >
            <option value="manual">Manual</option>
            <option value="semi">Semi-auto</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>

      {/* ================= RULES ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Rules</h4>
          <button
            type="button"
            className="btn-secondary flex items-center gap-1"
            onClick={addRule}
          >
            <Plus size={14} />
            Rule toevoegen
          </button>
        </div>

        {(!local.rules || local.rules.length === 0) && (
          <p className="text-sm text-muted">
            Nog geen rules toegevoegd.
          </p>
        )}

        {local.rules?.map((rule, i) => (
          <div
            key={rule.id}
            className="border rounded-lg p-3 space-y-2 bg-[var(--card)]"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Rule {i + 1}
              </span>
              <button
                type="button"
                className="btn-icon text-red-500"
                onClick={() => removeRule(rule.id)}
                title="Rule verwijderen"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <input
              className="input w-full"
              placeholder="Voorwaarde (bv: macro_score > 70)"
              value={rule.condition}
              onChange={(e) =>
                updateRule(rule.id, {
                  condition: e.target.value,
                })
              }
            />

            <input
              className="input w-full"
              placeholder="Actie (bv: buy €100)"
              value={rule.action}
              onChange={(e) =>
                updateRule(rule.id, {
                  action: e.target.value,
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
