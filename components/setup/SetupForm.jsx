'use client';

import { useState, useRef, useEffect } from 'react';
import { checkSetupNameExists } from '@/lib/setupService';
import { useSetupData } from '@/hooks/useSetupData';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function EditSetupPopup({ setup, onClose }) {
  const formRef = useRef(null);
  const { updateSetup } = useSetupData();

  const [form, setForm] = useState({ ...setup });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm({ ...setup });
  }, [setup]);

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
      const nameChanged = form.name.trim() !== setup.name;
      const symbolChanged = form.symbol.trim() !== setup.symbol;

      if (nameChanged || symbolChanged) {
        const nameExists = await checkSetupNameExists(form.name.trim(), form.symbol.trim());
        if (nameExists) {
          setErrors({ name: true });
          formRef.current.scrollIntoView({ behavior: 'smooth' });
          setSubmitting(false);
          return;
        }
      }

      const payload = {
        ...form,
        name: form.name.trim(),
        indicators: form.indicators.trim(),
        score_logic: form.score_logic?.trim() || '',
        account_type: form.account_type?.trim(),
        strategy_type: form.strategy_type?.trim(),
        min_investment: form.min_investment ? parseFloat(form.min_investment) : null,
        tags: form.tags
          ? form.tags.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
          : [],
      };

      await updateSetup(setup.id, payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onClose) onClose();
    } catch (err) {
      console.error('❌ Setup bijwerken mislukt:', err);
      alert('Fout bij opslaan setup.');
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = !form.name || !form.indicators || !form.trend;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 border p-4 rounded bg-white shadow-sm"
    >
      <h3 className="text-lg font-semibold">✏️ Setup bewerken</h3>

      {success && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-3 py-2 rounded">
          ✅ Setup succesvol bijgewerkt!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium flex items-center">
            Naam*
            <InfoTooltip text="Unieke naam per symbool vereist." />
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">
              {form.name?.trim().length < 3
                ? 'Naam is verplicht (minimaal 3 tekens)'
                : 'Deze naam bestaat al voor dit symbool'}
            </p>
          )}
        </div>

        <div>
          <label className="font-medium flex items-center">
            Indicatoren*
            <InfoTooltip text="Bijv. RSI, volume spike" />
          </label>
          <input
            name="indicators"
            value={form.indicators}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.indicators ? 'border-red-500' : ''}`}
          />
          {errors.indicators && <p className="text-red-600 text-sm mt-1">Veld is verplicht</p>}
        </div>

        <div>
          <label className="font-medium flex items-center">
            Trend*
            <InfoTooltip text="Bullish, Bearish of Neutraal?" />
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

        <input name="symbol" value={form.symbol} onChange={handleChange} className="border p-2 rounded" />
        <input name="account_type" value={form.account_type} onChange={handleChange} className="border p-2 rounded" />
        <input name="strategy_type" value={form.strategy_type} onChange={handleChange} className="border p-2 rounded" />
        <input name="min_investment" value={form.min_investment} onChange={handleChange} className="border p-2 rounded" />
        <input name="tags" value={form.tags} onChange={handleChange} className="border p-2 rounded" />

        <textarea
          name="score_logic"
          value={form.score_logic}
          onChange={handleChange}
          className="border p-2 rounded"
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

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isDisabled || submitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            isDisabled || submitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {submitting ? 'Bezig met opslaan...' : 'Wijzigingen opslaan'}
        </button>
        <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Annuleren</button>
      </div>
    </form>
  );
}
