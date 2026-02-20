"use client";

import { useEffect, useState } from "react";
import TradePanel from "./TradePanel";

import {
  fetchBotToday,
  fetchBotPortfolios,
  fetchTradePlan,
  createManualOrder,
} from "@/lib/api/bot";

export default function TradePanelContainer({ botId }) {
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(0);
  const [watchLevels, setWatchLevels] = useState({});
  const [strategy, setStrategy] = useState({});
  const [decisionId, setDecisionId] = useState(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadPrice, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    const today = await fetchBotToday();
    const portfolios = await fetchBotPortfolios();

    const botDecision = today.decisions.find(
      (d) => d.bot_id === botId
    );

    if (!botDecision) return;

    setDecisionId(botDecision.id);

    // watch levels uit trade plan / decision
    setWatchLevels({
      breakout: botDecision.trade_plan?.breakout,
      pullback: botDecision.trade_plan?.pullback,
      invalidate: botDecision.trade_plan?.invalidate,
    });

    const plan = await fetchTradePlan(botDecision.id);

    setStrategy({
      stop_loss: plan.stop_loss?.price,
      targets: plan.targets?.map((t) => t.price),
    });

    const botPortfolio = portfolios.find(
      (b) => b.bot_id === botId
    );

    if (botPortfolio) {
      setBalance(botPortfolio.budget.total_eur);
    }

    await loadPrice();
  }

  async function loadPrice() {
    try {
      const res = await fetch("/api/market/price?symbol=BTC");
      const data = await res.json();
      setPrice(data.price);
    } catch {}
  }

  async function handleOrder(order) {
    await createManualOrder({
      bot_id: botId,
      symbol: "BTC",
      side: order.side,
      quantity: order.quantity,
      price: order.price,
    });

    loadData();
  }

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
