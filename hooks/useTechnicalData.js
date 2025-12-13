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

/* --------------------------------------------------------
   Advies logica
-------------------------------------------------------- */
const getAdvies = (score) =>
  score >= 75
    ? "🟢 Bullish"
    : score <= 25
    ? "🔴 Bearish"
    : "⚖️ Neutraal";

/* ========================================================
   MAIN HOOK — TECHNICAL (CONSISTENT MET MARKET & MACRO)
======================================================== */
export function useTechnicalData(activeTab = "Dag") {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState("N/A");
  const [advies, setAdvies] = useState("⚖️ Neutraal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  /* --------------------------------------------------------
     🔹 Afgeleide helpers (BELANGRIJK)
  -------------------------------------------------------- */
  const activeTechnicalIndicatorNames = technicalData.map(
    (i) => i.name
  );

  /* --------------------------------------------------------
     INIT
  -------------------------------------------------------- */
  useEffect(() => {
    loadData();
    loadIndicatorNames();
  }, [activeTab]);

  /* ======================================================
     LADEN VAN TECHNICAL DATA
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
        timestamp: item.timestamp
          ? new Date(item.timestamp)
          : item.date
          ? new Date(item.date)
          : null,
      }));

      setTechnicalData(normalized);

      /* --------------------------------------------------
         DAGELIJKSE TECHNICAL SCORE
      -------------------------------------------------- */
      const scores = await getDailyScores();
      const backendScore = scores?.technical_score ?? null;

      if (backendScore !== null) {
        const rounded = parseFloat(backendScore).toFixed(1);
        setAvgScore(rounded);
        setAdvies(getAdvies(backendScore));
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
     INDICATOR NAMEN
  ====================================================== */
  async function loadIndicatorNames() {
    try {
      const list = await getIndicatorNames();
      setIndicatorNames(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("❌ Fout bij indicator-namen:", err);
    }
  }

  /* ======================================================
     SCOREREGELS
  ====================================================== */
  async function loadScoreRules(indicatorName) {
    if (!indicatorName) return;

    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(Array.isArray(rules) ? rules : []);
    } catch (err) {
      console.error("❌ Fout bij scoreregels:", err);
    }
  }

  /* ======================================================
     ➕ INDICATOR TOEVOEGEN (DUPLICATE SAFE)
  ====================================================== */
  async function addTechnicalIndicator(indicatorName) {
    if (!indicatorName) return;

    // 🛑 Dubbele bescherming
    if (activeTechnicalIndicatorNames.includes(indicatorName)) {
      return;
    }

    await technicalDataAdd(indicatorName);
    await loadData();
  }

  /* ======================================================
     ❌ INDICATOR VERWIJDEREN
  ====================================================== */
  async function removeTechnicalIndicator(indicatorName) {
    await deleteTechnicalIndicator(indicatorName);
    await loadData();
  }

  /* ======================================================
     FALLBACK SCORE BEREKENING
  ====================================================== */
  function updateScore(list) {
    const nums = list.map((i) => Number(i.score)).filter((v) => !isNaN(v));
    if (nums.length === 0) return;

    const avg = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
    setAvgScore(avg);
    setAdvies(getAdvies(avg));
  }

  /* ======================================================
     EXPORT
  ====================================================== */
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

    // 👇 ESSENTIEEL VOOR UI (zoals Market)
    activeTechnicalIndicatorNames,
  };
}
