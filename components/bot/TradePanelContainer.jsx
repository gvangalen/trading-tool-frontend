"use client";

import { useEffect, useState } from "react";
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

  // =========================================
  // LOAD INITIAL DATA
  // =========================================
  useEffect(() => {
    if (!botId) return;

    loadData();

    const interval = setInterval(loadPrice, 60000);
    return () => clearInterval(interval);
  }, [botId]);

  // =========================================
  // LOAD BOT + STRATEGY DATA
  // =========================================
  async function loadData() {
    try {
      const today = await fetchBotToday();
      const portfolios = await fetchBotPortfolios();

      if (!today?.decisions?.length) return;

      const botDecision = today.decisions.find(
        (d) => d.bot_id === botId
      );

      if (!botDecision) return;

      setDecisionId(botDecision.id);

      // =====================================================
      // 🧠 WATCH LEVELS (COMING FROM DECISION — NOT TRADE PLAN)
      // =====================================================
      setWatchLevels({
        breakout:
          botDecision?.watch_levels?.breakout_trigger ?? null,
        pullback:
          botDecision?.watch_levels?.pullback_zone ?? null,
        invalidate: null, // optional future use
      });

      // =====================================================
      // 📊 TRADE PLAN (EXECUTION STRUCTURE)
      // =====================================================
      const plan = await fetchTradePlan(botDecision.id);

      setStrategy({
        stop_loss: plan?.stop_loss?.price ?? null,
        targets: Array.isArray(plan?.targets)
          ? plan.targets.map((t) => t.price)
          : [],
      });

      // =====================================================
      // 💰 BALANCE (NEW PORTFOLIO STRUCTURE SAFE)
      // =====================================================
      const botPortfolio = portfolios.find(
        (b) => b.bot_id === botId
      );

      if (botPortfolio) {
        // prefer cash balance if exists
        setBalance(
          botPortfolio.cash_balance_eur ??
            botPortfolio?.budget?.total_eur ??
            0
        );
      }

      await loadPrice();
    } catch (err) {
      console.error("TradePanel loadData error:", err);
    }
  }

  // =========================================
  // LOAD LIVE PRICE
  // =========================================
  async function loadPrice() {
    try {
      const btc = await fetchLatestBTC();
      if (btc?.price) {
        setPrice(btc.price);
      }
    } catch (err) {
      console.error("Price load error:", err);
    }
  }

  // =========================================
  // MANUAL ORDER (FIXED PAYLOAD)
  // =========================================
  async function handleOrder(order) {
    try {
      await createManualOrder({
        bot_id: botId,
        symbol: "BTC",
        side: order.side,
        quantity: order.quantity,
        price: order.price,
      });

      await loadData();
    } catch (err) {
      console.error("Manual order error:", err);
    }
  }

  // =========================================
  // LOADING GUARD
  // =========================================
  if (!price) return null;

  return (
    <TradePanel
      price={price}
      balance={balance}
      watchLevels={watchLevels}
      strategy={strategy}
      decisionId={decisionId}
      onSubmit={handleOrder}
    />
  );
}
