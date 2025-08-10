'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function StrategyFormDCA({ onSubmit, setups = [] }) {
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    setup_id: '',
    setup_name: '',
    asset: '',
    timeframe: '',
    amount: '',
    frequency: '',
    rules: '',
  });

  // Log wanneer setups veranderen (optioneel)
  useEffect(() => {
    console.log('ℹ️ setups prop gewijzigd:', setups);
  }, [setups]);

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
        asset: selected.symbol || '',
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
    const { setup_id, setup_name, asset, timeframe, amount, frequency } = form;
    const parsedAmount = Number(amount);

    if (!setup_id || !setup_name || !asset || !timeframe) {
      console.warn('⚠️ Validatie faalt: verplichte velden setup ontbreken');
      return false;
    }
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      console.warn('⚠️ Validatie faalt: ongeldig bedrag:', amount);
      return false;
    }
    if (!frequency) {
      console.warn('⚠️ Validatie faalt: frequentie niet ingevuld');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('📝 Formulier verzonden met data:', form);

    const valid = isFormValid();
    if (!valid) {
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
      asset: form.asset,
      timeframe: form.timeframe,
      origin: 'DCA',
      // Entry, targets en stop_loss worden hier niet meegegeven
    };

    try {
      console.log('🚀 Strategie object wordt doorgestuurd:', strategy);
      await onSubmit(strategy);
      toast.success('💾 DCA-strategie succesvol opgeslagen!');
      setForm({
        setup_id: '',
        setup_name: '',
        asset: '',
        timeframe: '',
        amount: '',
        frequency: '',
        rules: '',
      });
      console.log('✅ Formulier gereset na succesvolle submit');
    } catch (err) {
      console.error('❌ Fout bij submit DCA-strategie:', err);
      toast.error('❌ Fout bij opslaan strategie.');
      setError('Fout bij opslaan strategie.');
    }
  };

  const isValid = isFormValid();

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow-md max-w-md"
    >
      <h2 className="text-lg font-bold mb-2">💰 Nieuwe DCA-strategie</h2>

      <div>
        <label className="block mb-1 font-medium">🧩 Koppel aan Setup</label>
        <select
          name="setup_id"
          value={form.setup_id}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
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
      </div>

      <div>
        <label className="block mb-1 font-medium">📈 Asset (automatisch)</label>
        <input
          name="asset"
          value={form.asset}
          readOnly
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">⏱️ Timeframe (automatisch)</label>
        <input
          name="timeframe"
          value={form.timeframe}
          readOnly
          className="w-full border px-3 py-2 rounded bg-gray-100"
        />
      </div>

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

      <div>
        <label className="block mb-1 font-medium">⏰ Frequentie</label>
        <select
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="" disabled>
            Kies frequentie...
          </option>
          <option value="weekly">Wekelijks</option>
          <option value="monthly">Maandelijks</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">📋 Koopregels (optioneel)</label>
        <textarea
          name="rules"
          value={form.rules}
          onChange={handleChange}
          rows="3"
          placeholder="Bijv. koop alleen bij Fear & Greed < 30"
          className="w-full border px-3 py-2 rounded resize-none"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

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