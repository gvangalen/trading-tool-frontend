'use client';

import { useState, useRef, useEffect } from 'react';
import { addSetup, checkSetupNameExists } from '@/lib/api/setups';
import { useSetupData } from '@/hooks/useSetupData';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function SetupForm({ onSubmitted }) {
  const { loadSetups } = useSetupData();
  const formRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    symbol: 'BTC',
    timeframe: '',
    account_type: '',
    strategy_type: '',
    category: '',
    min_investment: '',
    min_macro_score: '',
    max_macro_score: '',
    min_technical_score: '',
    max_technical_score: '',
    min_market_score: '',
    max_market_score: '',
    trend: '',
    score_logic: '',
    explanation: '',
    description: '',
    action: '',
    tags: '',
    dynamic_investment: false,
    favorite: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  }

  function validate() {
    const valErrors = {};
    if (!form.name || form.name.trim().length < 3) valErrors.name = 'Naam is verplicht (min. 3 tekens)';
    if (!form.symbol) valErrors.symbol = 'Symbool is verplicht';
    if (!form.strategy_type) valErrors.strategy_type = 'Strategietype is verplicht';
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
    try {
      const exists = await checkSetupNameExists(form.name.trim());
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
        min_investment: form.min_investment ? parseFloat(form.min_investment) : null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      };

      await addSetup(payload);
      await loadSetups();
      setSuccess(true);
      setForm({
        name: '',
        symbol: 'BTC',
        timeframe: '',
        account_type: '',
        strategy_type: '',
        category: '',
        min_investment: '',
        min_macro_score: '',
        max_macro_score: '',
        min_technical_score: '',
        max_technical_score: '',
        min_market_score: '',
        max_market_score: '',
        trend: '',
        score_logic: '',
        explanation: '',
        description: '',
        action: '',
        tags: '',
        dynamic_investment: false,
        favorite: false,
      });
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error(err);
      alert('Fout bij opslaan van setup.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 p-4 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold">➕ Nieuwe Trading Setup</h3>
      {success && <div className="bg-green-100 text-green-800 p-2 rounded">✅ Setup toegevoegd</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Naam*</label>
          <input name="name" value={form.name} onChange={handleChange} className="input" />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="font-medium">Symbool*</label>
          <input name="symbol" value={form.symbol} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="font-medium">Strategie Type*</label>
          <select name="strategy_type" value={form.strategy_type} onChange={handleChange} className="input">
            <option value="">Kies...</option>
            <option value="dca">DCA</option>
            <option value="manual">Handmatig</option>
            <option value="trading">Trading</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Timeframe</label>
          <select name="timeframe" value={form.timeframe} onChange={handleChange} className="input">
            <option value="">-</option>
            <option value="15m">15m</option>
            <option value="1H">1H</option>
            <option value="4H">4H</option>
            <option value="1D">1D</option>
            <option value="1W">1W</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Categorie</label>
          <input name="category" value={form.category} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="font-medium">Trend</label>
          <select name="trend" value={form.trend} onChange={handleChange} className="input">
            <option value="">-</option>
            <option value="bullish">Bullish</option>
            <option value="bearish">Bearish</option>
            <option value="neutral">Neutraal</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Account Type</label>
          <input name="account_type" value={form.account_type} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="font-medium">Minimale investering</label>
          <input name="min_investment" value={form.min_investment} onChange={handleChange} type="number" className="input" />
        </div>

        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <div>
            <label>Macro Score (min)</label>
            <input type="number" name="min_macro_score" value={form.min_macro_score} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>Macro Score (max)</label>
            <input type="number" name="max_macro_score" value={form.max_macro_score} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>Technical Score (min)</label>
            <input type="number" name="min_technical_score" value={form.min_technical_score} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>Technical Score (max)</label>
            <input type="number" name="max_technical_score" value={form.max_technical_score} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>Market Score (min)</label>
            <input type="number" name="min_market_score" value={form.min_market_score} onChange={handleChange} className="input" />
          </div>
          <div>
            <label>Market Score (max)</label>
            <input type="number" name="max_market_score" value={form.max_market_score} onChange={handleChange} className="input" />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">Score Logic (optioneel)</label>
          <textarea name="score_logic" value={form.score_logic} onChange={handleChange} className="input resize-none" rows={2} />
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">Toelichting / Uitleg</label>
          <textarea name="explanation" value={form.explanation} onChange={handleChange} className="input resize-none" rows={2} />
        </div>

        <div className="md:col-span-2">
          <label className="font-medium">Actie / Trade-instructie</label>
          <textarea name="action" value={form.action} onChange={handleChange} className="input resize-none" rows={2} />
        </div>

        <div>
          <label className="font-medium">Tags</label>
          <input name="tags" value={form.tags} onChange={handleChange} className="input" placeholder="Bijv. swing, breakout" />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input type="checkbox" name="dynamic_investment" checked={form.dynamic_investment} onChange={handleChange} className="mr-2" />
            Dynamische investering
          </label>
          <label className="flex items-center">
            <input type="checkbox" name="favorite" checked={form.favorite} onChange={handleChange} className="mr-2" />
            Favoriet
          </label>
        </div>
      </div>

      <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
        {submitting ? 'Bezig met opslaan...' : '➕ Setup toevoegen'}
      </button>
    </form>
  );
}
