'use client';

import { useState, useRef } from 'react';
import { useSetupData, checkSetupNameExists } from '@/hooks/useSetupData';
import InfoTooltip from '@/components/common/InfoTooltip';

export default function SetupForm({ onSubmitted }) {
  const formRef = useRef(null);
  const { addSetup } = useSetupData();
  const [form, setForm] = useState({
    name: '',
    indicators: '',
    trend: '',
    timeframe: '4hr',
    symbol: '',
    dynamic: false,
    score_type: 'macro_score',
    score_logic: '',
    account_type: '',
    strategy_type: '',
    min_investment: '',
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
      const nameExists = await checkSetupNameExists(form.name);
      if (nameExists) {
        setErrors({ name: true });
        alert('❌ Deze setup-naam bestaat al. Kies een andere naam.');
        setSubmitting(false);
        return;
      }

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
      symbol: '',
      dynamic: false,
      score_type: 'macro_score',
      score_logic: '',
      account_type: '',
      strategy_type: '',
      min_investment: '',
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
        <div>
          <label className="font-medium flex items-center">
            Naam*
            <InfoTooltip text="De naam van je setup, bijvoorbeeld 'Oversold RSI + Volume spike'" />
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.name ? 'border-red-500' : ''}`}
          />
        </div>

        <div>
          <label className="font-medium flex items-center">
            Indicatoren*
            <InfoTooltip text="Bijv. RSI, volume, structuur - gescheiden door komma's." />
          </label>
          <input
            name="indicators"
            value={form.indicators}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.indicators ? 'border-red-500' : ''}`}
          />
        </div>

        <div>
          <label className="font-medium flex items-center">
            Trend*
            <InfoTooltip text="Welke trend hoort bij deze setup: bullish, bearish of neutraal?" />
          </label>
          <select
            name="trend"
            value={form.trend}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.trend ? 'border-red-500' : ''}`}
          >
            <option value="">Kies trend</option>
            <option value="bullish">📈 Bullish</option>
            <option value="bearish">📉 Bearish</option>
            <option value="neutral">⚖️ Neutraal</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Timeframe</label>
          <select
            name="timeframe"
            value={form.timeframe}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="15m">15 minuten</option>
            <option value="1h">1 uur</option>
            <option value="4hr">4 uur</option>
            <option value="1d">1 dag</option>
            <option value="1w">1 week</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Scoretype</label>
          <select
            name="score_type"
            value={form.score_type}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="macro_score">Macro score</option>
            <option value="technical_score">Technische score</option>
            <option value="ai_score">AI-score</option>
            <option value="combined">Gecombineerd</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Scorelogica (optioneel)</label>
          <textarea
            name="score_logic"
            rows={2}
            value={form.score_logic}
            onChange={handleChange}
            placeholder='Bijv: { "macro": ">70", "rsi": "<30" }'
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Geavanceerd gedeelte */}
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
          <InfoTooltip text="Als deze optie aan staat, wordt de investering automatisch aangepast aan de score." />
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
