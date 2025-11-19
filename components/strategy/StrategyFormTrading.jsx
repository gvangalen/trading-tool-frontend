'use client';

import { useState, useMemo } from 'react';

export default function StrategyFormTrading({ setups = [], onSubmit }) {
  const [form, setForm] = useState({
    setup_id: '',
    symbol: '',
    timeframe: '',
    entry: '',
    targetsText: '',
    stop_loss: '',
    explanation: '',
    favorite: false,
    tags: '',
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ FILTER: alleen setups met strategy_type "trading"
  const availableSetups = useMemo(
    () =>
      Array.isArray(setups)
        ? setups.filter((s) => s.strategy_type?.toLowerCase() === 'trading')
        : [],
    [setups]
  );

  // -------------------------------------------------
  // Form handlers
  // -------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setError('');

    if (name === 'setup_id') {
      const selected = availableSetups.find(
        (s) => String(s.id) === String(val)
      );
      setForm((prev) => ({
        ...prev,
        setup_id: val,
        symbol: selected?.symbol || '',
        timeframe: selected?.timeframe || '',
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: typeof val === 'string' ? val.trimStart() : val,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.setup_id) {
      setError('❌ Kies eerst een setup.');
      return;
    }

    if (!form.entry || !form.targetsText || !form.stop_loss) {
      setError('❌ Entry, targets en stop-loss zijn verplicht.');
      return;
    }

    const entry = parseFloat(form.entry);
    const stop_loss = parseFloat(form.stop_loss);
    const targets = form.targetsText
      .split(',')
      .map((t) => parseFloat(t.trim()))
      .filter((n) => !Number.isNaN(n));

    if (Number.isNaN(entry) || Number.isNaN(stop_loss) || targets.length === 0) {
      setError('❌ Gebruik geldige getallen voor entry/targets/stop-loss.');
      return;
    }

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      setup_id: form.setup_id,
      explanation: form.explanation.trim(),
      entry,
      targets,
      stop_loss,
      favorite: form.favorite,
      tags,
    };

    try {
      setSaving(true);
      if (onSubmit) {
        await onSubmit(payload);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error('❌ Fout bij submit trading-strategie:', err);
      setError('❌ Opslaan mislukt.');
    } finally {
      setSaving(false);
    }
  };

  const disabled =
    saving ||
    !form.setup_id ||
    !form.entry ||
    !form.targetsText ||
    !form.stop_loss;

  // -------------------------------------------------
  // Render
  // -------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-3"
    >
      <h3 className="text-lg font-semibold">➕ Nieuwe Tradingstrategie</h3>

      {success && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-3 py-1 rounded text-sm">
          ✅ Strategie opgeslagen!
        </div>
      )}

      {/* Setup keuze */}
      <label className="block text-sm font-medium">
        Koppel aan Setup
        <select
          name="setup_id"
          value={form.setup_id}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded"
          required
        >
          <option value="">-- Kies een setup --</option>
          {availableSetups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.symbol} – {s.timeframe})
            </option>
          ))}
        </select>
      </label>

      {/* Rest hetzelfde */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Symbol</label>
          <input
            value={form.symbol}
            readOnly
            className="mt-1 w-full border p-2 rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Timeframe</label>
          <input
            value={form.timeframe}
            readOnly
            className="mt-1 w-full border p-2 rounded bg-gray-100"
          />
        </div>
      </div>

      <label className="block text-sm font-medium">
        Entry prijs
        <input
          name="entry"
          type="number"
          step="any"
          value={form.entry}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded"
        />
      </label>

      <label className="block text-sm font-medium">
        Target prijzen (komma gescheiden)
        <input
          name="targetsText"
          type="text"
          value={form.targetsText}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded"
        />
      </label>

      <label className="block text-sm font-medium">
        Stop-loss
        <input
          name="stop_loss"
          type="number"
          step="any"
          value={form.stop_loss}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded"
        />
      </label>

      <label className="block text-sm font-medium">
        Uitleg / notities
        <textarea
          name="explanation"
          rows={3}
          value={form.explanation}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded"
        />
      </label>

      <label className="block text-sm font-medium">
        Tags (komma gescheiden)
        <input
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded"
        />
      </label>

      <div className="flex items-center justify-between mt-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="favorite"
            checked={form.favorite}
            onChange={handleChange}
          />
          <span>Favoriet</span>
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 text-sm"
        >
          {saving ? '⏳ Opslaan...' : '💾 Strategie opslaan'}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </form>
  );
}
