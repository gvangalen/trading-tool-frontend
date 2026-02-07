"use client";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

import React, { useState, useEffect } from "react";
import {
  Settings,
  BarChart3,
  Sliders,
  Tag,
  Sparkles,
  Save,
} from "lucide-react";

import { saveNewSetup, updateSetup } from "@/lib/api/setups";
import { useModal } from "@/components/modal/ModalProvider";

export default function SetupForm({
  onSaved,
  mode = "new",
  initialData = null,
}) {
  const isEdit = mode === "edit";
  const { showSnackbar } = useModal();

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
    baseAmount: 100,

    executionMode: "fixed", // fixed | custom
    scalingProfile: "fixed", // fixed | dca_contrarian | dca_trend_following | custom
    decisionCurve: null,

    scoreLogic: "",
    explanation: "",
    action: "",
    tags: "",
    favorite: false,
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
    if (isEdit && initialData) {
      setFormData({
        name: initialData.name ?? "",
        symbol: initialData.symbol ?? "BTC",
        strategyType: initialData.strategy_type ?? "",
        timeframe: initialData.timeframe ?? "1D",
        trend: initialData.trend ?? "",
        accountType: initialData.account_type ?? "",

        minInvestment: initialData.min_investment ?? "",
        baseAmount: initialData.base_amount ?? 100,

        executionMode: initialData.execution_mode ?? "fixed",
        scalingProfile: initialData.scaling_profile ?? "fixed",
        decisionCurve: initialData.decision_curve ?? null,

        scoreLogic: initialData.score_logic ?? "",
        explanation: initialData.explanation ?? "",
        action: initialData.action ?? "",
        tags: (initialData.tags ?? []).join(", "),
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
    setLoading(true);

    const payload = {
      name: formData.name,
      symbol: formData.symbol,
      strategy_type: formData.strategyType,
      timeframe: formData.timeframe,
      trend: formData.trend,
      account_type: formData.accountType,

      min_investment: formData.minInvestment || null,
      base_amount: Number(formData.baseAmount),

      execution_mode: formData.executionMode,
      scaling_profile:
        formData.executionMode === "custom"
          ? formData.scalingProfile
          : "fixed",
      decision_curve:
        formData.executionMode === "custom"
          ? formData.decisionCurve
          : null,

      score_logic: formData.scoreLogic,
      explanation: formData.explanation,
      action: formData.action,
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim())
        : [],
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
        showSnackbar("Setup succesvol bijgewerkt!", "success");
      } else {
        await saveNewSetup(payload);
        showSnackbar("Nieuwe setup opgeslagen!", "success");
        setFormData(emptyForm);
        setMacroScore([30, 70]);
        setTechnicalScore([40, 80]);
        setMarketScore([20, 60]);
      }

      onSaved && onSaved();
    } catch (err) {
      console.error("❌ Fout:", err);
      showSnackbar("Opslaan mislukt — controleer de velden.", "danger");
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

      {/* BASIS */}
      <div className={sectionClass}>
        {sectionTitle(<Settings size={18} />, "Basisgegevens")}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Naam*" value={formData.name} onChange={handleChange} className={fieldClass} required />
          <input name="symbol" placeholder="Symbool*" value={formData.symbol} onChange={handleChange} className={fieldClass} required />

          <select name="strategyType" value={formData.strategyType} onChange={handleChange} className={fieldClass} required>
            <option value="">Strategie Type*</option>
            <option value="dca">DCA</option>
            <option value="manual">Manual</option>
            <option value="trading">Trading</option>
          </select>

          <select name="timeframe" value={formData.timeframe} onChange={handleChange} className={fieldClass}>
            <option value="1D">1D</option>
            <option value="4H">4H</option>
            <option value="1W">1W</option>
          </select>
        </div>
      </div>

      {/* SCORES */}
      <div className={sectionClass}>
        {sectionTitle(<BarChart3 size={18} />, "Score ranges")}

        <div className="space-y-6">
          <label>Macro {macroScore[0]}–{macroScore[1]}</label>
          <Slider range min={0} max={100} value={macroScore} onChange={setMacroScore} />

          <label>Technical {technicalScore[0]}–{technicalScore[1]}</label>
          <Slider range min={0} max={100} value={technicalScore} onChange={setTechnicalScore} />

          <label>Market {marketScore[0]}–{marketScore[1]}</label>
          <Slider range min={0} max={100} value={marketScore} onChange={setMarketScore} />
        </div>
      </div>

      {/* EXECUTION */}
      <div className={sectionClass}>
        {sectionTitle(<Sliders size={18} />, "Investeringslogica")}

        <input
          name="baseAmount"
          type="number"
          placeholder="Basisbedrag per cyclus (€)"
          value={formData.baseAmount}
          onChange={handleChange}
          className={fieldClass}
        />

        <select name="executionMode" value={formData.executionMode} onChange={handleChange} className={fieldClass}>
          <option value="fixed">Vast bedrag</option>
          <option value="custom">Slimme investering</option>
        </select>

        {formData.executionMode === "custom" && (
          <select name="scalingProfile" value={formData.scalingProfile} onChange={handleChange} className={fieldClass}>
            <option value="dca_contrarian">Contrarian</option>
            <option value="dca_trend_following">Trend following</option>
            <option value="fixed">Geen scaling</option>
            <option value="custom">Custom curve</option>
          </select>
        )}

        {formData.scalingProfile === "custom" && (
          <textarea
            className={`${fieldClass} min-h-[120px]`}
            placeholder="Decision curve JSON"
            value={JSON.stringify(formData.decisionCurve ?? [], null, 2)}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                decisionCurve: JSON.parse(e.target.value),
              }))
            }
          />
        )}
      </div>

      {/* SUBMIT */}
      <button type="submit" disabled={loading} className="bg-[var(--primary)] text-white px-5 py-3 rounded-xl font-semibold">
        <Save size={18} /> {loading ? "Opslaan…" : "Opslaan"}
      </button>
    </form>
  );
}
