'use client';

import { useState } from 'react';
import { createStrategy } from '@/lib/api/strategy';
import { useStrategyData } from '@/hooks/useStrategyData';
import { useSetupData } from '@/hooks/useSetupData';
import InfoTooltip from '@/components/InfoTooltip';

export default function StrategyForm() {
  const { loadStrategies } = useStrategyData();
  const { setups } = useSetupData();

  const [selectedSetup, setSelectedSetup] = useState('');
  const [tags, setTags] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedSetup.trim()) {
      setError('Kies een geldige setup.');
      setLoading(false);
      return;
    }

    const payload = {
      setup_name: selectedSetup,
      asset: 'BTC', // eventueel dynamisch in latere versie
      timeframe: '1D',
      explanation: explanation.trim(),
      favorite: false,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ''),
      origin: 'Handmatig',
    };

    try {
      await createStrategy(payload);
      setSelectedSetup('');
      setTags('');
      setExplanation('');
      await loadStrategies();
      alert('✅ Strategie succesvol toegevoegd!');
    } catch (err) {
      console.error('❌ Strategie opslaan mislukt:', err);
      setError('Fout bij opslaan strategie.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-lg font-bold">➕ Nieuwe Strategie</h2>

      <div>
        <label className="block mb-1 font-medium">
          Setup-naam
          <InfoTooltip text="Kies een bestaande setup waarvoor deze strategie bedoeld is." />
        </label>
        <select
          className="w-full border p-2 rounded"
          value={selectedSetup}
          onChange={(e) => setSelectedSetup(e.target.value)}
          required
        >
          <option value="">-- Kies een setup --</option>
          {setups.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Tags <InfoTooltip text="Voeg labels toe zoals breakout, trend, btc." />
        </label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="bijv. breakout, swing, btc"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Uitleg
          <InfoTooltip text="Leg kort uit waarom deze strategie werkt of opvalt." />
        </label>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Waarom werkt deze strategie? Wat maakt het sterk?"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        disabled={loading}
      >
        {loading ? '⏳ Opslaan...' : '💾 Strategie opslaan'}
      </button>
    </form>
  );
}
