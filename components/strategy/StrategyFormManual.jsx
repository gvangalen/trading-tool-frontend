'use client';

import { useState, useMemo } from 'react';

export default function StrategyFormManual({ onSubmit, setups = [], strategies = [] }) {
  const [form, setForm] = useState({
    setup_id: '',
    symbol: '',
    timeframe: '',
    entry: '',
    target: '',
    stop_loss: '',
    explanation: '',
    tags: '',
    favorite: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------------
  // 🔎 Alleen setups van type "manual" + nog geen manual strategy
  // ---------------------------------------------------------
  const filteredSetups = useMemo(() => {
    return setups.filter((s) => {
      if (s.strategy_type?.toLowerCase() !== 'manual') return false;

      const already = strategies.some(
        (st) =>
          String(st.setup_id) === String(s.id) &&
          String(st.strategy_type).toLowerCase() === 'manual'
      );

      return !already;
    });
  }, [setups, strategies]);

  // ---------------------------------------------------------
  // 📝 Form change handler
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (name === 'setup_id') {
      const selected = filteredSetups.find((s) => String(s.id) === String(value));

      setForm((prev) => ({
        ...prev,
        setup_id: value,
        symbol: selected?.symbol || '',
        timeframe: selected?.timeframe || '',
      }));

      setError('');
      return;
    }

    setForm((prev) => ({ ...prev, [name]: val }));
    setError('');
    setSuccess(false);
  };

  // ---------------------------------------------------------
  // 💾 SUBMIT LOGIC
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.setup_id) {
      setError('⚠️ Kies eerst een setup.');
      return;
    }

    const entry = parseFloat(form.entry);
    const target = parseFloat(form.target);
    const stop_loss = parseFloat(form.stop_loss);

    if ([entry, target, stop_loss].some((v) => Number.isNaN(v))) {
      setError('⚠️ Entry, target en stop-loss moeten geldige getallen zijn.');
      return;
    }

    const tags =
      form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const payload = {
      setup_id: Number(form.setup_id),
      setup_name: filteredSetups.find((s) => String(s.id) === String(form.setup_id))?.name,
      symbol: form.symbol,
      timeframe: form.timeframe,
      strategy_type: 'manual',
      entry,
      targets: [target],
      stop_loss,
      explanation: form.explanation.trim(),
      tags,
      favorite: form.favorite,
      origin: 'Handmatig',
    };

    try {
      setSaving(true);
      await onSubmit(payload);
      setSuccess(true);

      // Reset form
      setForm({
        setup_id: '',
        symbol: '',
        timeframe: '',
        entry: '',
        target: '',
        stop_loss: '',
        explanation: '',
        tags: '',
        favorite: false,
      });

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('❌ Fout bij opslaan strategie:', err);
      setError('❌ Opslaan mislukt.');
    } finally {
      setSaving(false);
    }
  };

  const disabled =
    saving ||
    !form.setup_id ||
    !form.entry ||
    !form.target ||
    !form.stop_loss;

  // ---------------------------------------------------------
  // UI RENDER
  // ---------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-4 bg-white dark:bg-gray-800 
        p-6 rounded-xl shadow-md 
        max-w-xl mx-auto
      "
    >
      <h3 className="text-xl font-bold mb-2">✍️ Nieuwe Handmatige Strategie</h3>

      {success && (
        <p className="text-green-600 text-sm">✅ Strategie opgeslagen!</p>
      )}

      {/* SETUP SELECT */}
      <label className="block text-sm font-medium">
        Koppel aan Setup
        <select
          name="setup_id"
          value={form.setup_id}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded dark:bg-gray-900"
          required
        >
          <option value="">-- Kies een setup --</option>
          {filteredSetups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.symbol} – {s.timeframe})
            </option>
          ))}
        </select>
      </label>

      {/* SYMBOL + TIMEFRAME */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Symbol</label>
          <input
            value={form.symbol}
            readOnly
            className="mt-1 w-full border p-2 rounded bg-gray-100 dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Timeframe</label>
          <input
            value={form.timeframe}
            readOnly
            className="mt-1 w-full border p-2 rounded bg-gray-100 dark:bg-gray-900"
          />
        </div>
      </div>

      {/* ENTRY */}
      <label className="block text-sm font-medium">
        Entry prijs (€)
        <input
          name="entry"
          type="number"
          step="any"
          value={form.entry}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded dark:bg-gray-900"
        />
      </label>

      {/* TARGET */}
      <label className="block text-sm font-medium">
        Target prijs (€)
        <input
          name="target"
          type="number"
          step="any"
          value={form.target}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded dark:bg-gray-900"
        />
      </label>

      {/* STOP LOSS */}
      <label className="block text-sm font-medium">
        Stop-loss (€)
        <input
          name="stop_loss"
          type="number"
          step="any"
          value={form.stop_loss}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded dark:bg-gray-900"
        />
      </label>

      {/* EXPLANATION */}
      <label className="block text-sm font-medium">
        Uitleg / notities
        <textarea
          name="explanation"
          rows={3}
          value={form.explanation}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded dark:bg-gray-900"
        />
      </label>

      {/* TAGS */}
      <label className="block text-sm font-medium">
        Tags (komma gescheiden)
        <input
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded dark:bg-gray-900"
        />
      </label>

      {/* FAVORIET */}
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="favorite"
          checked={form.favorite}
          onChange={handleChange}
        />
        <span>Favoriet</span>
      </label>

      {/* ERROR */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* SAVE BUTTON */}
      <button
        type="submit"
        disabled={disabled}
        className="
          w-full bg-blue-600 text-white py-2 rounded 
          hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed
        "
      >
        {saving ? '⏳ Opslaan...' : '💾 Strategie opslaan'}
      </button>
    </form>
  );
}
