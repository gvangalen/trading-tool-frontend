"use client";

import { useState } from "react";

// Hooks
import { useTechnicalData } from "@/hooks/useTechnicalData";
import { useScoresData } from "@/hooks/useScoresData";

// Components
import TechnicalTabs from "@/components/technical/TechnicalTabs";
import TechnicalIndicatorScoreView from "@/components/technical/IndicatorScoreView";
import CardWrapper from "@/components/ui/CardWrapper";
import DayTable from "@/components/common/DayTable";
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

// Icons
import {
  Ruler,
  TrendingUp,
  TrendingDown,
  Gauge,
  Info,
  Activity,
} from "lucide-react";

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

  // 📈 Advies
  const adviesText =
    (technical?.score ?? 0) >= 75
      ? "Bullish"
      : (technical?.score ?? 0) <= 25
      ? "Bearish"
      : "Neutraal";

  // Zorg dat de daglijst altijd bestaat
  const technicalIndicators = Array.isArray(technicalData)
    ? technicalData
    : [];

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
      {/* 🤖 AI Agent Analyse (technical) */}
      {/* -------------------------------------------------- */}
      <AgentInsightPanel category="technical" />

      {/* -------------------------------------------------- */}
      {/* 🧮 Totale technische score (scorekaart) */}
      {/* -------------------------------------------------- */}
      <CardWrapper>
        <div className="space-y-4">

          <div className="flex items-center gap-2">
            <Gauge className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-[var(--text-dark)]">
              Totale Technische Score
            </h2>
          </div>

          <div
            className={`text-2xl font-bold ${getScoreColor(
              technical?.score
            )}`}
          >
            {loadingScore ? "…" : technical?.score?.toFixed(1) ?? "–"}
          </div>

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
      {/* ⚙️ Indicator toevoegen + scorelogica */}
      {/* -------------------------------------------------- */}
      <TechnicalIndicatorScoreView
        addTechnicalIndicator={addTechnicalIndicator}
      />

      {/* -------------------------------------------------- */}
      {/* 📅 Dagelijkse technische indicatoren (DayTable PRO) */}
      {/* -------------------------------------------------- */}
      {activeTab === "Dag" && (
        <DayTable
          title="Technische Indicatoren – Dag"
          icon={<Activity className="w-5 h-5" />}
          data={technicalIndicators}
          onRemove={removeTechnicalIndicator}
        />
      )}

      {/* -------------------------------------------------- */}
      {/* 🧭 Tabs voor 1H / 4H / Week / Maand */}
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
