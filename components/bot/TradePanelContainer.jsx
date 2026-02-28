"use client";

import { useEffect, useState, useCallback } from "react";
import TradePanel from "./TradePanel";

import {
  fetchBotToday,
  fetchBotPortfolios,
  fetchTradePlan,
  createManualOrder,
} from "@/lib/api/botApi";

import { fetchLatestBTC } from "@/lib/api/market";

export default function TradePanelContainer({ botId }) {
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(0);

  const [watchLevels, setWatchLevels] = useState({});
  const [strategy, setStrategy] = useState({});
  const [decisionId, setDecisionId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =====================================================
     LOAD INITIAL DATA
  ===================================================== */
  useEffect(() => {
    if (!botId) return;

    loadData();

    const interval = setInterval(loadPrice, 60000);
    return () => clearInterval(interval);
  }, [botId]);

  /* =====================================================
     LOAD BOT DATA
  ===================================================== */
  const loadData = useCallback(async () => {
    try {
      const today = await fetchBotToday();
      const portfolios = await fetchBotPortfolios();

      if (!today?.decisions?.length) return;

      const botDecision = today.decisions.find(
        (d) => d.bot_id === botId
      );

      if (!botDecision) return;

      setDecisionId(botDecision.id);

      setWatchLevels({
        breakout:
          botDecision?.watch_levels?.breakout_trigger ?? null,
        pullback:
          botDecision?.watch_levels?.pullback_zone ?? null,
        invalidate: null,
      });

      const plan = await fetchTradePlan(botDecision.id);

      setStrategy({
        stop_loss: plan?.stop_loss?.price ?? null,
        targets: Array.isArray(plan?.targets)
          ? plan.targets.map((t) => t.price)
          : [],
      });

      const botPortfolio = portfolios.find(
        (b) => b.bot_id === botId
      );

      if (botPortfolio) {
        setBalance(
          botPortfolio.cash_balance_eur ??
            botPortfolio?.budget?.available_eur ??
            botPortfolio?.budget?.total_eur ??
            0
        );
      }

      await loadPrice();
    } catch (err) {
      console.error("TradePanel loadData error:", err);
    }
  }, [botId]);

  /* =====================================================
     LOAD LIVE PRICE
  ===================================================== */
  const loadPrice = useCallback(async () => {
    try {
      const btc = await fetchLatestBTC();
      if (btc?.price) {
        setPrice(Number(btc.price));
      }
    } catch (err) {
      console.error("Price load error:", err);
    }
  }, []);

  /* =====================================================
     ORDER HANDLER (FULL UPGRADE)
  ===================================================== */
  async function handleOrder(order) {
    setError(null);

    try {
      setLoading(true);

      const isMarket = order.order_type === "market";

      const effectivePrice = isMarket
        ? price
        : Number(order.price);

      if (!effectivePrice || effectivePrice <= 0) {
        throw new Error("Ongeldige prijs");
      }

      let quantity = Number(order.quantity ?? 0);
      let valueEur = Number(order.value_eur ?? 0);

      // =====================================
      // EUR ↔ BTC AUTO CONVERSION
      // =====================================
      if (order.size_mode === "eur") {
        if (!valueEur || valueEur <= 0) {
          throw new Error("Ongeldige orderwaarde");
        }
        quantity = valueEur / effectivePrice;
      } else {
        if (!quantity || quantity <= 0) {
          throw new Error("Ongeldige hoeveelheid");
        }
        valueEur = quantity * effectivePrice;
      }

      // =====================================
      // FRONTEND BUDGET CHECK
      // =====================================
      if (valueEur > balance) {
        throw new Error("Onvoldoende budget");
      }

      // =====================================
      // BACKEND CALL
      // =====================================
      await createManualOrder({
        bot_id: botId,
        decision_id: decisionId,
        symbol: "BTC",
        side: order.side, // buy / sell
        order_type: order.order_type, // market / limit
        price: effectivePrice,
        quantity_btc: quantity,
        value_eur: valueEur,
      });

      await loadData();
    } catch (err) {
      console.error("Manual order error:", err);
      setError(err.message || "Order mislukt");
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     LOADING GUARD
  ===================================================== */
  if (!price) return null;

  return (
    <TradePanel
      price={price}
      balance={balance}
      watchLevels={watchLevels}
      strategy={strategy}
      decisionId={decisionId}
      loading={loading}
      error={error}
      onSubmit={handleOrder}
    />
  );
}
