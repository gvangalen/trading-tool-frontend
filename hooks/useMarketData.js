"use client";

import { useEffect, useMemo, useState } from "react";
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
  score >= 75 ? "🟢 Bullish" : score <= 25 ? "🔴 Bearish" : "⚖️ Neutraal";

/* ========================================================
   MAIN HOOK — MARKET (IDENTIEK AAN MACRO / TECHNICAL)
======================================================== */
export function useMarketData() {
  const { openConfirm, showSnackbar } = useModal();

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
  const [activeMarketIndicators, setActiveMarketIndicators] = useState([]);

  // ✅ business-key lijst (name)
  const activeMarketIndicatorNames = useMemo(
    () =>
      (activeMarketIndicators || [])
        .map((i) => i?.name)
        .filter(Boolean),
    [activeMarketIndicators]
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
     LOAD ALL
  -------------------------------------------------------- */
  async function loadAll() {
    setLoading(true);
    setError("");

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
    if (!indicatorObj?.name) return;

    setSelectedIndicator(indicatorObj);
    try {
      const rules = await getScoreRulesForMarketIndicator(indicatorObj.name);
      setScoreRules(rules || []);
    } catch (e) {
      console.error("❌ score rules error:", e);
      setScoreRules([]);
      showSnackbar("Kon scoreregels niet ophalen", "danger");
    }
  }

  /* --------------------------------------------------------
     REFRESH HELPERS (🔥 force reset)
  -------------------------------------------------------- */
  async function refreshDay() {
    const fresh = (await fetchMarketDayData()) || [];
    setMarketDayData([]);       // 🔥 belangrijk
    setMarketDayData(fresh);
  }

  async function refreshActive() {
    const fresh = (await getUserMarketIndicators()) || [];
    setActiveMarketIndicators([]);
    setActiveMarketIndicators(fresh);
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
     ❌ DELETE — OP NAAM (IDENTIEK AAN MACRO)
  -------------------------------------------------------- */
  function removeMarket(indicatorName) {
    if (!indicatorName) return;

    openConfirm({
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
          // ✅ encode → veilige route
          await marketIndicatorDelete(
            encodeURIComponent(indicatorName)
          );
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
