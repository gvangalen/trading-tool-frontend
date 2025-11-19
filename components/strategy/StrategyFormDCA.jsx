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
  });

  useEffect(() => {
    loadSetups();
  }, []);

  // ✅ Alleen DCA setups tonen
  const availableSetups = setups.filter(
    (s) => s.strategy_type && s.strategy_type.toLowerCase() === 'dca'
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

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
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setError('');
    }
  };

  const isFormValid = () => {
    const { setup_id, setup_name, symbol, timeframe, amount, frequency } = form;
    const parsedAmount = Number(amount);
    return (
      setup_id &&
      setup_name &&
      symbol &&
      timeframe &&
      amount &&
      !isNaN(parsedAmount) &&
      parsedAmount > 0 &&
      frequency
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid()) {
      setError('❌ Vul alle verplichte velden correct in.');
      return;
    }

    const strategy = {
      strategy_type: 'dca',
      amount: Number(form.amount),
      frequency: form.frequency,
      rules: form.rules?.trim() || '',
      setup_id: form.setup_id,
      setup_name: form.setup_name,
      symbol: form.symbol,
      timeframe: form.timeframe,
      origin: 'DCA',
    };

    try {
      await onSubmit(strategy);
      setForm({
        setup_id: '',
        setup_name: '',
        symbol: '',
        timeframe: '',
        amount: '',
        frequency: '',
        rules: '',
      });
      toast.success('💾 DCA-strategie succesvol opgeslagen!');
    } catch (err) {
      console.error('❌ Fout bij submit DCA-strategie:', err);
      setError('❌ Fout bij opslaan strategie.');
    }
  };

  const isValid = isFormValid();

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow-md max-w-md"
      aria-live="polite"
      noValidate
    >
      <h2 className="text-lg font-bold mb-2">💰 Nieuwe DCA-strategie</h2>

      {/* Setup-selectie */}
      <div>
        <div className="flex items-center gap-2">
          <label htmlFor="setup_id" className="block mb-1 font-medium">
            🧩 Koppel aan Setup
          </label>
          <InfoTooltip text="Alleen setups van type ‘DCA’ worden hier getoond." />
        </div>

        <select
          id="setup_id"
          name="setup_id"
          value={form.setup_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          disabled={availableSetups.length === 0}
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
          <p className="text-red-600 text-sm mt-1">{error}</p>
        )}
      </div>

      {/* Symbol */}
      <div>
        <label className="block mb-1 font-medium">📈 Symbol (automatisch)</label>
        <input
          value={form.symbol}
          readOnly
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
      </div>

      {/* Timeframe */}
      <div>
        <label className="block mb-1 font-medium">⏱️ Timeframe (automatisch)</label>
        <input
          value={form.timeframe}
          readOnly
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
      </div>

      {/* Bedrag */}
      <div>
        <label className="block mb-1 font-medium">💶 Bedrag per keer</label>
        <input
          name="amount"
          type="number"
          min="1"
          step="1"
          value={form.amount}
          onChange={handleChange}
          placeholder="Bijv. 100"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      {/* Frequentie */}
      <div>
        <label className="block mb-1 font-medium">⏰ Frequentie</label>
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="" disabled>Kies frequentie...</option>
          <option value="weekly">Wekelijks</option>
          <option value="monthly">Maandelijks</option>
        </select>
      </div>

      {/* Koopregels */}
      <div>
        <label className="block mb-1 font-medium">📋 Koopregels (optioneel)</label>
        <textarea
          name="rules"
          value={form.rules}
          onChange={handleChange}
          rows={3}
          placeholder="Bijv. koop alleen bij F&G < 30"
          className="w-full border px-3 py-2 rounded resize-none"
        />
      </div>

      {/* Foutmelding */}
      {error && !error.includes('setup') && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full ${
          !isValid ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        💾 DCA-strategie opslaan
      </button>
    </form>
  );
}
