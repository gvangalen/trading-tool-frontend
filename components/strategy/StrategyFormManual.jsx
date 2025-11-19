'use client';

import { useState, useMemo } from 'react';

export default function StrategyFormManual({ onSubmit, setups = [], strategies = [] }) {
  const [form, setForm] = useState({
    setup_id: '',
    entry: '',
    target: '',
    stop_loss: '',
    explanation: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------------------------------------------------------
  // 🔎 FILTER: alleen setups met type "manual"
  // + nog GEEN bestaande manual strategie
  // ---------------------------------------------------------
  const filteredSetups = useMemo(() => {
    return setups.filter((s) => {
      const type = s.strategy_type?.toLowerCase();
      if (type !== 'manual') return false;

      const alreadyHasManual = strategies.some(
        (strat) =>
          String(strat.setup_id) === String(s.id) &&
          String(strat.strategy_type).toLowerCase() === 'manual'
      );

      return !alreadyHasManual;
    });
  }, [setups, strategies]);

  // ---------------------------------------------------------
  // 📝 Form change handler
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  // ---------------------------------------------------------
  // 💾 SUBMIT
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.setup_id) {
      setError('⚠️ Kies eerst een setup.');
      return;
    }

    const setup = filteredSetups.find((s) => String(s.id) === String(form.setup_id));

    if (!setup) {
      setError('⚠️ Ongeldige setup geselecteerd.');
      return;
    }

    const entry = parseFloat(form.entry);
    const target = parseFloat(form.target);
    const stop_loss = parseFloat(form.stop_loss);

    if ([entry, target, stop_loss].some((v) => Number.isNaN(v))) {
      setError('⚠️ Entry, target en stop-loss moeten geldige getallen zijn.');
      return;
    }

    const payload = {
      setup_id: setup.id,
      setup_name: setup.name,
      symbol: setup.symbol,
      timeframe: setup.timeframe,
      strategy_type: 'manual',
      entry,
      targets: [target],
      stop_loss,
      explanation: form.explanation.trim(),
      origin: 'Handmatig',
    };

    try {
      setSaving(true);
      await onSubmit(payload);
      setSuccess(true);

      setForm({
        setup_id: '',
        entry: '',
        target: '',
        stop_loss: '',
        explanation: '',
      });

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('❌ Error saving manual strategy:', err);
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
  // RENDER
  // ---------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-xl mx-auto
        bg-white dark:bg-gray-800
        p-6 rounded-xl shadow
        space-y-4
      "
    >
      <h3 className="text-xl font-semibold">✍️ Nieuwe Handmatige Strategie</h3>

      {success && (
        <p className="text-green-600 dark:text-green-400 text-sm">
          ✅ Strategie opgeslagen!
        </p>
      )}

      {/* SETUP SELECT */}
      <div>
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

        {filteredSetups.length === 0 && (
          <p className="text-red-500 text-sm mt-1">
            ⚠️ Geen setups beschikbaar van type “manual” zonder bestaande strategie.
          </p>
        )}
      </div>

      {/* Entry */}
      <div>
        <label className="block font-medium text-sm">
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
      </div>

      {/* Target */}
      <div>
        <label className="block font-medium text-sm">
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
      </div>

      {/* Stop-loss */}
      <div>
        <label className="block font-medium text-sm">
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
      </div>

      {/* Explanation */}
      <div>
        <label className="block font-medium text-sm">
          Uitleg / notities
          <textarea
            name="explanation"
            rows={3}
            value={form.explanation}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded dark:bg-gray-900"
          />
        </label>
      </div>

      {/* Errors */}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      {/* Submit button */}
      <button
        type="submit"
        disabled={disabled}
        className="
          w-full bg-blue-600 text-white py-2 rounded
          hover:bg-blue-700
          disabled:bg-blue-300 disabled:cursor-not-allowed
        "
      >
        {saving ? '⏳ Opslaan...' : '💾 Strategie opslaan'}
      </button>
    </form>
  );
}
