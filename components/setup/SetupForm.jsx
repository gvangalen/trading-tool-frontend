'use client';

import { useState } from 'react';
import { useSetupData } from '@/hooks/useSetupData'; // 🔥 nieuw

export default function SetupForm() {
  const { addSetup } = useSetupData(); // ✅ ophalen uit hook
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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function validate() {
    const valErrors = {};
    if (!form.name || form.name.length < 3) valErrors.name = true;
    if (!form.indicators) valErrors.indicators = true;
    if (!form.trend) valErrors.trend = true;
    return valErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    setSubmitting(true);
    try {
      await addSetup(form); // 🔥 via useSetupData
      resetForm();
    } catch (err) {
      console.error('❌ Setup toevoegen mislukt:', err);
      alert('Fout bij opslaan setup.');
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white shadow-sm">
      <h3 className="text-lg font-semibold">➕ Nieuwe Setup</h3>

      {/* 🔹 Basisvelden */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <input
          name="name"
          placeholder="Name*"
          value={form.name}
          onChange={handleChange}
          className={`border p-2 rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        {/* Indicators */}
        <input
          name="indicators"
          placeholder="Indicators*"
          value={form.indicators}
          onChange={handleChange}
          className={`border p-2 rounded ${errors.indicators ? 'border-red-500' : ''}`}
        />
        {/* Trend */}
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
        {/* Timeframe */}
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
        {/* Symbol */}
        <input
          name="symbol"
          placeholder="Symbol (BTC, SOL...)"
          value={form.symbol}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {/* Strategy Type */}
        <input
          name="strategy_type"
          placeholder="Strategy Type"
          value={form.strategy_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {/* Account Type */}
        <input
          name="account_type"
          placeholder="Account Type"
          value={form.account_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {/* Minimum Investment */}
        <input
          name="min_investment"
          type="number"
          step="0.01"
          placeholder="Min. Investment (€)"
          value={form.min_investment}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      {/* 🔹 Checkboxes */}
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="dynamic" checked={form.dynamic} onChange={handleChange} />
          🔄 Dynamic
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
      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
        <strong>📋 Live Preview:</strong><br />
        <strong>Name:</strong> {form.name || '-'}<br />
        <strong>Indicators:</strong> {form.indicators || '-'}<br />
        <strong>Trend:</strong> {form.trend || '-'}<br />
        <strong>Timeframe:</strong> {form.timeframe || '-'}<br />
        <strong>Symbol:</strong> {form.symbol || '-'}<br />
        <strong>Strategy:</strong> {form.strategy_type || '-'}
      </div>

      {/* 🔹 Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
      >
        {submitting ? '⏳ Opslaan...' : '💾 Setup Opslaan'}
      </button>
    </form>
  );
}
