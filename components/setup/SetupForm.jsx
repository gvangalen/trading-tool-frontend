"use client";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

import React, { useState, useEffect } from "react";
import { Settings, BarChart3, Save } from "lucide-react";

import { saveNewSetup, updateSetup } from "@/lib/api/setups";
import { useModal } from "@/components/modal/ModalProvider";

export default function SetupForm({ onSaved, mode = "new", initialData = null }) {
  const isEdit = mode === "edit";
  const { showSnackbar } = useModal();

  // ----------------------------------------------------
  // STATE
  // ----------------------------------------------------
  const emptyForm = {
    name: "",
    symbol: "BTC",
    strategyType: "dca",
    timeframe: "1W",
    tags: "",
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
      strategyType: initialData.strategy_type ?? "dca",
      timeframe: initialData.timeframe ?? "1W",
      tags: (initialData.tags ?? []).join(", "),
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

  // ----------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      symbol: formData.symbol,
      strategy_type: formData.strategyType,
      timeframe: formData.timeframe,

      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [],

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
    "rounded-2xl p-5 bg-[var(--card-bg)] border border-[var(--card-border)] space-y-4";

  const sectionTitle = (icon, text) => (
    <h3 className="flex items-center gap-2 font-semibold text-[1.05rem]">
      {icon}
      {text}
    </h3>
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
            name="strategyType"
            value={formData.strategyType}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="dca">DCA</option>
            <option value="trading">Trading</option>
            <option value="manual">Manual</option>
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
      </div>

      {/* SCORES */}
      <div className={sectionClass}>
        {sectionTitle(<BarChart3 size={18} />, "Score ranges (0–100)")}

        <label>Macro {macroScore[0]}–{macroScore[1]}</label>
        <Slider
          range
          min={0}
          max={100}
          value={macroScore}
          onChange={setMacroScore}
        />

        <label>Technical {technicalScore[0]}–{technicalScore[1]}</label>
        <Slider
          range
          min={0}
          max={100}
          value={technicalScore}
          onChange={setTechnicalScore}
        />

        <label>Market {marketScore[0]}–{marketScore[1]}</label>
        <Slider
          range
          min={0}
          max={100}
          value={marketScore}
          onChange={setMarketScore}
        />
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
