'use client';

import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useSetupData } from '@/hooks/useSetupData';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`✍️ handleChange: veld '${name}' veranderd naar '${value}'`);

    if (name === 'setup_id') {
      const selected = setups.find((s) => String(s.id) === String(value));
      if (!selected) {
        const errMsg = '❌ Ongeldige setup geselecteerd.';
        console.error(errMsg);
        setError(errMsg);
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
      console.log('✅ Setup geselecteerd:', selected);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
      setError('');
    }
  };

  const isFormValid = () => {
    const { setup_id, setup_name, symbol, timeframe, amount, frequency } = form;
    const parsedAmount = Number(amount);

    if (!setup_id || !setup_name || !symbol || !timeframe) return false;
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) return false;
    if (!frequency) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('📝 Formulier verzonden met data:', form);

    if (!isFormValid()) {
      const errMsg = '❌ Vul alle verplichte velden correct in.';
      console.warn(errMsg);
      setError(errMsg);
      return;
    }

    const parsedAmount = Number(form.amount);

    const strategy = {
      strategy_type: 'dca',
      amount: parsedAmount,
      frequency: form.frequency,
      rules: form.rules?.trim() || '',
      setup_id: form.setup_id,
      setup_name: form.setup_name,
      symbol: form.symbol,
      timeframe: form.timeframe,
      origin: 'DCA',
    };

    try {
      console.log('🚀 Strategie object wordt doorgestuurd:', strategy);
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

      <div>
        <label htmlFor="setup_id" className="block mb-1 font-medium">
          🧩 Koppel aan Setup
        </label>
        <select
          id="setup_id"
          name="setup_id"
          value={form.setup_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          aria-invalid={error.includes('setup') ? 'true' : 'false'}
          aria-describedby={error.includes('setup') ? 'error-setup_id' : undefined}
        >
          <option value="">-- Kies een setup --</option>
          {Array.isArray(setups) &&
            setups
              .filter((s) => s && s.id && s.name)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.symbol} – {s.timeframe})
                </option>
              ))}
        </select>
        {error.includes('setup') && (
          <p id="error-setup_id" className="text-red-600 text-sm mt-1" role="alert">
            {error}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="symbol" className="block mb-1 font-medium">
          📈 Symbol (automatisch)
        </label>
        <input
          id="symbol"
          name="symbol"
          value={form.symbol}
          readOnly
          className="w-full border px-3 py-2 rounded bg-gray-100"
          aria-readonly="true"
        />
      </div>

      <div>
        <label htmlFor="timeframe" className="block mb-1 font-medium">
          ⏱️ Timeframe (automatisch)
        </label>
        <input
          id="timeframe"
          name="timeframe"
          value={form.timeframe}
          readOnly
          className="w-full border px-3 py-2 rounded bg-gray-100"
          aria-readonly="true"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block mb-1 font-medium">
          💶 Bedrag per keer
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="1"
          step="1"
          value={form.amount}
          onChange={handleChange}
          placeholder="Bijv. 100"
          className="w-full border px-3 py-2 rounded"
          required
          aria-invalid={error.includes('Bedrag') ? 'true' : 'false'}
          aria-describedby={error.includes('Bedrag') ? 'error-amount' : undefined}
        />
      </div>

      <div>
        <label htmlFor="frequency" className="block mb-1 font-medium">
          ⏰ Frequentie
        </label>
        <select
          id="frequency"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          aria-invalid={error.includes('frequentie') ? 'true' : 'false'}
          aria-describedby={error.includes('frequentie') ? 'error-frequency' : undefined}
        >
          <option value="" disabled>
            Kies frequentie...
          </option>
          <option value="weekly">Wekelijks</option>
          <option value="monthly">Maandelijks</option>
        </select>
      </div>

      <div>
        <label htmlFor="rules" className="block mb-1 font-medium">
          📋 Koopregels (optioneel)
        </label>
        <textarea
          id="rules"
          name="rules"
          value={form.rules}
          onChange={handleChange}
          rows={3}
          placeholder="Bijv. koop alleen bij Fear & Greed < 30"
          className="w-full border px-3 py-2 rounded resize-none"
        />
      </div>

      {error && !error.includes('setup') && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full ${
          !isValid ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-disabled={!isValid}
      >
        💾 DCA-strategie opslaan
      </button>
    </form>
  );
}
