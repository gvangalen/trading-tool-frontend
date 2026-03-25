"use client";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

import React, { useState, useEffect } from "react";
import { Settings, BarChart3, Save, Info } from "lucide-react";

import { saveNewSetup, updateSetup } from "@/lib/api/setups";
import { useModal } from "@/components/modal/ModalProvider";

export default function SetupForm({ onSaved, mode = "new", initialData = null }) {
  const isEdit = mode === "edit";
  const { showSnackbar } = useModal();

  // ----------------------------------------------------
  // SCORE MEANING
  // ----------------------------------------------------
  const scoreLabel = (v) => {
    if (v <= 25) return "Sterk bearish / risk-off";
    if (v <= 45) return "Bearish";
    if (v <= 60) return "Neutraal";
    if (v <= 75) return "Neutraal → bullish";
    if (v <= 90) return "Bullish";
    return "Euforisch / oververhit";
  };

  const rangeText = (min, max) =>
    `${scoreLabel(min)} → ${scoreLabel(max)}`;

  // ----------------------------------------------------
  // STATE
  // ----------------------------------------------------
  const emptyForm = {
    name: "",
    symbol: "BTC",
    setupType: "dca_basic",
    timeframe: "1W",

    dcaFrequency: "weekly",
    dcaDay: "monday",
    dcaMonthDay: 1,
  };

  const [formData, setFormData] = useState(emptyForm);
  const [macroScore, setMacroScore] = useState([30, 70]);
  const [technicalScore, setTechnicalScore] = useState([40, 80]);
  const [marketScore, setMarketScore] = useState([20, 60]);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------------------
  // LOAD FOR EDIT
  // ----------------------------------------------------
  useEffect(() => {
    if (!isEdit || !initialData) return;

    setFormData({
      name: initialData.name ?? "",
      symbol: initialData.symbol ?? "BTC",
      setupType: initialData.setup_type ?? "dca_basic",
      timeframe: initialData.timeframe ?? "1W",

      dcaFrequency: initialData.dca_frequency ?? "weekly",
      dcaDay: initialData.dca_day ?? "monday",
      dcaMonthDay: initialData.dca_month_day ?? 1,
    });

    setMacroScore([initialData.min_macro_score, initialData.max_macro_score]);
    setTechnicalScore([
      initialData.min_technical_score,
      initialData.max_technical_score,
    ]);
    setMarketScore([
      initialData.min_market_score,
      initialData.max_market_score,
    ]);
  }, [isEdit, initialData]);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const isDcaBasic = formData.setupType === "dca_basic";
  const isDcaSmart = formData.setupType === "dca_smart";

  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      symbol: formData.symbol,
      setup_type: formData.setupType,
      timeframe: formData.timeframe,

      // 🔥 alleen DCA BASIC krijgt deze velden
      ...(isDcaBasic && {
        dca_frequency: formData.dcaFrequency,
        dca_day: formData.dcaFrequency === "weekly" ? formData.dcaDay : null,
        dca_month_day:
          formData.dcaFrequency === "monthly" ? formData.dcaMonthDay : null,
      }),

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
        showSnackbar("Setup bijgewerkt", "success");
      } else {
        await saveNewSetup(payload);
        showSnackbar("Setup opgeslagen", "success");
        setFormData(emptyForm);
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      showSnackbar("Opslaan mislukt", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // STYLES
  // ----------------------------------------------------
  const fieldClass =
    "p-3 rounded-xl bg-[var(--bg-soft)] border border-[var(--border)] w-full";

  const sectionClass =
    "rounded-2xl p-5 bg-[var(--card-bg)] border border-[var(--card-border)] space-y-5";

  const sectionTitle = (icon, text) => (
    <h3 className="flex items-center gap-2 font-semibold text-[1.05rem]">
      {icon}
      {text}
    </h3>
  );

  const scoreBlock = (title, score, setScore, description) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span>{title}</span>
        <span className="text-[var(--text-soft)]">
          {score[0]}–{score[1]}
        </span>
      </div>

      <Slider
        range
        min={0}
        max={100}
        value={score}
        onChange={setScore}
      />

      <div className="text-sm text-[var(--text-soft)]">
        <strong>{rangeText(score[0], score[1])}</strong>
        <div className="mt-1">{description}</div>
      </div>
    </div>
  );

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* BASIS */}
      <div className={sectionClass}>
        {sectionTitle(<Settings size={18} />, "Basisgegevens")}

        <input
          name="name"
          placeholder="Naam van de setup"
          value={formData.name}
          onChange={handleChange}
          className={fieldClass}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="BTC">BTC</option>
            <option value="SOL">SOL</option>
          </select>

          <select
            name="setupType"
            value={formData.setupType}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="dca_basic">DCA Basic</option>
            <option value="dca_smart">DCA Smart</option>
            <option value="breakout">Breakout</option>
          </select>

          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="1D">1D</option>
            <option value="4H">4H</option>
            <option value="1W">1W</option>
          </select>
        </div>

        {/* 🔥 DCA BASIC */}
        {isDcaBasic && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <select
              name="dcaFrequency"
              value={formData.dcaFrequency}
              onChange={handleChange}
              className={fieldClass}
            >
              <option value="daily">Dagelijks</option>
              <option value="weekly">Wekelijks</option>
              <option value="monthly">Maandelijks</option>
            </select>

            {formData.dcaFrequency === "weekly" && (
              <select
                name="dcaDay"
                value={formData.dcaDay}
                onChange={handleChange}
                className={fieldClass}
              >
                <option value="monday">Maandag</option>
                <option value="tuesday">Dinsdag</option>
                <option value="wednesday">Woensdag</option>
                <option value="thursday">Donderdag</option>
                <option value="friday">Vrijdag</option>
                <option value="saturday">Zaterdag</option>
                <option value="sunday">Zondag</option>
              </select>
            )}

            {formData.dcaFrequency === "monthly" && (
              <input
                type="number"
                name="dcaMonthDay"
                min={1}
                max={28} // 🔥 FIX
                value={formData.dcaMonthDay}
                onChange={handleChange}
                className={fieldClass}
                placeholder="Dag van de maand (1-28)"
              />
            )}
          </div>
        )}

        {/* 🧠 SMART DCA */}
        {isDcaSmart && (
          <div className="text-sm text-[var(--text-soft)]">
            Smart DCA bepaalt automatisch wanneer en hoeveel er wordt gekocht.
          </div>
        )}
      </div>

      {/* SCORES */}
      <div className={sectionClass}>
        {sectionTitle(<BarChart3 size={18} />, "Wanneer mag deze setup actief zijn?")}

        <div className="flex items-start gap-2 text-sm text-[var(--text-soft)]">
          <Info size={16} className="mt-0.5" />
          <p>
            Deze score-ranges bepalen <strong>in welke marktfase</strong> deze setup geldig is.
          </p>
        </div>

        {scoreBlock("Macro", macroScore, setMacroScore, "Macro-omgeving")}
        {scoreBlock("Technical", technicalScore, setTechnicalScore, "Trend")}
        {scoreBlock("Market / Sentiment", marketScore, setMarketScore, "Sentiment")}
      </div>

      {/* SAVE */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] transition text-white px-6 py-4 rounded-2xl font-semibold shadow-sm"
      >
        <Save size={18} />
        {loading ? "Opslaan…" : "Setup opslaan"}
      </button>
    </form>
  );
}
