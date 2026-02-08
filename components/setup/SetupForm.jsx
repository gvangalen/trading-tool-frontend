"use client";

import "rc-slider/assets/index.css";
import Slider from "rc-slider";

import React, { useState, useEffect } from "react";
import { Settings, BarChart3, Sliders, Save } from "lucide-react";

import { saveNewSetup, updateSetup } from "@/lib/api/setups";
import { useModal } from "@/components/modal/ModalProvider";
import CurveEditor from "@/components/setup/CurveEditor";

// ----------------------------------------------------
// Curve presets (frontend only)
// ----------------------------------------------------
const CURVE_PRESETS = {
  dca_contrarian: {
    input: "market_score",
    points: [
      { x: 20, y: 1.5 },
      { x: 40, y: 1.2 },
      { x: 60, y: 1.0 },
      { x: 80, y: 0.5 },
    ],
  },
  dca_trend_following: {
    input: "market_score",
    points: [
      { x: 20, y: 0.5 },
      { x: 40, y: 0.8 },
      { x: 60, y: 1.2 },
      { x: 80, y: 1.4 },
    ],
  },
};

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

    minInvestment: "",
    baseAmount: 100,

    executionMode: "fixed",
    scalingProfile: "fixed",
    decisionCurve: null,

    scoreLogic: "",
    explanation: "",
    action: "",
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

      minInvestment: initialData.min_investment ?? "",
      baseAmount: initialData.base_amount ?? 100,

      executionMode: initialData.execution_mode ?? "fixed",
      scalingProfile: initialData.decision_curve ? "custom" : "fixed",
      decisionCurve: initialData.decision_curve ?? null,

      scoreLogic: initialData.score_logic ?? "",
      explanation: initialData.explanation ?? "",
      action: initialData.action ?? "",
      tags: (initialData.tags ?? []).join(", "),
    });

    setMacroScore([initialData.min_macro_score, initialData.max_macro_score]);
    setTechnicalScore([initialData.min_technical_score, initialData.max_technical_score]);
    setMarketScore([initialData.min_market_score, initialData.max_market_score]);
  }, [isEdit, initialData]);

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleScalingProfileChange = (profile) => {
    if (profile === "fixed") {
      setFormData((p) => ({
        ...p,
        scalingProfile: "fixed",
        decisionCurve: null,
      }));
      return;
    }

    if (profile === "custom") {
      setFormData((p) => ({
        ...p,
        scalingProfile: "custom",
        decisionCurve:
          p.decisionCurve ??
          JSON.parse(JSON.stringify(CURVE_PRESETS.dca_contrarian)),
      }));
      return;
    }

    setFormData((p) => ({
      ...p,
      scalingProfile: profile,
      decisionCurve: JSON.parse(JSON.stringify(CURVE_PRESETS[profile])),
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

      min_investment: formData.minInvestment || null,
      base_amount: Number(formData.baseAmount),

      execution_mode: formData.executionMode,
      decision_curve:
        formData.executionMode === "custom" ? formData.decisionCurve : null,

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
          <select name="symbol" value={formData.symbol} onChange={handleChange} className={fieldClass}>
            <option value="BTC">BTC</option>
            <option value="SOL">SOL</option>
          </select>

          <select name="strategyType" value={formData.strategyType} onChange={handleChange} className={fieldClass}>
            <option value="dca">DCA</option>
            <option value="trading">Trading</option>
            <option value="manual">Manual</option>
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
        {sectionTitle(<BarChart3 size={18} />, "Score ranges (0–100)")}

        <label>Macro {macroScore[0]}–{macroScore[1]}</label>
        <Slider range min={0} max={100} value={macroScore} onChange={setMacroScore} />

        <label>Technical {technicalScore[0]}–{technicalScore[1]}</label>
        <Slider range min={0} max={100} value={technicalScore} onChange={setTechnicalScore} />

        <label>Market {marketScore[0]}–{marketScore[1]}</label>
        <Slider range min={0} max={100} value={marketScore} onChange={setMarketScore} />
      </div>

      {/* EXECUTION */}
      <div className={sectionClass}>
        {sectionTitle(<Sliders size={18} />, "Investeringslogica")}

        <label className="text-sm font-medium">
          Investeringsbedrag (€ / {formData.timeframe})
        </label>

        <input
          name="baseAmount"
          type="number"
          value={formData.baseAmount}
          onChange={handleChange}
          className={fieldClass}
        />

        <select name="executionMode" value={formData.executionMode} onChange={handleChange} className={fieldClass}>
          <option value="fixed">Vast bedrag</option>
          <option value="custom">Dynamisch (op basis van score)</option>
        </select>

        {formData.executionMode === "custom" && (
          <>
            <select
              value={formData.scalingProfile}
              onChange={(e) => handleScalingProfileChange(e.target.value)}
              className={fieldClass}
            >
              <option value="dca_contrarian">Contrarian</option>
              <option value="dca_trend_following">Trend following</option>
              <option value="custom">Custom curve</option>
              <option value="fixed">Geen scaling</option>
            </select>

            {formData.scalingProfile !== "fixed" && (
              <CurveEditor
                value={formData.decisionCurve}
                onChange={(curve) =>
                  setFormData((p) => ({ ...p, decisionCurve: curve }))
                }
              />
            )}
          </>
        )}
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
