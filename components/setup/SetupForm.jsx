'use client';

import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

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
    // TODO: Post to API
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">+ Nieuwe Setup</h2>

      <section>
        <h3 className="text-lg font-semibold border-b mb-2">📌 Basisgegevens</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Naam*" value={formData.name} onChange={handleChange} required className="input" />
          <input type="text" name="symbol" placeholder="Symbool*" value={formData.symbol} onChange={handleChange} required className="input" />
          <select name="strategyType" value={formData.strategyType} onChange={handleChange} required className="input">
            <option value="">Strategie Type*</option>
            <option value="dca">DCA</option>
            <option value="breakout">Breakout</option>
          </select>
          <select name="timeframe" value={formData.timeframe} onChange={handleChange} className="input">
            <option value="1D">1D</option>
            <option value="4H">4H</option>
            <option value="1W">1W</option>
          </select>
          <select name="trend" value={formData.trend} onChange={handleChange} className="input">
            <option value="">Trend</option>
            <option value="Bullish">Bullish</option>
            <option value="Bearish">Bearish</option>
            <option value="Range">Range</option>
          </select>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold border-b mb-2">📊 Score Range (0–100)</h3>

        <label className="block font-medium">Macro Score</label>
        <Slider range min={0} max={100} defaultValue={macroScore} onChange={setMacroScore} className="mb-4" />
        <label className="block font-medium">Technical Score</label>
        <Slider range min={0} max={100} defaultValue={technicalScore} onChange={setTechnicalScore} className="mb-4" />
        <label className="block font-medium">Market Score</label>
        <Slider range min={0} max={100} defaultValue={marketScore} onChange={setMarketScore} className="mb-4" />
      </section>

      <section>
        <h3 className="text-lg font-semibold border-b mb-2">💼 Overig</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="accountType" placeholder="Account Type" value={formData.accountType} onChange={handleChange} className="input" />
          <input type="number" name="minInvestment" placeholder="Minimale investering" value={formData.minInvestment} onChange={handleChange} className="input" />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold border-b mb-2">🧠 Logica en Uitleg</h3>
        <textarea name="scoreLogic" placeholder="Score Logica (optioneel)" value={formData.scoreLogic} onChange={handleChange} className="input"></textarea>
        <textarea name="explanation" placeholder="Toelichting / Uitleg" value={formData.explanation} onChange={handleChange} className="input"></textarea>
        <textarea name="action" placeholder="Actie / Tradeplan" value={formData.action} onChange={handleChange} className="input"></textarea>
        <input type="text" name="tags" placeholder="Tags (bijv. swing, breakout)" value={formData.tags} onChange={handleChange} className="input" />
        <div className="flex gap-4 mt-2">
          <label><input type="checkbox" name="dynamicInvestment" checked={formData.dynamicInvestment} onChange={handleChange} /> Dynamische investering</label>
          <label><input type="checkbox" name="favorite" checked={formData.favorite} onChange={handleChange} /> Favoriet</label>
        </div>
      </section>

      <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">💾 Setup toevoegen</button>
    </form>
  );
}
