"use client";

import { useEffect, useState } from "react";
import TradePanel from "./TradePanel";

import {
  fetchBotToday,
  fetchBotPortfolios,
  fetchTradePlan,
  createManualOrder,
} from "@/lib/api/bot";

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
    loadData();

    // refresh price elke minuut (ruim voldoende)
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

      // ===============================
      // WATCH LEVELS
      // ===============================
      const plan = await fetchTradePlan(botDecision.id);

      setWatchLevels({
        breakout: plan?.entry_plan?.breakout ?? null,
        pullback: plan?.entry_plan?.pullback ?? null,
        invalidate: plan?.stop_loss?.price ?? null,
      });

      // ===============================
      // STRATEGY
      // ===============================
      setStrategy({
        stop_loss: plan?.stop_loss?.price ?? null,
        targets: plan?.targets?.map((t) => t.price) || [],
      });

      // ===============================
      // BALANCE
      // ===============================
      const botPortfolio = portfolios.find(
        (b) => b.bot_id === botId
      );

      if (botPortfolio) {
        setBalance(botPortfolio.budget.total_eur || 0);
      }

      await loadPrice();
    } catch (err) {
      console.error("TradePanel loadData error:", err);
    }
  }

  // =========================================
  // LOAD LIVE PRICE (market_data)
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
  // MANUAL ORDER
  // =========================================
  async function handleOrder(order) {
    try {
      await createManualOrder({
        bot_id: botId,
        symbol: "BTC",
        side: order.side,
        order_type: order.orderType,
        quantity: order.quantity,
        limit_price: order.price,
      });

      await loadData();
    } catch (err) {
      console.error("Manual order error:", err);
    }
  }

  // =========================================
  // LOADING STATE
  // =========================================
  if (!price) return null;

  return (
    <TradePanel
      price={price}
      balance={balance}
      watchLevels={watchLevels}
      strategy={strategy}
      onSubmit={handleOrder}
    />
  );
}
