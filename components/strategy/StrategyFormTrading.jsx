'use client';

import { useState, useMemo, useEffect } from 'react';

export default function StrategyFormTrading({
  setups = [],
  onSubmit,
  mode = 'create',             // "create" | "edit"
  initialData = null,
  hideSubmit = false           // modal gebruikt eigen save-knop
}) {
  // -------------------------------------------------
  // 🌱 FORM STATE (met initialData ondersteuning)
  // -------------------------------------------------
  const [form, setForm] = useState({
    setup_id: initialData?.setup_id || '',
    symbol: initialData?.symbol || '',
    timeframe: initialData?.timeframe || '',
    entry: initialData?.entry || '',
    targetsText: Array.isArray(initialData?.targets)
      ? initialData.targets.join(', ')
      : '',
    stop_loss: initialData?.stop_loss || '',
    explanation: initialData?.explanation || '',
    favorite: initialData?.favorite || false,
    tags: Array.isArray(initialData?.tags)
      ? initialData.tags.join(', ')
      : '',
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // -------------------------------------------------
  // 🔍 FILTER: alleen setups met strategy_type "trading"
  // -------------------------------------------------
  const availableSetups = useMemo(
    () =>
      Array.isArray(setups)
        ? setups.filter((s) => String(s.strategy_type).toLowerCase() === 'trading')
        : [],
    [setups]
  );

  // -------------------------------------------------
  // 📝 Update form bij initialData change
  // -------------------------------------------------
  useEffect(() => {
    if (!initialData) return;

    setForm({
      setup_id: initialData.setup_id,
      symbol: initialData.symbol,
      timeframe: initialData.timeframe,
      entry: initialData.entry,
      targetsText: Array.isArray(initialData.targets)
        ? initialData.targets.join(', ')
        : '',
      stop_loss: initialData.stop_loss,
      explanation: initialData.explanation ?? '',
      favorite: initialData.favorite ?? false,
      tags: Array.isArray(initialData.tags)
        ? initialData.tags.join(', ')
        : '',
    });
  }, [initialData]);

  // -------------------------------------------------
  // 📝 Form change handler
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

  // -------------------------------------------------
  // 💾 Submit
  // -------------------------------------------------
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
      setup_id: Number(form.setup_id),
      entry,
      targets,
      stop_loss,
      explanation: form.explanation.trim(),
      favorite: form.favorite,
      tags,
    };

    try {
      setSaving(true);
      await onSubmit(payload);
      setSuccess(true);

      if (mode === 'create') {
        setForm({
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
      }

      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error('❌ Error saving trading strategy:', err);
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
  // RENDER — TradingView look 2.0
  // -------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-xl mx-auto
        bg-white dark:bg-gray-800
        p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
        space-y-4
      "
    >
      <h3 className="text-xl font-semibold flex items-center gap-2">
        📈 {mode === 'edit' ? 'Tradingstrategie bewerken' : 'Nieuwe Tradingstrategie'}
      </h3>

      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 px-3 py-1 rounded text-sm">
          ✅ Strategie opgeslagen!
        </div>
      )}

      {/* Setup-selectie */}
      <label className="block text-sm font-medium">
        Koppel aan Setup
        <select
          name="setup_id"
          value={form.setup_id}
          disabled={mode === 'edit'}          // tijdens edit mag je dit NIET wijzigen
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded bg-white dark:bg-gray-900 disabled:opacity-50"
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

      {/* Symbol + timeframe */}
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

      {/* Entry */}
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

      {/* Targets */}
      <label className="block text-sm font-medium">
        Target prijzen (komma gescheiden)
        <input
          name="targetsText"
          type="text"
          placeholder="Bijv. 32000, 34000, 36000"
          value={form.targetsText}
          onChange={handleChange}
          className="mt-1 w-full border p-2 rounded dark:bg-gray-900"
        />
      </label>

      {/* Stop-loss */}
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

      {/* Explanation */}
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

      {/* Tags */}
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

      {/* Bottom */}
      <div className="flex items-center justify-between mt-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="favorite"
            checked={form.favorite}
            onChange={handleChange}
          />
          ⭐ Favoriet
        </label>

        {!hideSubmit && (
          <button
            type="submit"
            disabled={disabled}
            className="
              bg-blue-600 text-white px-6 py-2 rounded
              hover:bg-blue-700 
              disabled:bg-blue-300 disabled:cursor-not-allowed
              text-sm
            "
          >
            {saving ? '⏳ Opslaan...' : '💾 Strategie opslaan'}
          </button>
        )}

        {/* Verborgen submit voor modals */}
        {hideSubmit && mode === 'edit' && (
          <button id="strategy-edit-submit" type="submit" className="hidden">
            Submit
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </form>
  );
}
