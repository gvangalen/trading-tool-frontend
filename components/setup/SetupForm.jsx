'use client';

import { useState, useRef } from 'react';
import { useSetupData } from '@/hooks/useSetupData';

export default function SetupForm({ onSubmitted }) {
  const formRef = useRef(null);
  const { addSetup } = useSetupData();
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
  const [success, setSuccess] = useState(false);

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
      formRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      await addSetup(form);
      resetForm();
      setSuccess(true);
      if (onSubmitted) onSubmitted();
      formRef.current.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 3000);
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

  const isDisabled = !form.name || !form.indicators || !form.trend;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded bg-white shadow-sm"
    >
      <h3 className="text-lg font-semibold">➕ Nieuwe Setup</h3>

      {success && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-3 py-2 rounded">
          ✅ Setup succesvol opgeslagen!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Naam van de setup*"
          value={form.name}
          onChange={handleChange}
          className={`border p-2 rounded ${errors.name ? 'border-red-500' : ''}`}
        />
        <input
          name="indicators"
          placeholder="Indicatoren* (bijv. RSI, MA)"
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
          <option value="">Trend*</option>
          <option value="bullish">📈 Bullish</option>
          <option value="bearish">📉 Bearish</option>
          <option value="neutral">⚖️ Neutraal</option>
        </select>
        <select
          name="timeframe"
          value={form.timeframe}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="15m">15 minuten</option>
          <option value="1h">1 uur</option>
          <option value="4hr">4 uur</option>
          <option value="1d">1 dag</option>
          <option value="1w">1 week</option>
        </select>
        <input
          name="symbol"
          placeholder="Symbool (BTC, SOL...)"
          value={form.symbol}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="account_type"
          placeholder="Account type (Spot, Futures...)"
          value={form.account_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="strategy_type"
          placeholder="Strategietype (Breakout, Swing...)"
          value={form.strategy_type}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="min_investment"
          placeholder="Minimale investering (€)"
          value={form.min_investment}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="tags"
          placeholder="Tags (gescheiden door komma's)"
          value={form.tags}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="dynamic"
            checked={form.dynamic}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Dynamische investering</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="favorite"
            checked={form.favorite}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span>Favoriet</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isDisabled || submitting}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
          isDisabled || submitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {submitting ? 'Bezig met opslaan...' : 'Setup opslaan'}
      </button>
    </form>
  );
}
