"use client";

import { useEffect, useState } from "react";

export default function AddBotForm({ initialForm, onChange }) {
  const [local, setLocal] = useState(
    initialForm || { name: "", symbol: "BTC", mode: "manual" }
  );

  // push elke wijziging naar parent (via callback)
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
