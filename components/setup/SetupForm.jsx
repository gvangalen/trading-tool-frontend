'use client';

import { useState, useRef } from 'react';
import { addSetup, checkSetupNameExists } from '@/lib/setupService';
import { useSetupData } from '@/hooks/useSetupData';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function SetupForm() {
  const { loadSetups } = useSetupData();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    symbol: '',
    indicators: '',
    trend: '',
    timeframe: '',  
    score_logic: '',
    account_type: '',
    strategy_type: '',
    min_investment: '',
    tags: '',
    dynamic: false,
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
    if (!form.name || form.name.trim().length < 3) valErrors.name = true;
    if (!form.symbol || form.symbol.trim().length < 1) valErrors.symbol = true;
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
      const exists = await checkSetupNameExists(form.name.trim());
      if (exists) {
        setErrors({ name: true });
        formRef.current.scrollIntoView({ behavior: 'smooth' });
        setSubmitting(false);
        return;
      }

      const payload = {
        ...form,
        name: form.name.trim(),
        symbol: form.symbol.trim(),
        indicators: form.indicators.trim(),
        trend: form.trend,
        timeframe: form.timeframe, 
        score_logic: form.score_logic?.trim() || '',
        account_type: form.account_type?.trim(),
        strategy_type: form.strategy_type?.trim(),
        min_investment: form.min_investment ? parseFloat(form.min_investment) : null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0) : [],
      };

      await addSetup(payload);
      setSuccess(true);
      setForm({
        name: '',
        symbol: '',
        indicators: '',
        trend: '',
        timeframe: '',  
        score_logic: '',
        account_type: '',
        strategy_type: '',
        min_investment: '',
        tags: '',
        dynamic: false,
        favorite: false,
      });
      loadSetups();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('❌ Setup toevoegen mislukt:', err);
      alert('Fout bij opslaan setup. Controleer je invoer.');
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled =
    !form.name ||
    !form.symbol ||
    !form.indicators ||
    !form.trend ||
    submitting;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded bg-white shadow-sm"
    >
      <h3 className="text-lg font-semibold">➕ Nieuwe Setup</h3>

      {success && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-3 py-2 rounded">
          ✅ Setup succesvol toegevoegd!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium flex items-center">
            Naam* <InfoTooltip text="Unieke naam per symbool vereist." />
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Bijv. Swing Breakout"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">
              {form.name?.trim().length < 3 ? 'Naam is verplicht (min. 3 tekens)' : 'Deze naam bestaat al'}
            </p>
          )}
        </div>

        <div>
          <label className="font-medium flex items-center">
            Symbool* <InfoTooltip text="Bijv. BTC, SOL, AAPL" />
          </label>
          <input
            name="symbol"
            value={form.symbol}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.symbol ? 'border-red-500' : ''}`}
            placeholder="Bijv. BTC"
          />
          {errors.symbol && <p className="text-red-600 text-sm mt-1">Symbool is verplicht</p>}
        </div>

        <div>
          <label className="font-medium flex items-center">
            Indicatoren* <InfoTooltip text="Bijv. RSI, volume spike" />
          </label>
          <input
            name="indicators"
            value={form.indicators}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.indicators ? 'border-red-500' : ''}`}
            placeholder="Bijv. RSI, MACD, Volume"
          />
          {errors.indicators && <p className="text-red-600 text-sm mt-1">Veld is verplicht</p>}
        </div>

        <div className="form-group">
  <label htmlFor="timeframe">Timeframe*</label>
  <select
    id="timeframe"
    name="timeframe"
    className="form-control"
    value={formData.timeframe || ''}
    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
    required
  >
    <option value="">Kies een timeframe</option>
    <option value="15m">15 minuten</option>
    <option value="1H">1 uur</option>
    <option value="4H">4 uur</option>
    <option value="1D">1 dag</option>
    <option value="1W">1 week</option>
  </select>
</div>

        <div>
          <label className="font-medium flex items-center">
            Trend* <InfoTooltip text="Bullish, Bearish of Neutraal?" />
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
          {errors.trend && <p className="text-red-600 text-sm mt-1">Trend is verplicht</p>}
        </div>

        <input name="account_type" value={form.account_type} onChange={handleChange} className="border p-2 rounded" placeholder="Account type (optioneel)" />
        <input name="strategy_type" value={form.strategy_type} onChange={handleChange} className="border p-2 rounded" placeholder="Strategie type (optioneel)" />
        <input name="min_investment" value={form.min_investment} onChange={handleChange} className="border p-2 rounded" placeholder="Minimale investering (optioneel)" />
        <input name="tags" value={form.tags} onChange={handleChange} className="border p-2 rounded" placeholder="Tags (komma-gescheiden)" />

        <textarea
          name="score_logic"
          value={form.score_logic}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
          placeholder="Score logica (optioneel)"
        />

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="dynamic" checked={form.dynamic} onChange={handleChange} className="w-4 h-4" />
          <span>Dynamische investering</span>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" name="favorite" checked={form.favorite} onChange={handleChange} className="w-4 h-4" />
          <span>Favoriet</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {submitting ? 'Bezig met opslaan...' : 'Setup toevoegen'}
      </button>
    </form>
  );
}
