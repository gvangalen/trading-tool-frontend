'use client';

import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { getIndicatorNames, addNewRule } from '@/lib/api/technical';

export default function IndicatorRuleForm() {
  const [indicators, setIndicators] = useState([]);
  const [range, setRange] = useState([0, 30]); // slider range_min, range_max

  const [formData, setFormData] = useState({
    indicator: '',
    trend: '',
    interpretation: '',
    action: '',
    score: 90,
  });

  const [status, setStatus] = useState('');

  useEffect(() => {
    // ✅ Ophalen van beschikbare indicatornamen uit backend
    async function fetchIndicators() {
      try {
        const data = await getIndicatorNames();
        setIndicators(data);
      } catch (err) {
        console.error('❌ Fout bij ophalen indicatoren:', err);
      }
    }

    fetchIndicators();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      indicator: formData.indicator,
      range_min: range[0],
      range_max: range[1],
      score: parseInt(formData.score),
      trend: formData.trend,
      interpretation: formData.interpretation,
      action: formData.action,
    };

    try {
      setStatus('⏳ Regel wordt opgeslagen...');
      await addNewRule(payload);
      setStatus('✅ Regel succesvol opgeslagen!');
      // Reset formulier na succes
      setFormData({
        indicator: '',
        trend: '',
        interpretation: '',
        action: '',
        score: 90,
      });
      setRange([0, 30]);
    } catch (err) {
      console.error('❌ Fout bij opslaan van regel:', err);
      setStatus('❌ Fout bij opslaan van regel');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-900"
    >
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">➕ Nieuwe Score Regel</h2>

      {/* 📌 Indicatorkeuze */}
      <section>
        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">
          Indicator*
        </label>
        <select
          name="indicator"
          value={formData.indicator}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">Kies een indicator</option>
          {indicators.map((ind) => (
            <option key={ind.name} value={ind.name}>
              {ind.display_name || ind.name}
            </option>
          ))}
        </select>
      </section>

      {/* 🎚️ Slider + Preview */}
      <section>
        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">
          Waardebereik (range): {range[0]} – {range[1]}
        </label>
        <Slider range min={0} max={100} defaultValue={range} onChange={setRange} />
        <p className="text-sm text-gray-500 mt-2">
          Deze range wordt gebruikt om een score toe te kennen aan deze indicator.
        </p>
      </section>

      {/* 💯 Score */}
      <section>
        <label className="block font-medium mb-2 text-gray-700 dark:text-gray-200">
          Score (0–100)
        </label>
        <input
          type="number"
          name="score"
          value={formData.score}
          onChange={handleChange}
          min={0}
          max={100}
          required
          className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />
      </section>

      {/* 📈 Trend / interpretatie / actie */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="trend"
          placeholder="Trend (bijv. Bullish, Oversold)"
          value={formData.trend}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
        />
        <textarea
          name="interpretation"
          placeholder="Interpretatie"
          value={formData.interpretation}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100 min-h-[60px]"
        />
        <textarea
          name="action"
          placeholder="Aanbevolen actie (optioneel)"
          value={formData.action}
          onChange={handleChange}
          className="border p-2 rounded w-full bg-gray-50 dark:bg-gray-800 dark:text-gray-100 min-h-[60px]"
        />
      </section>

      <button
        type="submit"
        className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        💾 Regel opslaan
      </button>

      {status && (
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 italic">{status}</p>
      )}
    </form>
  );
}
