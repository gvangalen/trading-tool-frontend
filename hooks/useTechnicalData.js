"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

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

/* =====================================================================
   USE TECHNICAL DATA — MET CORRECTE GROUPING VOOR NIEUWE TABELLEN
===================================================================== */
export function useTechnicalData(activeTab = "Dag") {
  const [technicalData, setTechnicalData] = useState([]);
  const [avgScore, setAvgScore] = useState("N/A");
  const [advies, setAdvies] = useState("⚖️ Neutraal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // dropdown / score rules
  const [indicatorNames, setIndicatorNames] = useState([]);
  const [scoreRules, setScoreRules] = useState([]);

  useEffect(() => {
    loadData();
    loadIndicatorNames();
  }, [activeTab]);

  /* ======================================================
     LADEN VAN TECHNICAL DATA + GROUPING
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

      // Normaliseren van API
      const normalized = raw.map((item) => ({
        name: item.indicator ?? item.name ?? "–",
        value: item.waarde ?? item.value ?? "–",
        score: item.score ?? null,
        action: item.advies ?? item.action ?? "–",
        interpretation: item.uitleg ?? item.interpretation ?? "–",
        timestamp: item.timestamp ?? null,
      }));

      /* ------------------------------------------------------
         GROUPING PER TAB → exact wat de UI verwacht
      ------------------------------------------------------ */
      if (activeTab === "Dag") {
        setTechnicalData(normalized); // flat list
      } else if (activeTab === "Week") {
        setTechnicalData(groupByWeek(normalized));
      } else if (activeTab === "Maand") {
        setTechnicalData(groupByMonth(normalized));
      } else if (activeTab === "Kwartaal") {
        setTechnicalData(groupByQuarter(normalized));
      }

      /* =====================================================
         SCORE VAN BACKEND
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
     GROUPING LOGICA
  ====================================================== */

  function groupByWeek(data) {
    const groups = {};

    data.forEach((item) => {
      if (!item.timestamp) return;

      const d = dayjs(item.timestamp);
      const week = d.week?.() || d.isoWeek?.() || d.weekday;
      const year = d.year();
      const key = `${year}-W${week}`;

      if (!groups[key]) {
        groups[key] = {
          label: `Week ${week} – ${year}`,
          items: [],
        };
      }
      groups[key].items.push(item);
    });

    return Object.values(groups);
  }

  function groupByMonth(data) {
    const groups = {};

    data.forEach((item) => {
      if (!item.timestamp) return;

      const d = dayjs(item.timestamp);
      const monthName = d.format("MMMM");
      const year = d.year();
      const key = `${year}-${d.month()}`;

      if (!groups[key]) {
        groups[key] = {
          label: `${monthName} – ${year}`,
          items: [],
        };
      }
      groups[key].items.push(item);
    });

    return Object.values(groups);
  }

  function groupByQuarter(data) {
    const groups = {};

    data.forEach((item) => {
      if (!item.timestamp) return;

      const d = dayjs(item.timestamp);
      const q = Math.floor(d.month() / 3) + 1;
      const year = d.year();
      const key = `${year}-Q${q}`;

      if (!groups[key]) {
        groups[key] = {
          label: `Q${q} – ${year}`,
          items: [],
        };
      }
      groups[key].items.push(item);
    });

    return Object.values(groups);
  }

  /* ======================================================
     SCORE FALLBACK
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

  /* ======================================================
     DROPDOWN + SCORE REGELS
  ====================================================== */
  async function loadIndicatorNames() {
    try {
      const list = await getIndicatorNames();
      setIndicatorNames(list);
    } catch {}
  }

  async function loadScoreRules(indicatorName) {
    try {
      const rules = await getScoreRulesForIndicator(indicatorName);
      setScoreRules(rules);
    } catch {}
  }

  async function addTechnicalIndicator(indicatorName) {
    const result = await technicalDataAdd(indicatorName);
    await loadData();
    return result;
  }

  async function removeTechnicalIndicator(indicatorName) {
    await deleteTechnicalIndicator(indicatorName);
    await loadData();
  }

  /* ======================================================
     RETURN
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
  };
}
