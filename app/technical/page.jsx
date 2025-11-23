"use client";

import { useState } from "react";

import { useTechnicalData } from "@/hooks/useTechnicalData";
import { useScoresData } from "@/hooks/useScoresData";

import TechnicalTabs from "@/components/technical/TechnicalTabs";
import TechnicalIndicatorScoreView from "@/components/technical/IndicatorScoreView";
import CardWrapper from "@/components/ui/CardWrapper";

// Nieuwe icons (geen emoji’s meer)
import { Ruler, TrendingUp, TrendingDown, Gauge, Info } from "lucide-react";

export default function TechnicalPage() {
  const [activeTab, setActiveTab] = useState("Dag");
  const [editIndicator, setEditIndicator] = useState(null);

  // 📡 Haal technische data + functies op
  const {
    technicalData,
    addTechnicalIndicator,
    removeTechnicalIndicator,
    loading: loadingIndicators,
    error,
  } = useTechnicalData(activeTab);

  // 📊 Technische score (scoremeter)
  const { technical, loading: loadingScore } = useScoresData();

  // 🎨 Scorekleur
  const getScoreColor = (score) => {
    const s = typeof score === "number" ? score : parseFloat(score);
    if (isNaN(s)) return "text-gray-600";
    if (s >= 70) return "text-green-600";
    if (s <= 40) return "text-red-600";
    return "text-yellow-600";
  };

  // 📈 Advies zonder emoji’s
  const adviesText =
    (technical?.score ?? 0) >= 75
      ? "Bullish"
      : (technical?.score ?? 0) <= 25
      ? "Bearish"
      : "Neutraal";

  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* -------------------------------------------------- */}
      {/* 📘 Titel */}
      {/* -------------------------------------------------- */}
      <div className="flex items-center gap-3 mb-2">
        <Ruler size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)]">
          Technische Analyse
        </h1>
      </div>

      {/* -------------------------------------------------- */}
      {/* 🧮 Scorecard */}
      {/* -------------------------------------------------- */}
      <CardWrapper>
        <div className="space-y-4">

          {/* Titel */}
          <div className="flex items-center gap-2">
            <Gauge className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-[var(--text-dark)]">
              Totale Technische Score
            </h2>
          </div>

          {/* Score */}
          <div
            className={`text-2xl font-bold ${getScoreColor(
              technical?.score
            )}`}
          >
            {loadingScore ? "…" : technical?.score?.toFixed(1) ?? "–"}
          </div>

          {/* Advies */}
          <div className="flex items-center gap-2 text-lg">
            {adviesText === "Bullish" && (
              <TrendingUp className="text-green-600" size={20} />
            )}
            {adviesText === "Bearish" && (
              <TrendingDown className="text-red-600" size={20} />
            )}
            {adviesText === "Neutraal" && (
              <Info className="text-yellow-600" size={20} />
            )}

            <span className="font-semibold text-[var(--text-dark)]">
              Advies: {loadingScore ? "…" : adviesText}
            </span>
          </div>
        </div>
      </CardWrapper>

      {/* -------------------------------------------------- */}
      {/* ⚙️ Scorelogica + Indicator toevoegen */}
      {/* -------------------------------------------------- */}
      <TechnicalIndicatorScoreView
        addTechnicalIndicator={addTechnicalIndicator}
      />

      {/* -------------------------------------------------- */}
      {/* 📅 Tabs met technische indicatoren */}
      {/* -------------------------------------------------- */}
      <TechnicalTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        technicalData={technicalData}
        loading={loadingIndicators}
        error={error}
        handleRemove={removeTechnicalIndicator}
      />
    </div>
  );
}
