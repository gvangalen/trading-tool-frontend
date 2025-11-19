'use client';

import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

import React, { useState } from 'react';
import { saveSetup } from '@/lib/api/setups';
import { useSetupData } from '@/hooks/useSetupData';

export default function SetupForm() {
  const { loadSetups, loadDcaSetups } = useSetupData();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // RANGE sliders
  const [macroScore, setMacroScore] = useState([30, 70]);
  const [technicalScore, setTechnicalScore] = useState([40, 80]);
  const [marketScore, setMarketScore] = useState([20, 60]);

  // FORM
  const [formData, setFormData] = useState({
    name: '',
    symbol: 'BTC',
    strategy_type: '',      // <-- NAAM MOET ZO !!!
    timeframe: '1D',
    trend: '',
    account_type: '',
    min_investment: '',
    score_logic: '',
    explanation: '',
    action: '',
    tags: '',
    dynamic_investment: false,
    favorite: false,
  });

  // INPUT HANDLER
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setError('');
    setSuccess(false);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),

        min_macro_score: macroScore[0],
        max_macro_score: macroScore[1],

        min_technical_score: technicalScore[0],
        max_technical_score: technicalScore[1],

        min_market_score: marketScore[0],
        max_market_score: marketScore[1],
      };

      console.log("📨 Setup payload:", payload);

      await saveSetup(payload);   // <-- correcte API route

      setSuccess(true);

      // form resetten
      setFormData({
        name: '',
        symbol: 'BTC',
        strategy_type: '',
        timeframe: '1D',
        trend: '',
        account_type: '',
        min_investment: '',
        score_logic: '',
        explanation: '',
        action: '',
        tags: '',
        dynamic_investment: false,
        favorite: false,
      });

      // lijst verversen
      await loadSetups('', ['dca']);
      await loadDcaSetups();

      // success animatie kort tonen
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error('❌ Setup opslaan mislukt:', err);
      setError('❌ Opslaan mislukt. Vul alle verplichte velden in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-900"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">➕ Nieuwe Setup</h2>

      {/* Success */}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded animate-pulse">
          ✅ Setup succesvol opgeslagen!
        </div>
      )}

      {/* Errors */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* 📌 BASIS */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">📌 Basisgegevens</h3>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Naam*"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full dark:bg-gray-800 dark:text-gray-100"
          />

          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full dark:bg-gray-800 dark:text-gray-100"
          />

          <select
            name="strategy_type"
            value={formData.strategy_type}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Strategietype*</option>
            <option value="manual">Handmatig</option>
            <option value="ai">AI Trading Strategie</option>
            <option value="dca">DCA</option>
          </select>

          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="border p-2 rounded w-full dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="1D">1D</option>
            <option value="4H">4H</option>
            <option value="1W">1W</option>
          </select>
        </div>
      </section>

      {/* 📊 SCORE SLIDERS */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">📊 Score Range (0–100)</h3>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Macro Score: {macroScore[0]}–{macroScore[1]}
            </label>
            <Slider range min={0} max={100} value={macroScore} onChange={setMacroScore} />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Technical Score: {technicalScore[0]}–{technicalScore[1]}
            </label>
            <Slider range min={0} max={100} value={technicalScore} onChange={setTechnicalScore} />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-200">
              Market Score: {marketScore[0]}–{marketScore[1]}
            </label>
            <Slider range min={0} max={100} value={marketScore} onChange={setMarketScore} />
          </div>
        </div>
      </section>

      {/* 🧠 LOGICA */}
      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">🧠 Logica & Uitleg</h3>

        <textarea
          name="explanation"
          placeholder="Uitleg"
          value={formData.explanation}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-[60px] dark:bg-gray-800 dark:text-gray-100"
        />

        <textarea
          name="action"
          placeholder="Actie / trade logica"
          value={formData.action}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-[60px] dark:bg-gray-800 dark:text-gray-100"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags"
          value={formData.tags}
          onChange={handleChange}
          className="border p-2 rounded w-full dark:bg-gray-800 dark:text-gray-100"
        />
      </section>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 w-full"
      >
        {loading ? '⏳ Opslaan...' : '💾 Setup toevoegen'}
      </button>
    </form>
  );
}
