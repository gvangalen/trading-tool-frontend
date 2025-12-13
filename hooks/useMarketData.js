"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  fetchMarketData7d,
  fetchLatestBTC,
  fetchForwardReturnsWeek,
  fetchForwardReturnsMonth,
  fetchForwardReturnsQuarter,
  fetchForwardReturnsYear,
  fetchMarketDayData,
  getMarketIndicatorNames,
  getScoreRulesForMarketIndicator,
  marketIndicatorAdd,
  marketIndicatorDelete,
  getUserMarketIndicators,
} from "@/lib/api/market";

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
   MAIN HOOK
======================================================== */
export function useMarketData() {
  const { showConfirm, showSnackbar } = useModal();

  const [sevenDayData, setSevenDayData] = useState([]);
  const [btcLive, setBtcLive] = useState(null);

  const [forwardReturns, setForwardReturns] = useState({
    week: [],
    maand: [],
    kwartaal: [],
    jaar: [],
  });

  const [marketScore, setMarketScore] = useState("N/A");
  const [advies, setAdviesState] = useState("⚖️ Neutraal");

  const [marketDayData, setMarketDayData] = useState([]);

  // 🔹 volledige records
  const [activeMarketIndicators, setActiveMarketIndicators] = useState([]);

  // 🔹 afgeleide helper
  const activeMarketIndicatorNames = activeMarketIndicators.map(
    (i) => i.name
  );

  const [availableIndicators, setAvailableIndicators] = useState([]);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [scoreRules, setScoreRules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* --------------------------------------------------------
     INIT
  -------------------------------------------------------- */
  useEffect(() => {
    loadAll();
    const interval = setInterval(loadLiveBTC, 60000);
    return () => clearInterval(interval);
  }, []);

  /* --------------------------------------------------------
     LOAD ALLES
  -------------------------------------------------------- */
  async function loadAll() {
    setLoading(true);
    try {
      setSevenDayData(await fetchMarketData7d());

      const [week, maand, kwartaal, jaar] = await Promise.all([
        fetchForwardReturnsWeek(),
        fetchForwardReturnsMonth(),
        fetchForwardReturnsQuarter(),
        fetchForwardReturnsYear(),
      ]);
      setForwardReturns({ week, maand, kwartaal, jaar });

      const dailyScores = await getDailyScores();
      const score = dailyScores?.market?.score ?? 50;
      setMarketScore(score);
      setAdviesState(getAdvies(score));

      setMarketDayData((await fetchMarketDayData()) || []);
      setActiveMarketIndicators((await getUserMarketIndicators()) || []);
      setAvailableIndicators((await getMarketIndicatorNames()) || []);
    } catch (err) {
      console.error("❌ loadAll error:", err);
      setError("Kon market data niet laden.");
    } finally {
      setLoading(false);
    }
  }

  /* --------------------------------------------------------
     LIVE BTC
  -------------------------------------------------------- */
  async function loadLiveBTC() {
    try {
      setBtcLive(await fetchLatestBTC());
    } catch {
      setBtcLive(null);
    }
  }

  /* --------------------------------------------------------
     SCORE RULES
  -------------------------------------------------------- */
  async function selectIndicator(indicatorObj) {
    if (!indicatorObj) return;

    setSelectedIndicator(indicatorObj);
    setScoreRules(
      (await getScoreRulesForMarketIndicator(indicatorObj.name)) || []
    );
  }

  /* --------------------------------------------------------
     ➕ ADD
  -------------------------------------------------------- */
  async function addMarket(indicatorName) {
    if (!indicatorName) return;

    if (activeMarketIndicatorNames.includes(indicatorName)) {
      showSnackbar("Indicator is al toegevoegd", "info");
      return;
    }

    try {
      await marketIndicatorAdd(indicatorName);
      await refreshActive();
      await refreshDay();

      showSnackbar("Market-indicator toegevoegd", "success");
    } catch (err) {
      console.error("❌ addMarket error:", err);
      showSnackbar("Toevoegen mislukt", "danger");
    }
  }

  /* --------------------------------------------------------
     ❌ REMOVE — MET CONFIRM MODAL
  -------------------------------------------------------- */
  function removeMarket(indicatorName) {
    if (!indicatorName) return;

    showConfirm({
      title: "Market-indicator verwijderen",
      description: (
        <p className="leading-relaxed">
          Weet je zeker dat je <strong>{indicatorName}</strong> wilt verwijderen?
          <br />
          <span className="text-red-600 font-medium">
            Dit kan niet ongedaan worden gemaakt.
          </span>
        </p>
      ),
      confirmText: "Verwijderen",
      cancelText: "Annuleren",
      tone: "danger",
      onConfirm: async () => {
        try {
          await marketIndicatorDelete(indicatorName);
          await refreshActive();
          await refreshDay();

          showSnackbar("Market-indicator verwijderd", "success");
        } catch (err) {
          console.error("❌ removeMarket error:", err);
          showSnackbar("Verwijderen mislukt", "danger");
        }
      },
    });
  }

  /* --------------------------------------------------------
     REFRESH HELPERS
  -------------------------------------------------------- */
  async function refreshDay() {
    setMarketDayData((await fetchMarketDayData()) || []);
  }

  async function refreshActive() {
    setActiveMarketIndicators((await getUserMarketIndicators()) || []);
  }

  /* --------------------------------------------------------
     EXPORT
  -------------------------------------------------------- */
  return {
    loading,
    error,

    btcLive,
    marketScore,
    advies,

    sevenDayData,
    forwardReturns,

    marketDayData,

    activeMarketIndicators,
    activeMarketIndicatorNames,

    addMarket,
    removeMarket,

    availableIndicators,
    selectedIndicator,
    scoreRules,
    selectIndicator,
  };
}
