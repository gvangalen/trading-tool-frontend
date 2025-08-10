'use client';

import { useState } from 'react';
import { createStrategy } from '@/lib/api/strategy';
import { useStrategyData } from '@/hooks/useStrategyData';
import { useSetupData } from '@/hooks/useSetupData';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function StrategyForm() {
  const { loadStrategies } = useStrategyData();
  const { setups } = useSetupData();

  const [form, setForm] = useState({
    setup_id: '',
    setup_name: '',
    asset: '',
    timeframe: '',
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

    console.log(`📝 Field changed: ${name} = ${type === 'checkbox' ? checked : value}`);

    if (name === 'setup_id') {
      const selected = setups.find((s) => String(s.id) === String(value));
      if (!selected) {
        setError('❌ Ongeldige setup geselecteerd.');
        console.warn(`❌ Ongeldige setup_id geselecteerd: ${value}`);
        return;
      }

      setForm((prev) => ({
        ...prev,
        setup_id: value,
        setup_name: selected.name || '',
        asset: selected.symbol || '',
        timeframe: selected.timeframe || '',
      }));
      setError('');
      console.log(`✅ Setup geselecteerd: ${selected.name} (${selected.symbol})`);
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    console.log('🚀 Submit gestart met formulier:', form);

    const requiredFields = ['setup_id', 'setup_name', 'asset', 'timeframe', 'entry', 'target', 'stop_loss'];
    for (const field of requiredFields) {
      if (!form[field]) {
        const msg = `❌ Veld "${field}" is verplicht.`;
        console.warn(msg);
        setError(msg);
        return;
      }
    }

    const entry = parseFloat(form.entry);
    const target = parseFloat(form.target);
    const stop_loss = parseFloat(form.stop_loss);

    if (isNaN(entry) || isNaN(target) || isNaN(stop_loss)) {
      const msg = '❌ Entry, target en stop-loss moeten geldige getallen zijn.';
      console.warn(msg);
      setError(msg);
      return;
    }

    const payload = {
      setup_id: form.setup_id,
      setup_name: form.setup_name,
      asset: form.asset,
      timeframe: form.timeframe,
      explanation: form.explanation?.trim() || '',
      entry,
      targets: [target],
      stop_loss,
      favorite: form.favorite,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      origin: 'Handmatig',
    };

    console.log('🚀 Payload naar backend:', payload);

    setLoading(true);
    try {
      await createStrategy(payload);
      console.log('✅ Strategie succesvol opgeslagen.');
      setForm({
        setup_id: '',
        setup_name: '',
        asset: '',
        timeframe: '',
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
      console.error('❌ Strategie maken mislukt:', err);
      setError('Fout bij opslaan strategie.');
    } finally {
      setLoading(false);
      console.log('⏳ Submit afgehandeld, loading uit.');
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
          Koppel aan Setup <InfoTooltip text="Je kunt alleen kiezen uit bestaande setups." />
        </label>
        <select
          name="setup_id"
          value={form.setup_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Asset</label>
            <input value={form.asset} readOnly className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div>
            <label className="block font-medium">Timeframe</label>
            <input value={form.timeframe} readOnly className="w-full border p-2 rounded bg-gray-100" />
          </div>
        </div>

        <label className="block font-medium">Entry prijs (€)</label>
        <input name="entry" type="number" step="any" value={form.entry} onChange={handleChange} className="w-full border p-2 rounded" required />

        <label className="block font-medium">Target prijs (€)</label>
        <input name="target" type="number" step="any" value={form.target} onChange={handleChange} className="w-full border p-2 rounded" required />

        <label className="block font-medium">Stop-loss (€)</label>
        <input name="stop_loss" type="number" step="any" value={form.stop_loss} onChange={handleChange} className="w-full border p-2 rounded" required />

        <label className="block font-medium">Uitleg</label>
        <textarea name="explanation" value={form.explanation} onChange={handleChange} rows="3" className="w-full border p-2 rounded" />

        <label className="block font-medium">Tags (gescheiden door komma's)</label>
        <input name="tags" type="text" value={form.tags} onChange={handleChange} className="w-full border p-2 rounded" />

        <label className="inline-flex items-center space-x-2">
          <input type="checkbox" name="favorite" checked={form.favorite} onChange={handleChange} className="w-4 h-4" />
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