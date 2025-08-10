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

  useEffect(() => {
    loadSetups();
  }, [loadSetups]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validatie
    if (!form.setup_id) {
      setError('⚠️ Je moet een setup kiezen.');
      return;
    }

    const selectedSetup = setups.find((s) => String(s.id) === String(form.setup_id));
    if (!selectedSetup) {
      setError('⚠️ Ongeldige setup geselecteerd.');
      return;
    }

    const entry = parseFloat(form.entry);
    const target = parseFloat(form.target);
    const stop_loss = parseFloat(form.stop_loss);

    if (isNaN(entry) || isNaN(target) || isNaN(stop_loss)) {
      setError('⚠️ Vul geldige numerieke waarden in voor entry, target en stop-loss.');
      return;
    }

    const strategy = {
      setup_id: selectedSetup.id,
      setup_name: selectedSetup.name,
      asset: selectedSetup.symbol,
      timeframe: selectedSetup.timeframe,
      strategy_type: 'manual',
      entry,
      targets: [target],
      stop_loss,
      explanation: form.explanation.trim(),
      origin: 'Handmatig',
    };

    console.log('📤 Strategie verstuurd naar parent:', strategy);
    onSubmit(strategy);
    setSuccess(true);
    // Reset form na succesvol submitten
    setForm({
      setup_id: '',
      entry: '',
      target: '',
      stop_loss: '',
      explanation: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow"
    >
      <div>
        <label className="block text-sm font-medium mb-1">🔗 Koppel aan Setup</label>
        <select
          name="setup_id"
          className="w-full border p-2 rounded"
          value={form.setup_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            -- Kies een setup --
          </option>
          {setups.length === 0 && (
            <option disabled>⚠️ Geen setups beschikbaar</option>
          )}
          {setups
            .filter((s) => s && s.id && s.name)
            .map((setup) => (
              <option key={setup.id} value={setup.id}>
                {setup.name} ({setup.symbol} – {setup.timeframe})
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">🎯 Entry prijs (€)</label>
        <input
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
        <label className="block text-sm font-medium mb-1">📈 Target prijs (€)</label>
        <input
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
        <label className="block text-sm font-medium mb-1">🛑 Stop-loss (€)</label>
        <input
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
        <label className="block text-sm font-medium mb-1">📝 Uitleg / notities</label>
        <textarea
          name="explanation"
          placeholder="Waarom deze trade?"
          className="w-full border p-2 rounded"
          rows={3}
          value={form.explanation}
          onChange={handleChange}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {success && (
        <p className="text-green-600 text-sm">✅ Strategie succesvol toegevoegd!</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        💾 Strategie opslaan
      </button>
    </form>
  );
}