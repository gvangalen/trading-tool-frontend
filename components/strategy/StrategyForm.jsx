'use client';

import { useState } from 'react';
import { createStrategy } from '@/lib/api/strategy'; // 🔥 Correcte import
import { useStrategyData } from '@/hooks/useStrategyData'; // 🔥 Correcte import

export default function StrategyForm() {
  const { loadStrategies } = useStrategyData(); // 🔥 Correcte hook functie
  const [setupName, setSetupName] = useState('');
  const [tags, setTags] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      setup_name: setupName.trim(),
      asset: 'BTC',
      timeframe: '1D',
      explanation: explanation.trim(),
      favorite: false,
      tags: tags.split(',').map(tag => tag.trim()),
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
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
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
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Uitleg</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
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
