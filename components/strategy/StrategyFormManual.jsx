'use client';

import { useState, useEffect } from 'react';
import { useSetupData } from '@/hooks/useSetupData';

export default function StrategyFormManual({ onSubmit }) {
  const { setups, loadSetups } = useSetupData();

  const [form, setForm] = useState({
    setup_id: '',
    entry: '',
    target: '',
    stop_loss: '',
    explanation: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSetups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = ['explanation', 'setup_id'].includes(name)
      ? value.trimStart()
      : value;

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.setup_id) {
      setError('⚠️ Je moet een setup kiezen.');
      return;
    }

    const selectedSetup = setups.find(
      (s) => String(s.id) === String(form.setup_id)
    );
    if (!selectedSetup) {
      setError('⚠️ Ongeldige setup geselecteerd.');
      return;
    }

    const entry = parseFloat(form.entry);
    const target = parseFloat(form.target);
    const stop_loss = parseFloat(form.stop_loss);

    if (isNaN(entry) || isNaN(target) || isNaN(stop_loss)) {
      setError(
        '⚠️ Vul geldige numerieke waarden in voor entry, target en stop-loss.'
      );
      return;
    }

    const strategy = {
      setup_id: selectedSetup.id,
      setup_name: selectedSetup.name,
      symbol: selectedSetup.symbol,
      timeframe: selectedSetup.timeframe,
      strategy_type: 'manual',
      entry,
      targets: [target],
      stop_loss,
      explanation: form.explanation.trim(),
      origin: 'Handmatig',
    };

    console.log('📤 Strategie verstuurd naar parent:', strategy);
    setLoading(true);

    try {
      onSubmit(strategy);
      setSuccess(true);
      setForm({
        setup_id: '',
        entry: '',
        target: '',
        stop_loss: '',
        explanation: '',
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('❌ Fout bij submit:', err);
      setError('Er is iets misgegaan bij het opslaan.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSetups = setups.filter(
    (s) => s && s.id && s.name && !['manual', 'ai', 'dca'].includes(s.strategy_type)
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow"
      aria-live="polite"
    >
      <div>
        <label htmlFor="setup_id" className="block text-sm font-medium mb-1">
          🔗 Koppel aan Setup
        </label>
        <select
          id="setup_id"
          name="setup_id"
          className="w-full border p-2 rounded"
          value={form.setup_id}
          onChange={handleChange}
          required
          aria-describedby={error.includes('setup') ? 'error-setup_id' : undefined}
        >
          <option value="" disabled>
            -- Kies een setup --
          </option>

          {filteredSetups.map((setup) => (
            <option key={setup.id} value={setup.id}>
              {setup.name} ({setup.symbol} – {setup.timeframe})
            </option>
          ))}

          {filteredSetups.length === 0 && (
            <option disabled>⚠️ Geen geschikte setups beschikbaar</option>
          )}
        </select>

        {filteredSetups.length === 0 && (
          <p className="text-red-600 text-sm mt-2" role="alert">
            ⚠️ Geen geschikte setups beschikbaar om een strategie aan toe te voegen.
          </p>
        )}

        {error.includes('setup') && (
          <p id="error-setup_id" className="text-red-600 text-sm mt-1" role="alert">
            {error}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="entry" className="block text-sm font-medium mb-1">
          🎯 Entry prijs (€)
        </label>
        <input
          id="entry"
          name="entry"
          type="number"
          step="any"
          placeholder="Bijv. 27000"
          className="w-full border p-2 rounded"
          value={form.entry}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="target" className="block text-sm font-medium mb-1">
          📈 Target prijs (€)
        </label>
        <input
          id="target"
          name="target"
          type="number"
          step="any"
          placeholder="Bijv. 31000"
          className="w-full border p-2 rounded"
          value={form.target}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="stop_loss" className="block text-sm font-medium mb-1">
          🛑 Stop-loss (€)
        </label>
        <input
          id="stop_loss"
          name="stop_loss"
          type="number"
          step="any"
          placeholder="Bijv. 25000"
          className="w-full border p-2 rounded"
          value={form.stop_loss}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="explanation" className="block text-sm font-medium mb-1">
          📝 Uitleg / notities
        </label>
        <textarea
          id="explanation"
          name="explanation"
          placeholder="Waarom deze trade?"
          className="w-full border p-2 rounded"
          rows={3}
          value={form.explanation}
          onChange={handleChange}
        />
      </div>

      {error && !error.includes('setup') && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600 text-sm" role="alert">
          ✅ Strategie succesvol toegevoegd!
        </p>
      )}

      <button
        type="submit"
        disabled={loading || filteredSetups.length === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 w-full"
        aria-busy={loading}
      >
        {loading ? '⏳ Opslaan...' : '💾 Strategie opslaan'}
      </button>
    </form>
  );
}
