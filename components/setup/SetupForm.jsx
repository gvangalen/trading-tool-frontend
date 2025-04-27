'use client';

import { useState } from 'react';

export default function SetupForm({ onSubmitted }) {
  const [form, setForm] = useState({
    name: '',
    indicators: '',
    trend: '',
    timeframe: '4hr',
    account_type: '',
    strategy_type: '',
    symbol: '',
    min_investment: '',
    dynamic: false,
    tags: '',
    favorite: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const validationErrors = {};
    if (!form.name || form.name.length < 3) validationErrors.name = true;
    if (!form.indicators) validationErrors.indicators = true;
    if (!form.trend) validationErrors.trend = true;
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/setups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Network error');

      setForm({
        name: '',
        indicators: '',
        trend: '',
        timeframe: '4hr',
        account_type: '',
        strategy_type: '',
        symbol: '',
        min_investment: '',
        dynamic: false,
        tags: '',
        favorite: false,
      });
      setErrors({});
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error('❌ Setup save failed:', err);
      alert('❌ Fout bij opslaan setup.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white shadow-sm">
      <h3 className="text-lg font-semibold">➕ Add New Setup</h3>

      {/* 🔹 Basisvelden */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Name*"
          value={form.name}
          onChange={handleChange}
          className={`border p-2 rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        <input
          name="indicators"
          placeholder="Indicators*"
          value={form.indicators}
          onChange={handleChange}
          className={`border p-2 rounded ${errors.indicators ? 'border-red-500' : ''}`}
        />
        <select
          name="trend"
          value={form.trend}
          onChange={handleChange}
          className={`border p-2 rounded ${errors.trend ? 'border-red-500' : ''}`}
        >
          <option value="">Select trend*</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutral</option>
        </select>
        <select
          name="timeframe"
          value={form.timeframe}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="15m">15m</option>
          <option value="1h">1H</option>
          <option value="4hr">4H</option>
          <option value="1d">1D</option>
          <option value="1w">1W</option>
        </select>
        <input
          name="symbol"
          placeholder="Symbol (BTC, SOL...)"
          value={form.symbol}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="strategy_type"
          placeholder="Strategy type"
          value={form.strategy_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="account_type"
          placeholder="Account type"
          value={form.account_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="min_investment"
          type="number"
          step="0.01"
          placeholder="Min. investment (€)"
          value={form.min_investment}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      {/* 🔹 Checkboxes */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="dynamic" checked={form.dynamic} onChange={handleChange} />
          💡 Dynamic
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="favorite" checked={form.favorite} onChange={handleChange} />
          ⭐ Favorite
        </label>
      </div>

      {/* 🔹 Tags */}
      <textarea
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* 🔹 Live Preview */}
      <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border">
        <strong>📋 Live Preview:</strong><br />
        <strong>Name:</strong> {form.name || '-'}<br />
        <strong>Indicators:</strong> {form.indicators || '-'}<br />
        <strong>Trend:</strong> {form.trend || '-'}<br />
        <strong>Timeframe:</strong> {form.timeframe || '-'}<br />
        <strong>Symbol:</strong> {form.symbol || '-'}<br />
        <strong>Strategy:</strong> {form.strategy_type || '-'}
      </div>

      {/* 🔹 Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {submitting ? '⏳ Saving...' : '💾 Save Setup'}
      </button>
    </form>
  );
}
