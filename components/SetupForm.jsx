'use client';
import { useState } from 'react';

export default function SetupForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: '', indicators: '', trend: '', timeframe: '4hr',
    account_type: '', strategy_type: '', symbol: '',
    min_investment: '', dynamic: false, tags: '', favorite: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 3) e.name = true;
    if (!form.indicators) e.indicators = true;
    if (!form.trend) e.trend = true;
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) return setErrors(valErrors);

    setSubmitting(true);
    try {
      await fetch('/api/setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ name: '', indicators: '', trend: '', timeframe: '4hr', account_type: '', strategy_type: '', symbol: '', min_investment: '', dynamic: false, tags: '', favorite: false });
      setErrors({});
      if (onSubmitted) onSubmitted();
    } catch (err) {
      alert("❌ Setup opslaan mislukt.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white shadow-sm">
      <h3 className="text-lg font-semibold">➕ Nieuwe Setup</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" placeholder="Naam*" value={form.name} onChange={handleChange} className={`border p-2 rounded ${errors.name ? 'border-red-500' : ''}`} />
        <input name="indicators" placeholder="Indicatoren*" value={form.indicators} onChange={handleChange} className={`border p-2 rounded ${errors.indicators ? 'border-red-500' : ''}`} />
        <select name="trend" value={form.trend} onChange={handleChange} className={`border p-2 rounded ${errors.trend ? 'border-red-500' : ''}`}>
          <option value="">Kies trend*</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutraal</option>
        </select>
        <select name="timeframe" value={form.timeframe} onChange={handleChange} className="border p-2 rounded">
          <option value="15m">15m</option>
          <option value="1h">1H</option>
          <option value="4hr">4H</option>
          <option value="1d">1D</option>
          <option value="1w">1W</option>
        </select>
        <input name="symbol" placeholder="Symbool (BTC, SOL...)" value={form.symbol} onChange={handleChange} className="border p-2 rounded" />
        <input name="strategy_type" placeholder="Strategie-type" value={form.strategy_type} onChange={handleChange} className="border p-2 rounded" />
        <input name="account_type" placeholder="Account-type" value={form.account_type} onChange={handleChange} className="border p-2 rounded" />
        <input name="min_investment" type="number" step="0.01" placeholder="Min. investering (€)" value={form.min_investment} onChange={handleChange} className="border p-2 rounded" />
      </div>

      <div className="flex items-center gap-4">
        <label><input type="checkbox" name="dynamic" checked={form.dynamic} onChange={handleChange} /> 💡 Dynamisch</label>
        <label><input type="checkbox" name="favorite" checked={form.favorite} onChange={handleChange} /> ⭐ Favoriet</label>
      </div>

      <textarea name="tags" placeholder="Tags (komma-gescheiden)" value={form.tags} onChange={handleChange} className="w-full border p-2 rounded" />

      {/* ✅ Live preview */}
      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border">
        <strong>📋 Live Preview:</strong><br />
        <strong>Naam:</strong> {form.name || '-'}<br />
        <strong>Indicatoren:</strong> {form.indicators || '-'}<br />
        <strong>Trend:</strong> {form.trend || '-'}<br />
        <strong>Timeframe:</strong> {form.timeframe || '-'}<br />
        <strong>Symbool:</strong> {form.symbol || '-'}<br />
        <strong>Strategie:</strong> {form.strategy_type || '-'}
      </div>

      <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {submitting ? '⏳ Bezig...' : '💾 Opslaan'}
      </button>
    </form>
  );
}
