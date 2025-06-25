'use client';

import { useState } from 'react';
import { createStrategy } from '@/lib/api/strategy';
import { useStrategyData } from '@/hooks/useStrategyData';
import { useSetupData } from '@/hooks/useSetupData';

export default function StrategyForm() {
  const { strategies, loadStrategies } = useStrategyData();
  const { setups } = useSetupData();

  const [form, setForm] = useState({
    setup_name: '',
    explanation: '',
    entry: '',
    target: '',
    stop_loss: '',
    favorite: false,
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.setup_name) {
      setError('Je moet een bestaande setup kiezen.');
      return;
    }
    if (!form.entry || !form.target || !form.stop_loss) {
      setError('Entry, target en stop-loss zijn verplicht.');
      return;
    }

    setLoading(true);

    const payload = {
      setup_name: form.setup_name,
      explanation: form.explanation,
      entry: form.entry,
      target: form.target,
      stop_loss: form.stop_loss,
      favorite: form.favorite,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== ''),
      asset: 'BTC',
      timeframe: '1D',
      origin: 'Handmatig',
    };

    try {
      await createStrategy(payload);
      setForm({
        setup_name: '',
        explanation: '',
        entry: '',
        target: '',
        stop_loss: '',
        favorite: false,
        tags: '',
      });
      await loadStrategies();
      setSuccess(true);
    } catch (err) {
      console.error('Strategie maken mislukt:', err);
      setError('Fout bij opslaan strategie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-lg font-bold">➕ Nieuwe Strategie</h2>

      {success && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-3 py-2 rounded">
          ✅ Strategie succesvol opgeslagen!
        </div>
      )}

      <div className="space-y-2">
        <label className="block font-medium">
          Koppel aan Setup <span title="Je kunt alleen kiezen uit bestaande setups.">❓</span>
        </label>
        <select
          name="setup_name"
          value={form.setup_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">-- Kies een setup --</option>
          {setups.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>

        <label className="block font-medium">
          Entry prijs (€) <span title="Het niveau waarop je instapt.">❓</span>
        </label>
        <input
          name="entry"
          type="number"
          value={form.entry}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <label className="block font-medium">
          Target prijs (€) <span title="Het winstdoel voor deze trade.">❓</span>
        </label>
        <input
          name="target"
          type="number"
          value={form.target}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <label className="block font-medium">
          Stop-loss (€) <span title="Het niveau waarop je uitstapt bij verlies.">❓</span>
        </label>
        <input
          name="stop_loss"
          type="number"
          value={form.stop_loss}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <label className="block font-medium">Uitleg <span title="Leg uit waarom deze strategie werkt.">❓</span></label>
        <textarea
          name="explanation"
          value={form.explanation}
          onChange={handleChange}
          rows="3"
          className="w-full border p-2 rounded"
        />

        <label className="block font-medium">Tags (komma-gescheiden)</label>
        <input
          name="tags"
          type="text"
          value={form.tags}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            name="favorite"
            checked={form.favorite}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Favoriet</span>
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? '⏳ Opslaan...' : '💾 Strategie opslaan'}
        </button>
      </div>
    </form>
  );
}
