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

  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  useEffect(() => {
    loadData();
    loadIndicatorNames();
  }, [activeTab]);

  /* ======================================================
     LADEN VAN TECHNICAL DATA — FLAT LIST
  ====================================================== */
  async function loadData() {
    setLoading(true);
    setError("");

    try {
      let raw;

      if (activeTab === "Dag") raw = await technicalDataDay();
      else if (activeTab === "Week") raw = await technicalDataWeek();
      else if (activeTab === "Maand") raw = await technicalDataMonth();
      else if (activeTab === "Kwartaal") raw = await technicalDataQuarter();

      if (!Array.isArray(raw))
        throw new Error("Technische data is geen lijst");

      const normalized = raw.map((item) => ({
        name: item.indicator ?? item.name ?? "–",
        value: item.waarde ?? item.value ?? "–",
        score: item.score ?? null,
        action: item.advies ?? item.action ?? "–",
        interpretation: item.uitleg ?? item.interpretation ?? "–",

        // 🔥 FIX — timestamp MOET een geldige date zijn
        timestamp: item.timestamp
          ? new Date(item.timestamp)
          : item.date
          ? new Date(item.date)
          : null,
      }));

      // 📌 GEEN GROUPING MEER — tabellen doen dit
      setTechnicalData(normalized);

      /* ======================================================
         DAGELIJKSE TECHNICAL SCORE
      ====================================================== */
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
     INDICATOR LIST
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
     SCOREREGELS
  ====================================================== */
  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(rules);
    } catch (err) {
      console.error("❌ Fout bij scoreregels:", err);
    }
  }

  /* ======================================================
     INDICATOR TOEVOEGEN
  ====================================================== */
  async function addTechnicalIndicator(indicatorName) {
    const result = await technicalDataAdd(indicatorName);
    await loadData();
    return result;
  }

  /* ======================================================
     INDICATOR VERWIJDEREN
  ====================================================== */
  async function removeTechnicalIndicator(indicatorName) {
    await deleteTechnicalIndicator(indicatorName);
    await loadData();
  }

  /* ======================================================
     MANUELE SCORE
  ====================================================== */
  function updateScore(list) {
    const nums = list.map((i) => Number(i.score)).filter((v) => !isNaN(v));
    if (nums.length === 0) return;

    const avg = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
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
