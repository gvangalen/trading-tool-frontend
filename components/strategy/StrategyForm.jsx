'use client';

import { useState } from 'react';
import { createStrategy } from '@/lib/api/strategy';
import { useStrategyData } from '@/hooks/useStrategyData';

export default function StrategyForm() {
  const { loadStrategies } = useStrategyData();
  const [setupName, setSetupName] = useState('');
  const [tags, setTags] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!setupName.trim()) {
      setError('Strategienaam is verplicht.');
      setLoading(false);
      return;
    }

    const payload = {
      setup_name: setupName.trim(),
      asset: 'BTC',
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
      setSetupName('');
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
        <label className="block mb-1 font-medium">Strategie naam</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={setupName}
          onChange={(e) => setSetupName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Tags (komma-gescheiden)</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="bijv. breakout, swing, btc"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Uitleg</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Leg uit waarom deze strategie werkt..."
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
