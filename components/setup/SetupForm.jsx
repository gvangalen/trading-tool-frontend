"use client";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

import React, { useState, useEffect } from "react";
import {
  Settings,
  TrendingUp,
  BarChart3,
  Sliders,
  Tag,
  Sparkles,
  Star,
  CheckCircle,
  XCircle,
  Save,
} from "lucide-react";

import { saveNewSetup, updateSetup } from "@/lib/api/setups";

export default function SetupForm({
  onSaved,
  mode = "new",
  initialData = null,
}) {
  const isEdit = mode === "edit";

  // ----------------------------------------------------
  // STATE
  // ----------------------------------------------------
  const emptyForm = {
    name: "",
    symbol: "BTC",
    strategyType: "",
    timeframe: "1D",
    trend: "",
    accountType: "",
    minInvestment: "",
    scoreLogic: "",
    explanation: "",
    action: "",
    tags: "",
    dynamicInvestment: false,
    favorite: false,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [macroScore, setMacroScore] = useState([30, 70]);
  const [technicalScore, setTechnicalScore] = useState([40, 80]);
  const [marketScore, setMarketScore] = useState([20, 60]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ----------------------------------------------------
  // LOAD FOR EDIT
  // ----------------------------------------------------
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        name: initialData.name ?? "",
        symbol: initialData.symbol ?? "BTC",
        strategyType: initialData.strategy_type ?? "",
        timeframe: initialData.timeframe ?? "1D",
        trend: initialData.trend ?? "",
        accountType: initialData.account_type ?? "",
        minInvestment: initialData.min_investment ?? "",
        scoreLogic: initialData.score_logic ?? "",
        explanation: initialData.explanation ?? "",
        action: initialData.action ?? "",
        tags: (initialData.tags ?? []).join(", "),
        dynamicInvestment: !!initialData.dynamic_investment,
        favorite: !!initialData.favorite,
      });

      setMacroScore([
        initialData.min_macro_score,
        initialData.max_macro_score,
      ]);
      setTechnicalScore([
        initialData.min_technical_score,
        initialData.max_technical_score,
      ]);
      setMarketScore([
        initialData.min_market_score,
        initialData.max_market_score,
      ]);
    }
  }, [isEdit, initialData]);

  // ----------------------------------------------------
  // FORM CHANGE
  // ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [],
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
        await updateSetup(initialData.id, payload);
        setSuccess("✔ Setup bijgewerkt!");
      } else {
        await saveNewSetup(payload);
        setSuccess("✔ Setup opgeslagen!");
        setFormData(emptyForm);
        setMacroScore([30, 70]);
        setTechnicalScore([40, 80]);
        setMarketScore([20, 60]);
      }

      onSaved && onSaved();

      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      console.error("❌ Fout:", err);
      setError("❌ Opslaan mislukt. Controleer je velden.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // STYLE HELPERS
  // ----------------------------------------------------
  const fieldClass =
    "p-2 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] text-[var(--text-dark)] focus:ring-2 focus:ring-[var(--primary)] outline-none transition w-full";

  const sectionClass =
    "rounded-2xl p-5 bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm space-y-4";

  const sectionTitle = (icon, text) => (
    <h3 className="flex items-center gap-2 text-[1.1rem] font-semibold text-[var(--text-dark)] mb-2">
      {icon}
      {text}
    </h3>
  );

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-8 mt-4">

      {/* Success / Error */}
      {success && (
        <div className="p-3 rounded-xl border border-green-300 bg-green-50 text-green-800 flex items-center gap-2">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl border border-red-300 bg-red-50 text-red-800 flex items-center gap-2">
          <XCircle size={18} />
          {error}
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* SECTIE: BASISGEGEVENS */}
      {/* ------------------------------------------------ */}
      <div className={sectionClass}>
        {sectionTitle(<Settings size={18} />, "Basisgegevens")}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Naam*"
            value={formData.name}
            onChange={handleChange}
            className={fieldClass}
            required
          />

          <input
            name="symbol"
            placeholder="Symbool*"
            value={formData.symbol}
            onChange={handleChange}
            className={fieldClass}
            required
          />

          <select
            name="strategyType"
            value={formData.strategyType}
            onChange={handleChange}
            className={fieldClass}
            required
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
            className={fieldClass}
          >
            <option value="1D">1D — Daily</option>
            <option value="4H">4H — 4 uur</option>
            <option value="1W">1W — Weekly</option>
          </select>

          <select
            name="trend"
            value={formData.trend}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="">Trend</option>
            <option value="bullish">📈 Bullish</option>
            <option value="bearish">📉 Bearish</option>
            <option value="range">⚖️ Range</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* SECTIE: SCORE RANGES */}
      {/* ------------------------------------------------ */}
      <div className={sectionClass}>
        {sectionTitle(<BarChart3 size={18} />, "Score Range (0–100)")}

        <div className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">
              Macro Score: {macroScore[0]}–{macroScore[1]}
            </label>
            <Slider range min={0} max={100} value={macroScore} onChange={setMacroScore} />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Technical Score: {technicalScore[0]}–{technicalScore[1]}
            </label>
            <Slider range min={0} max={100} value={technicalScore} onChange={setTechnicalScore} />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Market Score: {marketScore[0]}–{marketScore[1]}
            </label>
            <Slider range min={0} max={100} value={marketScore} onChange={setMarketScore} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* SECTIE: OVERIG */}
      {/* ------------------------------------------------ */}
      <div className={sectionClass}>
        {sectionTitle(<Sliders size={18} />, "Overige instellingen")}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="accountType"
            placeholder="Account Type"
            value={formData.accountType}
            onChange={handleChange}
            className={fieldClass}
          />

          <input
            name="minInvestment"
            placeholder="Minimale investering (€)"
            type="number"
            value={formData.minInvestment}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* SECTIE: UITLEG & TAGS */}
      {/* ------------------------------------------------ */}
      <div className={sectionClass}>
        {sectionTitle(<Sparkles size={18} />, "Logica & Uitleg")}

        <textarea
          name="scoreLogic"
          placeholder="Score Logica"
          value={formData.scoreLogic}
          onChange={handleChange}
          className={`${fieldClass} min-h-[70px]`}
        />
        <textarea
          name="explanation"
          placeholder="Uitleg"
          value={formData.explanation}
          onChange={handleChange}
          className={`${fieldClass} min-h-[70px]`}
        />
        <textarea
          name="action"
          placeholder="Actie / Tradeplan"
          value={formData.action}
          onChange={handleChange}
          className={`${fieldClass} min-h-[70px]`}
        />

        <div>
          <label className="flex items-center gap-2 text-sm mb-1">
            <Tag size={16} className="text-[var(--primary)]" />
            Tags (komma gescheiden)
          </label>
          <input
            name="tags"
            placeholder="bijv: swing, scalp, dca"
            value={formData.tags}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>

        {/* Checkboxen */}
        <div className="flex gap-8 pt-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="dynamicInvestment"
              checked={formData.dynamicInvestment}
              onChange={handleChange}
            />
            <span>Dynamische investering</span>
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              name="favorite"
              checked={formData.favorite}
              onChange={handleChange}
            />
            <span>Favoriet</span>
          </label>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* SUBMIT BUTTON */}
      {/* ------------------------------------------------ */}
      <button
        id="setup-edit-submit"
        type="submit"
        disabled={loading}
        className="
          flex items-center gap-2
          bg-[var(--primary)] hover:bg-[var(--primary-dark)]
          text-white px-5 py-3
          font-semibold rounded-xl shadow-sm hover:shadow-md
          disabled:bg-gray-400 transition
        "
      >
        <Save size={18} />
        {loading
          ? "Opslaan…"
          : isEdit
          ? "Setup bijwerken"
          : "Nieuwe setup opslaan"}
      </button>
    </form>
  );
}
