"use client";

import { useEffect, useState } from "react";

export default function AddBotForm({ initialForm, onChange }) {
  const [local, setLocal] = useState(
    initialForm || {
      name: "",
      bot_type: "dca",   // ✅ default
      symbol: "BTC",
      mode: "manual",
    }
  );

  // als modal opnieuw opent met andere initialForm (edit), sync dan state
  useEffect(() => {
    if (initialForm) {
      setLocal({
        name: initialForm.name ?? "",
        bot_type: initialForm.bot_type ?? "dca", // ✅ fallback
        symbol: initialForm.symbol ?? "BTC",
        mode: initialForm.mode ?? "manual",
      });
    }
  }, [initialForm]);

  // push elke wijziging naar parent
  useEffect(() => {
    onChange?.(local);
  }, [local, onChange]);

  return (
    <div className="space-y-4">
      {/* ================= NAME ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">Naam</label>
        <input
          type="text"
          className="input w-full"
          placeholder="DCA BTC"
          value={local.name}
          onChange={(e) =>
            setLocal((s) => ({
              ...s,
              name: e.target.value,
            }))
          }
        />
      </div>

      {/* ================= BOT TYPE ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">Bot type</label>
        <select
          className="input w-full"
          value={local.bot_type} // ✅ altijd gevuld
          onChange={(e) =>
            setLocal((s) => ({
              ...s,
              bot_type: e.target.value, // ✅ lowercase values
            }))
          }
        >
          <option value="dca">DCA</option>
          <option value="swing">Swing</option>
          <option value="trade">Trade</option>
        </select>
      </div>

      {/* ================= ASSET ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">Asset</label>
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

      {/* ================= MODE ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">Mode</label>
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
  );
}
