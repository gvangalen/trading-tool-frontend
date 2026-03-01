"use client";

import { useEffect, useState } from "react";
import TradePanel from "./TradePanel";
import { fetchTradePlan, createManualOrder } from "@/lib/api/botApi";
import { fetchLatestBTC } from "@/lib/api/market";

export default function TradePanelContainer({
  bot,
  decision,
  portfolio,
  onManualTrade,
}) {
  const botId = bot?.id;
  const decisionId = decision?.id;

  const [price, setPrice] = useState(null);
  const [balanceQuote, setBalanceQuote] = useState(0);
  const [balanceBase, setBalanceBase] = useState(0);

  const [watchLevels, setWatchLevels] = useState({});
  const [strategy, setStrategy] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= LOAD ================= */

  useEffect(() => {
    if (!botId || !portfolio) return;

    setWatchLevels({
      breakout: decision?.watch_levels?.breakout_trigger ?? null,
      pullback: decision?.watch_levels?.pullback_zone ?? null,
    });

    /* ================= BUDGET BEREKENING (MANUAL) ================= */

    const totalBudget = Number(portfolio?.budget?.total_eur ?? 0);
    const dailyLimit = Number(portfolio?.budget?.daily_limit_eur ?? 0);

    const invested =
      Number(portfolio?.stats?.invested_eur ?? 0);

    const spentToday =
      Number(portfolio?.stats?.spent_today_eur ?? 0);

    const remainingTotal = Math.max(totalBudget - invested, 0);
    const remainingDaily = Math.max(dailyLimit - spentToday, 0);

    const availableManual =
      dailyLimit > 0
        ? Math.min(remainingTotal, remainingDaily)
        : remainingTotal;

    setBalanceQuote(availableManual);

    setBalanceBase(Number(portfolio?.btc_balance ?? 0));

    loadPlan();
    loadPrice();

    const interval = setInterval(loadPrice, 60000);
    return () => clearInterval(interval);
  }, [botId, decision, portfolio]);

  async function loadPlan() {
    if (!decisionId) return;

    try {
      const plan = await fetchTradePlan(decisionId);

      setStrategy({
        stop_loss: plan?.stop_loss?.price ?? null,
        targets: Array.isArray(plan?.targets)
          ? plan.targets.map((t) => t.price)
          : [],
      });
    } catch (err) {
      console.error("Plan load error:", err);
    }
  }

  async function loadPrice() {
    try {
      const btc = await fetchLatestBTC();
      if (btc?.price) {
        setPrice(Number(btc.price));
      }
    } catch (err) {
      console.error("Price load error:", err);
    }
  }

  /* ================= ORDER ================= */

  async function handleOrder(order) {
    setError(null);

    try {
      setLoading(true);

      const effectivePrice =
        order.orderType === "market"
          ? price
          : Number(order.price);

      let quantity = Number(order.quantity ?? 0);
      let valueEur = Number(order.value_eur ?? 0);

      if (order.size_mode === "quote") {
        quantity = valueEur / effectivePrice;
      } else {
        valueEur = quantity * effectivePrice;
      }

      if (order.side === "buy" && valueEur > balanceQuote) {
        throw new Error("Onvoldoende budget");
      }

      if (order.side === "sell" && quantity > balanceBase) {
        throw new Error("Onvoldoende BTC");
      }

      await createManualOrder({
        bot_id: botId,
        decision_id: decisionId,
        symbol: "BTC",
        side: order.side,
        order_type: order.orderType,
        price: effectivePrice,
        quantity_btc: quantity,
        value_eur: valueEur,
      });

      onManualTrade?.(order);
    } catch (err) {
      setError(err.message || "Order mislukt");
    } finally {
      setLoading(false);
    }
  }

  if (!price) return null;

  return (
    <TradePanel
      price={price}
      balanceQuote={balanceQuote}
      balanceBase={balanceBase}
      quoteSymbol="EUR"
      baseSymbol="BTC"
      watchLevels={watchLevels}
      strategy={strategy}
      loading={loading}
      error={error}
      onSubmit={handleOrder}
    />
  );
}
