'use client';

import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

import React, { useState, useEffect } from 'react';
import { saveNewSetup, updateSetup } from '@/lib/api/setups';

export default function SetupForm({
  onSaved,
  mode = 'new',          // "new" | "edit"
  initialData = null,    // Data van te bewerken setup
}) {
  const isEdit = mode === 'edit';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // ----------------------------------------------------
  // 🟦 INITIAL FORM DATA (fallback voor nieuwe setups)
  // ----------------------------------------------------
  const emptyForm = {
    name: '',
    symbol: 'BTC',
    strategyType: '',
    timeframe: '1D',
    trend: '',
    accountType: '',
    minInvestment: '',
    scoreLogic: '',
    explanation: '',
    action: '',
    tags: '',
    dynamicInvestment: false,
    favorite: false,
  };

  const [formData, setFormData] = useState(emptyForm);

  const [macroScore, setMacroScore] = useState([30, 70]);
  const [technicalScore, setTechnicalScore] = useState([40, 80]);
  const [marketScore, setMarketScore] = useState([20, 60]);

  // ----------------------------------------------------
  // 🟦 EDIT MODE → formulier vullen met bestaande setup
  // ----------------------------------------------------
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        name: initialData.name ?? '',
        symbol: initialData.symbol ?? 'BTC',
        strategyType: initialData.strategy_type ?? '',
        timeframe: initialData.timeframe ?? '1D',
        trend: initialData.trend ?? '',
        accountType: initialData.account_type ?? '',
        minInvestment: initialData.min_investment ?? '',
        scoreLogic: initialData.score_logic ?? '',
        explanation: initialData.explanation ?? '',
        action: initialData.action ?? '',
        tags: (initialData.tags ?? []).join(', '),
        dynamicInvestment: !!initialData.dynamic_investment,
        favorite: !!initialData.favorite,
      });

      setMacroScore([initialData.min_macro_score, initialData.max_macro_score]);
      setTechnicalScore([initialData.min_technical_score, initialData.max_technical_score]);
      setMarketScore([initialData.min_market_score, initialData.max_market_score]);
    }
  }, [isEdit, initialData]);

  // ----------------------------------------------------
  // 🟦 Form change handler
  // ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ----------------------------------------------------
  // 🟦 SUBMIT (new or edit)
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      name: formData.name,
      symbol: formData.symbol,
      strategy_type: formData.strategyType,
      timeframe: formData.timeframe,
      trend: formData.trend,
      account_type: formData.accountType,
      min_investment: formData.minInvestment || null,
      score_logic: formData.scoreLogic,
      explanation: formData.explanation,
      action: formData.action,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      dynamic_investment: formData.dynamicInvestment,
      favorite: formData.favorite,

      min_macro_score: macroScore[0],
      max_macro_score: macroScore[1],
      min_technical_score: technicalScore[0],
      max_technical_score: technicalScore[1],
      min_market_score: marketScore[0],
      max_market_score: marketScore[1],
    };

    try {
      if (isEdit) {
        // 🟦 UPDATE MODE
        await updateSetup(initialData.id, payload);
        setSuccess('✔ Setup succesvol bijgewerkt!');
      } else {
        // 🟩 CREATE MODE
        await saveNewSetup(payload);
        setSuccess('✔ Setup succesvol opgeslagen!');
      }

      if (!isEdit) {
        // Reset alleen bij NIEUWE setup
        setFormData(emptyForm);
        setMacroScore([30, 70]);
        setTechnicalScore([40, 80]);
        setMarketScore([20, 60]);
      }

      if (onSaved) await onSaved();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Fout bij opslaan:', err);
      setError('❌ Opslaan mislukt. Controleer je velden.');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // 🟦 RENDER
  // ----------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-900"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {isEdit ? '✏️ Setup Bewerken' : '➕ Nieuwe Setup'}
      </h2>

      {success && (
        <div className="p-2 bg-green-100 text-green-800 border border-green-300 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-100 text-red-800 border border-red-300 rounded">
          {error}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 📌 BASISGEGEVENS */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-4">
          📌 Basisgegevens
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Naam*"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            name="symbol"
            placeholder="Symbool*"
            value={formData.symbol}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />

          <select
            name="strategyType"
            value={formData.strategyType}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          >
            <option value="">Strategie Type*</option>
            <option value="dca">DCA</option>
            <option value="manual">Manual</option>
            <option value="trading">Trading</option>
          </select>

          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="1D">1D</option>
            <option value="4H">4H</option>
            <option value="1W">1W</option>
          </select>

          <select
            name="trend"
            value={formData.trend}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Trend</option>
            <option value="Bullish">📈 Bullish</option>
            <option value="Bearish">📉 Bearish</option>
            <option value="Range">⚖️ Range</option>
          </select>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 📊 SCORE RANGES */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-4">
          📊 Score Range (0–100)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">
              Macro Score: {macroScore[0]}–{macroScore[1]}
            </label>
            <Slider range min={0} max={100} value={macroScore} onChange={setMacroScore} />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Technical Score: {technicalScore[0]}–{technicalScore[1]}
            </label>
            <Slider range min={0} max={100} value={technicalScore} onChange={setTechnicalScore} />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Market Score: {marketScore[0]}–{marketScore[1]}
            </label>
            <Slider range min={0} max={100} value={marketScore} onChange={setMarketScore} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 💼 OVERIG */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-4">💼 Overig</h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="accountType"
            placeholder="Account Type"
            value={formData.accountType}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            name="minInvestment"
            placeholder="Minimale investering"
            value={formData.minInvestment}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 🧠 LOGICA, UITLEG & TAGS */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-4">
          🧠 Logica en uitleg
        </h3>

        <textarea
          name="scoreLogic"
          placeholder="Score Logica"
          value={formData.scoreLogic}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-[60px]"
        />

        <textarea
          name="explanation"
          placeholder="Uitleg"
          value={formData.explanation}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-[60px]"
        />

        <textarea
          name="action"
          placeholder="Actie / Tradeplan"
          value={formData.action}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-[60px]"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma gescheiden)"
          value={formData.tags}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <div className="flex gap-6 mt-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="dynamicInvestment"
              checked={formData.dynamicInvestment}
              onChange={handleChange}
            />
            <span>Dynamische investering</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="favorite"
              checked={formData.favorite}
              onChange={handleChange}
            />
            <span>Favoriet</span>
          </label>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SUBMIT */}
      {/* ---------------------------------------------------------------- */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? '⏳ Opslaan...' : isEdit ? '💾 Update uitvoeren' : '💾 Setup toevoegen'}
      </button>
    </form>
  );
}
