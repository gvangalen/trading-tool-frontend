"use client";

import { useEffect, useState } from "react";

import {
  technicalDataDay,
  technicalDataWeek,
  technicalDataMonth,
  technicalDataQuarter,
  getIndicatorNames,
  getScoreRulesForIndicator,
  technicalDataAdd,
  deleteTechnicalIndicator,
} from "@/lib/api/technical";

import { getDailyScores } from "@/lib/api/scores";

export function useTechnicalData(activeTab = "Dag") {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState("N/A");
  const [advies, setAdvies] = useState("⚖️ Neutraal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // dropdown / score rules
  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  /* ======================================================
     LADEN VAN TECHNICAL DATA (FLAT LIST — GEEN GROUPING!)
  ====================================================== */
  useEffect(() => {
    loadData();
    loadIndicatorNames();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      let raw;

      // juiste endpoint per tab
      if (activeTab === "Dag") raw = await technicalDataDay();
      else if (activeTab === "Week") raw = await technicalDataWeek();
      else if (activeTab === "Maand") raw = await technicalDataMonth();
      else if (activeTab === "Kwartaal") raw = await technicalDataQuarter();

      if (!Array.isArray(raw)) throw new Error("Technische data is geen lijst");

      // standaardiseren van velden
      const normalized = raw.map((item) => ({
        name: item.indicator ?? item.name ?? "–",
        value: item.waarde ?? item.value ?? "–",
        score: item.score ?? null,
        action: item.advies ?? item.action ?? "–",
        interpretation: item.uitleg ?? item.interpretation ?? "–",
        timestamp: item.timestamp ?? null,
      }));

      // LET OP: geen grouping → grouping gebeurt in de tabelcomponenten
      setTechnicalData(normalized);

      // ============= DAILY SCORE LOGICA =============
      const scores = await getDailyScores();
      const backendScore = scores?.technical_score ?? null;

      if (backendScore !== null) {
        const rounded = parseFloat(backendScore).toFixed(1);
        setAvgScore(rounded);

        setAdvies(
          backendScore >= 75
            ? "🟢 Bullish"
            : backendScore <= 25
            ? "🔴 Bearish"
            : "⚖️ Neutraal"
        );
      } else {
        updateScore(normalized);
      }
    } catch (err) {
      console.error("❌ Fout bij technical data:", err);
      setTechnicalData([]);
      setAvgScore("N/A");
      setAdvies("⚖️ Neutraal");
      setError("Fout bij laden van technische data");
    } finally {
      setLoading(false);
    }
  }

  /* ======================================================
     INDICATOR-LIJST
  ====================================================== */
  async function loadIndicatorNames() {
    try {
      const list = await getIndicatorNames();
      setIndicatorNames(list);
    } catch (err) {
      console.error("❌ Fout bij indicator-namen:", err);
    }
  }

  /* ======================================================
     SCORE RULES
  ====================================================== */
  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(rules);
    } catch (err) {
      console.error("❌ Fout bij ophalen scoreregels:", err);
    }
  }

  /* ======================================================
     INDICATOR TOEVOEGEN
  ====================================================== */
  async function addTechnicalIndicator(indicatorName) {
    try {
      const result = await technicalDataAdd(indicatorName);
      await loadData();
      return result;
    } catch (err) {
      console.error("❌ addTechnicalIndicator mislukt:", err);
      throw err;
    }
  }

  /* ======================================================
     INDICATOR VERWIJDEREN
  ====================================================== */
  async function removeTechnicalIndicator(indicatorName) {
    try {
      await deleteTechnicalIndicator(indicatorName);
      await loadData();
    } catch (err) {
      console.error("❌ Verwijderen technical indicator mislukt:", err);
    }
  }

  /* ======================================================
     MANUELE SCORE-BEREKENING (fallback)
  ====================================================== */
  function updateScore(data) {
    let total = 0;
    let count = 0;

    data.forEach((ind) => {
      const s = Number(ind.score);
      if (!isNaN(s)) {
        total += s;
        count++;
      }
    });

    const avg = count ? (total / count).toFixed(1) : "N/A";
    setAvgScore(avg);

    setAdvies(
      avg >= 70 ? "🟢 Bullish" : avg <= 40 ? "🔴 Bearish" : "⚖️ Neutraal"
    );
  }

  return {
    technicalData,
    avgScore,
    advies,
    loading,
    error,

    indicatorNames,
    scoreRules,
    loadScoreRules,

    addTechnicalIndicator,
    removeTechnicalIndicator,
  };
}
