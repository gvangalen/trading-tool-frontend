"use client";

/**
 * AddBotForm
 * --------------------------------------------------
 * Controlled form voor het aanmaken van een trading bot
 *
 * Props:
 * - form: { name, symbol, mode }
 * - setForm: React setState
 *
 * ❌ geen API calls
 * ❌ geen modal logic
 * ✅ alleen input → state
 */
export default function AddBotForm({ form, setForm }) {
  return (
    <div className="space-y-4">

      {/* ================= NAAM ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Naam
        </label>
        <input
          type="text"
          className="input w-full"
          placeholder="DCA BTC"
          value={form?.name ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
      </div>

      {/* ================= ASSET ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Asset
        </label>
        <select
          className="input w-full"
          value={form?.symbol ?? "BTC"}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              symbol: e.target.value,
            }))
          }
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>

      {/* ================= MODE ================= */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Mode
        </label>
        <select
          className="input w-full"
          value={form?.mode ?? "manual"}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
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
