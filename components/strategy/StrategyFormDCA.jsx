'use client';

import React, { useState } from 'react';

export default function StrategyFormDCA({ onSubmit }) {
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const amountRaw = e.target.amount.value?.trim();
    const frequency = e.target.frequency.value?.trim();
    const rules = e.target.rules.value?.trim() || '';

    console.log('🧾 DCA Formulier ingestuurd:', { amountRaw, frequency, rules });

    // ✅ Bedrag validatie
    const amount = Number(amountRaw);
    if (!amountRaw || isNaN(amount) || amount <= 0) {
      console.warn('❌ Ongeldig bedrag ingevuld:', amountRaw);
      setError('❌ Voer een geldig bedrag in (bijv. 100).');
      return;
    }

    // ✅ Frequentie validatie
    if (!frequency) {
      console.warn('❌ Geen frequentie geselecteerd');
      setError('❌ Selecteer een koopfrequentie.');
      return;
    }

    const strategy = {
      strategy_type: 'dca',
      amount,
      frequency,
      rules,
      origin: 'DCA',
    };

    console.log('📤 DCA-strategie wordt verstuurd naar parent component:', strategy);
    onSubmit(strategy);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded shadow-md max-w-md">
      <h2 className="text-lg font-bold mb-2">💰 Nieuwe DCA-strategie</h2>

      <div>
        <label className="block mb-1 font-medium">💶 Bedrag per keer</label>
        <input
          name="amount"
          type="number"
          min="0"
          step="1"
          placeholder="Bijv. 100"
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">⏰ Frequentie</label>
        <select
          name="frequency"
          className="w-full border px-3 py-2 rounded"
          defaultValue=""
          required
        >
          <option value="" disabled>Kies frequentie...</option>
          <option value="weekly">Wekelijks</option>
          <option value="monthly">Maandelijks</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">📋 Koopregels (optioneel)</label>
        <textarea
          name="rules"
          rows="3"
          placeholder="Bijv. koop alleen bij Fear & Greed < 30"
          className="w-full border px-3 py-2 rounded resize-none"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        💾 DCA-strategie opslaan
      </button>
    </form>
  );
}
