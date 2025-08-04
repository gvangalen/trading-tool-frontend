'use client';

import { useState, useEffect } from 'react';
import { fetchSetups } from '@/lib/api/setups';

export default function StrategyFormManual({ onSubmit }) {
  const [setups, setSetups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSetups = async () => {
      try {
        const data = await fetchSetups();
        setSetups(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Setup ophalen mislukt:', err);
        setSetups([]);
      }
    };
    loadSetups();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const selectedId = e.target.setup_id.value;
    const selectedSetup = setups.find((s) => String(s.id) === String(selectedId));

    if (!selectedSetup) {
      console.warn('❌ Setup niet gevonden voor ID:', selectedId);
      setError('⚠️ Je moet een geldige setup selecteren.');
      return;
    }

    const strategy = {
      setup_id: selectedSetup.id,
      setup_name: selectedSetup.name,
      asset: selectedSetup.symbol,
      timeframe: selectedSetup.timeframe,
      strategy_type: 'manual',
      entry: parseFloat(e.target.entry.value),
      target: parseFloat(e.target.target.value),
      stop_loss: parseFloat(e.target.stop_loss.value),
      explanation: e.target.explanation.value,
    };

    onSubmit(strategy);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Koppel aan Setup</label>
        <select name="setup_id" className="input w-full border p-2 rounded" required>
          <option value="">-- Kies een setup --</option>
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entry prijs (€)</label>
        <input name="entry" type="number" step="any" placeholder="Bijv. 27000" className="input w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target prijs (€)</label>
        <input name="target" type="number" step="any" placeholder="Bijv. 31000" className="input w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stop-loss (€)</label>
        <input name="stop_loss" type="number" step="any" placeholder="Bijv. 25000" className="input w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Uitleg / notities</label>
        <textarea name="explanation" placeholder="Waarom deze trade?" className="input w-full border p-2 rounded" rows="3" />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" className="btn-primary bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        💾 Strategie opslaan
      </button>
    </form>
  );
}
