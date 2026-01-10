"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function BotRulesEditor({ initialRules = [], onChange }) {
  const [rules, setRules] = useState(
    initialRules.length > 0
      ? initialRules
      : []
  );

  // push changes naar parent (modal owner)
  useEffect(() => {
    onChange?.(rules);
  }, [rules, onChange]);

  const updateRule = (id, field, value) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r
      )
    );
  };

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "Nieuwe rule",
        enabled: true,
        condition: "",
        action: "BUY",
      },
    ]);
  };

  const removeRule = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="p-3 rounded-lg border border-[var(--card-border)] space-y-2"
        >
          <div className="flex justify-between items-center gap-2">
            <input
              className="input font-medium"
              value={rule.name}
              onChange={(e) =>
                updateRule(rule.id, "name", e.target.value)
              }
              placeholder="Rule naam"
            />

            <button
              className="btn-icon text-red-500"
              onClick={() => removeRule(rule.id)}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              className="input"
              value={rule.enabled ? "on" : "off"}
              onChange={(e) =>
                updateRule(
                  rule.id,
                  "enabled",
                  e.target.value === "on"
                )
              }
            >
              <option value="on">Actief</option>
              <option value="off">Uit</option>
            </select>

            <input
              className="input col-span-2"
              value={rule.condition}
              onChange={(e) =>
                updateRule(rule.id, "condition", e.target.value)
              }
              placeholder="Voorwaarde (bv: score > 70)"
            />
          </div>

          <select
            className="input"
            value={rule.action}
            onChange={(e) =>
              updateRule(rule.id, "action", e.target.value)
            }
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
            <option value="HOLD">HOLD</option>
          </select>
        </div>
      ))}

      <button className="btn-secondary w-full" onClick={addRule}>
        <Plus size={16} className="mr-1" />
        Rule toevoegen
      </button>
    </div>
  );
}
