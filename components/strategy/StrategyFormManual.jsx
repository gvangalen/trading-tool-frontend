'use client';

import { useState, useEffect } from 'react';
import { fetchSetups } from '@/lib/api/setups';

export default function StrategyFormManual({ onSubmit }) {
  const [setups, setSetups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSetups = async () => {
      console.log('📦 Setup ophalen gestart...');
      try {
        const data = await fetchSetups();
        console.log('✅ Setups opgehaald:', data);
        setSetups(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Fout bij ophalen van setups:', err);
        setSetups([]);
      }
    };
    loadSetups();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const selectedId = e.target.setup_id.value?.trim();
    console.log('🆔 Geselecteerde setup_id:', selectedId);

    if (!selectedId) {
      console.warn('⚠️ Geen setup geselecteerd');
      setError('⚠️ Je moet een setup kiezen.');
      return;
    }

    const selectedSetup = setups.find((s) => String(s.id) === String(selectedId));
    console.log('🔍 Gevonden setup:', selectedSetup);

    if (!selectedSetup) {
      console.warn('❌ Ongeldige setup geselecteerd:', selectedId);
      setError('⚠️ Ongeldige setup geselecteerd.');
      return;
    }

    const entry = parseFloat(e.target.entry.value);
    const target = parseFloat(e.target.target.value);
    const stop_loss = parseFloat(e.target.stop_loss.value);
    console.log('📊 Waarden ingevoerd → Entry:', entry, 'Target:', target, 'Stop-loss:', stop_loss);

    if (isNaN(entry) || isNaN(target) || isNaN(stop_loss)) {
      console.warn('⚠️ Ongeldige numerieke input');
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
      target,
      stop_loss,
      explanation: e.target.explanation.value.trim(),
    };

    console.log('📤 Strategie verstuurd naar parent:', strategy);
    onSubmit(strategy);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow">
      <div>
        <label className="block text-sm font-medium mb-1">🔗 Koppel aan Setup</label>
        <select name="setup_id" className="w-full border p-2 rounded" required defaultValue="">
          <option value="" disabled>-- Kies een setup --</option>
          {Array.isArray(setups) &&
            setups
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
        <input name="entry" type="number" step="any" placeholder="Bijv. 27000" className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">📈 Target prijs (€)</label>
        <input name="target" type="number" step="any" placeholder="Bijv. 31000" className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">🛑 Stop-loss (€)</label>
        <input name="stop_loss" type="number" step="any" placeholder="Bijv. 25000" className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">📝 Uitleg / notities</label>
        <textarea name="explanation" placeholder="Waarom deze trade?" className="w-full border p-2 rounded" rows="3" />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
        💾 Strategie opslaan
      </button>
    </form>
  );
}
