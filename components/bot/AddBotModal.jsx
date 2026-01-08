import { useState } from "react";

export default function AddBotModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("BTC");
  const [mode, setMode] = useState("manual");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit() {
    if (!name) return alert("Bot name verplicht");

    setLoading(true);
    try {
      const res = await fetch("/api/bot/configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, symbol, mode }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error();

      onCreated(data); // ⬅️ bot teruggeven aan parent
      onClose();
    } catch {
      alert("Bot aanmaken mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px]">
        <h2 className="text-lg font-bold mb-4">➕ Nieuwe bot</h2>

        <label className="block mb-2">Naam</label>
        <input
          className="border w-full mb-4 p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="DCA BTC"
        />

        <label className="block mb-2">Asset</label>
        <select
          className="border w-full mb-4 p-2"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </select>

        <label className="block mb-4">
          Mode
          <select
            className="border w-full p-2 mt-1"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="manual">Manual</option>
            <option value="semi">Semi-auto</option>
            <option value="auto">Auto</option>
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Annuleren</button>
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Opslaan..." : "Opslaan"}
          </button>
        </div>
      </div>
    </div>
  );
}
