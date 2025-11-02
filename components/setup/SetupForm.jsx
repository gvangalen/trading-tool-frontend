'use client';

import 'rc-slider/assets/index.css'; // ✅ FIX build error
import Slider from 'rc-slider';       // ✅ de component zelf

import React, { useState } from 'react';


export default function SetupForm() {
  const [macroScore, setMacroScore] = useState([30, 70]);
  const [technicalScore, setTechnicalScore] = useState([40, 80]);
  const [marketScore, setMarketScore] = useState([20, 60]);

  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      min_macro_score: macroScore[0],
      max_macro_score: macroScore[1],
      min_technical_score: technicalScore[0],
      max_technical_score: technicalScore[1],
      min_market_score: marketScore[0],
      max_market_score: marketScore[1],
    };
    console.log('🔁 Payload:', payload);
    // TODO: API call toevoegen
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-900"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">➕ Nieuwe Setup</h2>

      {/* 📌 Basisgegevens */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-4 text-gray-700 dark:text-gray-200">
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
            className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />

          <input
            type="text"
            name="symbol"
            placeholder="Symbool*"
            value={formData.symbol}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />

          <select
            name="strategyType"
            value={formData.strategyType}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Strategie Type*</option>
            <option value="dca">DCA</option>
            <option value="breakout">Breakout</option>
            <option value="trend">Trend Follow</option>
          </select>

          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="1D">1D</option>
            <option value="4H">4H</option>
            <option value="1W">1W</option>
          </select>

          <select
            name="trend"
            value={formData.trend}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Trend</option>
            <option value="Bullish">📈 Bullish</option>
            <option value="Bearish">📉 Bearish</option>
            <option value="Range">⚖️ Range</option>
          </select>
        </div>
      </section>

      {/* 📊 Score Range */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-4 text-gray-700 dark:text-gray-200">
          📊 Score Range (0–100)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
              Macro Score: {macroScore[0]}–{macroScore[1]}
            </label>
            <Slider range min={0} max={100} defaultValue={macroScore} onChange={setMacroScore} />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
              Technical Score: {technicalScore[0]}–{technicalScore[1]}
            </label>
            <Slider range min={0} max={100} defaultValue={technicalScore} onChange={setTechnicalScore} />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-200">
              Market Score: {marketScore[0]}–{marketScore[1]}
            </label>
            <Slider range min={0} max={100} defaultValue={marketScore} onChange={setMarketScore} />
          </div>
        </div>
      </section>

      {/* 💼 Overig */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-4 text-gray-700 dark:text-gray-200">
          💼 Overig
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="accountType"
            placeholder="Account Type"
            value={formData.accountType}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />

          <input
            type="number"
            name="minInvestment"
            placeholder="Minimale investering"
            value={formData.minInvestment}
            onChange={handleChange}
            className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </section>

      {/* 🧠 Logica en uitleg */}
      <section>
        <h3 className="text-lg font-semibold border-b pb-1 mb-4 text-gray-700 dark:text-gray-200">
          🧠 Logica en Uitleg
        </h3>

        <textarea
          name="scoreLogic"
          placeholder="Score Logica (optioneel)"
          value={formData.scoreLogic}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-[60px] bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />

        <textarea
          name="explanation"
          placeholder="Toelichting / Uitleg"
          value={formData.explanation}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-[60px] bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />

        <textarea
          name="action"
          placeholder="Actie / Tradeplan"
          value={formData.action}
          onChange={handleChange}
          className="border p-2 rounded w-full min-h-[60px] bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (bijv. swing, breakout)"
          value={formData.tags}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />

        <div className="flex gap-6 mt-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="dynamicInvestment" checked={formData.dynamicInvestment} onChange={handleChange} />
            <span className="text-gray-700 dark:text-gray-200">Dynamische investering</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="favorite" checked={formData.favorite} onChange={handleChange} />
            <span className="text-gray-700 dark:text-gray-200">Favoriet</span>
          </label>
        </div>
      </section>

      <button
        type="submit"
        className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        💾 Setup toevoegen
      </button>
    </form>
  );
}
