'use client';

import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useSetupData } from '@/hooks/useSetupData';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function StrategyFormDCA({ onSubmit, setups = [] }) {
  const { loadSetups } = useSetupData();

  const [error, setError] = useState('');
  const [form, setForm] = useState({
    setup_id: '',
    setup_name: '',
    symbol: '',
    timeframe: '',
    amount: '',
    frequency: '',
    rules: '',
    favorite: false,
    tags: '',
  });

  useEffect(() => {
    loadSetups();
  }, []);

  // 👉 Filter alleen setups met type "dca"
  const availableSetups = setups.filter(
    (s) => s.strategy_type?.toLowerCase() === 'dca'
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === 'setup_id') {
      const selected = availableSetups.find((s) => String(s.id) === String(value));

      if (!selected) {
        setError('❌ Ongeldige setup geselecteerd.');
        return;
      }

      setForm((prev) => ({
        ...prev,
        setup_id: selected.id,
        setup_name: selected.name,
        symbol: selected.symbol || '',
        timeframe: selected.timeframe || '',
      }));

      setError('');
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const isFormValid = () => {
    const parsedAmount = Number(form.amount);
    return form.setup_id && parsedAmount > 0 && form.frequency;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid()) {
      setError('❌ Vul alle verplichte velden correct in.');
      return;
    }

    const payload = {
      strategy_type: 'dca',
      amount: Number(form.amount),
      frequency: form.frequency,
      rules: form.rules?.trim() || '',
      setup_id: form.setup_id,
      setup_name: form.setup_name,
      symbol: form.symbol,
      timeframe: form.timeframe,
      favorite: !!form.favorite,
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      origin: 'DCA',
    };

    try {
      await onSubmit(payload);
      toast.success('💾 DCA-strategie opgeslagen!');

      setForm({
        setup_id: '',
        setup_name: '',
        symbol: '',
        timeframe: '',
        amount: '',
        frequency: '',
        rules: '',
        favorite: false,
        tags: '',
      });
    } catch (err) {
      console.error('❌ Fout bij opslaan strategie:', err);
      setError('❌ Opslaan mislukt.');
    }
  };

  const valid = isFormValid();

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-xl mx-auto
        bg-white dark:bg-gray-800
        p-6 rounded-xl shadow-md
        space-y-4
      "
    >
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
        💰 Nieuwe DCA-strategie
      </h2>

      {/* SETUP SELECT */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="font-medium">🧩 Koppel aan Setup</label>
          <InfoTooltip text="Alleen setups van type ‘DCA’ worden getoond." />
        </div>

        <select
          name="setup_id"
          value={form.setup_id}
          onChange={handleChange}
          className="w-full border p-2 rounded dark:bg-gray-900"
        >
          <option value="">
            {availableSetups.length === 0
              ? '⚠️ Geen DCA-setups beschikbaar'
              : '-- Kies een setup --'}
          </option>

          {availableSetups.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.symbol} – {s.timeframe})
            </option>
          ))}
        </select>

        {error.includes('setup') && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </div>

      {/* SYMBOL */}
      <div>
        <label className="block mb-1 font-medium">📈 Symbol (automatisch)</label>
        <input
          value={form.symbol}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-900"
        />
      </div>

      {/* TIMEFRAME */}
      <div>
        <label className="block mb-1 font-medium">⏱️ Timeframe (automatisch)</label>
        <input
          value={form.timeframe}
          readOnly
          className="w-full border p-2 rounded bg-gray-100 dark:bg-gray-900"
        />
      </div>

      {/* AMOUNT */}
      <div>
        <label className="block mb-1 font-medium">💶 Bedrag per keer</label>
        <input
          type="number"
          name="amount"
          min="1"
          step="1"
          value={form.amount}
          onChange={handleChange}
          placeholder="Bijv. 100"
          className="w-full border p-2 rounded dark:bg-gray-900"
        />
      </div>

      {/* FREQUENCY */}
      <div>
        <label className="block mb-1 font-medium">⏰ Frequentie</label>
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-full border p-2 rounded dark:bg-gray-900"
        >
          <option value="">-- Kies frequentie --</option>
          <option value="weekly">Wekelijks</option>
          <option value="monthly">Maandelijks</option>
        </select>
      </div>

      {/* RULES */}
      <div>
        <label className="block mb-1 font-medium">📋 Koopregels (optioneel)</label>
        <textarea
          name="rules"
          rows={3}
          value={form.rules}
          onChange={handleChange}
          placeholder="Bijv. koop alleen bij F&G < 30"
          className="w-full border p-2 rounded resize-none dark:bg-gray-900"
        />
      </div>

      {/* TAGS */}
      <div>
        <label className="block mb-1 font-medium">🏷️ Tags (komma gescheiden)</label>
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Bijv. longterm, btc, dca"
          className="w-full border p-2 rounded dark:bg-gray-900"
        />
      </div>

      {/* FAVORIET */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="favorite"
          checked={form.favorite}
          onChange={handleChange}
        />
        <label className="font-medium">⭐ Favoriet</label>
      </div>

      {/* ERROR */}
      {error && !error.includes('setup') && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={!valid}
        className="
          w-full py-2 rounded
          bg-blue-600 text-white
          hover:bg-blue-700
          disabled:bg-blue-300 disabled:cursor-not-allowed
        "
      >
        💾 DCA-strategie opslaan
      </button>
    </form>
  );
}
