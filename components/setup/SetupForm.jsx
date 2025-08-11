'use client';

import { useState, useRef, useEffect } from 'react';
import { addSetup, checkSetupNameExists } from '@/lib/api/setups';
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

  // Optionele debug logging bij elke form update
  useEffect(() => {
    console.log('📝 Form state updated:', form);
  }, [form]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    console.log(`📝 Input changed: ${name} = ${val}`);
    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
  }

  function validate() {
    const valErrors = {};
    if (!form.name || form.name.trim().length < 3) valErrors.name = 'Naam is verplicht (min. 3 tekens)';
    if (!form.symbol || form.symbol.trim().length < 1) valErrors.symbol = 'Symbool is verplicht';
    if (!form.indicators || form.indicators.trim() === '') valErrors.indicators = 'Indicatoren zijn verplicht';
    if (!form.trend) valErrors.trend = 'Trend is verplicht';
    if (!form.strategy_type) valErrors.strategy_type = 'Strategie type is verplicht';
    if (form.min_investment && isNaN(Number(form.min_investment))) valErrors.min_investment = 'Minimale investering moet een getal zijn';

    console.log('🔍 Validatie fouten:', valErrors);
    return valErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('🚀 Submit gestart met data:', form);

    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      console.warn('❌ Validatie mislukt:', valErrors);
      setErrors(valErrors);
      formRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setErrors({});
    setSuccess(false);

    try {
      const exists = await checkSetupNameExists(form.name.trim());
      console.log(`🔎 Naamcontrole voor "${form.name.trim()}": ${exists ? 'Bestaat al' : 'Nieuw'}`);

      if (exists) {
        setErrors({ name: 'Deze naam bestaat al' });
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
        account_type: form.account_type?.trim() || null,
        strategy_type: form.strategy_type.trim(),
        min_investment: form.min_investment ? parseFloat(form.min_investment) : null,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
          : [],
      };

      console.log('🚀 Payload naar backend:', payload);
      await addSetup(payload);
      console.log('✅ Setup succesvol toegevoegd.');

      await loadSetups();

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

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('❌ Setup toevoegen mislukt:', err);
      alert('Fout bij opslaan setup. Controleer je invoer.');
    } finally {
      setSubmitting(false);
      console.log('⏳ Submit afgehandeld, submitting=false');
    }
  }

  // Disabled als verplichte velden leeg zijn of formulier bezig is met verzenden
  const isDisabled =
    !form.name ||
    !form.symbol ||
    !form.indicators ||
    !form.trend ||
    !form.strategy_type ||
    submitting;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded bg-white shadow-sm max-w-3xl mx-auto"
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
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
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
          {errors.symbol && <p className="text-red-600 text-sm mt-1">{errors.symbol}</p>}
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
          {errors.indicators && <p className="text-red-600 text-sm mt-1">{errors.indicators}</p>}
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
          {errors.trend && <p className="text-red-600 text-sm mt-1">{errors.trend}</p>}
        </div>

        <div>
          <label className="font-medium flex items-center">Timeframe</label>
          <select
            name="timeframe"
            value={form.timeframe}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Kies een timeframe (optioneel)</option>
            <option value="15m">15 minuten</option>
            <option value="1H">1 uur</option>
            <option value="4H">4 uur</option>
            <option value="1D">1 dag</option>
            <option value="1W">1 week</option>
          </select>
        </div>

        <div>
          <label className="font-medium flex items-center">
            Strategie Type* <InfoTooltip text="Kies het type strategie voor deze setup." />
          </label>
          <select
            name="strategy_type"
            value={form.strategy_type}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.strategy_type ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Kies een type</option>
            <option value="dca">dca</option>
            <option value="manual">handmatig</option>
            <option value="trading">trading</option>
          </select>
          {errors.strategy_type && (
            <p className="text-red-600 text-sm mt-1">{errors.strategy_type}</p>
          )}
        </div>

        <div>
          <label className="font-medium flex items-center">Account Type (optioneel)</label>
          <input
            name="account_type"
            value={form.account_type}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Bijv. Spot, Futures"
          />
        </div>

        <div>
          <label className="font-medium flex items-center">Minimale investering (optioneel)</label>
          <input
            name="min_investment"
            value={form.min_investment}
            onChange={handleChange}
            type="number"
            min="0"
            step="0.01"
            className="border p-2 rounded w-full"
            placeholder="Bijv. 50"
          />
          {errors.min_investment && (
            <p className="text-red-600 text-sm mt-1">{errors.min_investment}</p>
          )}
        </div>

        <div>
          <label className="font-medium flex items-center">Tags (komma-gescheiden)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            placeholder="Bijv. swing, breakout"
          />
        </div>

        <div className="col-span-2">
          <label className="font-medium flex items-center">Score Logica (optioneel)</label>
          <textarea
            name="score_logic"
            value={form.score_logic}
            onChange={handleChange}
            className="border p-2 rounded w-full resize-none"
            placeholder="Bijv. RSI < 30 AND volume spike"
          />
        </div>

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
        disabled={isDisabled}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {submitting ? 'Bezig met opslaan...' : 'Setup toevoegen'}
      </button>
    </form>
  );
}
