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

  /* ================= WALLET + WATCH ================= */

  useEffect(() => {
    if (!botId || !portfolio) return;

    setWatchLevels({
      breakout: decision?.watch_levels?.breakout_trigger ?? null,
      pullback: decision?.watch_levels?.pullback_zone ?? null,
    });

    const quoteBalance = Number(
      portfolio?.wallet?.quote_balance ??
      portfolio?.balances?.quote ??
      portfolio?.cash ??
      0
    );

    const baseBalance = Number(
      portfolio?.wallet?.base_balance ??
      portfolio?.balances?.base ??
      portfolio?.stats?.net_qty ??
      0
    );

    setBalanceQuote(quoteBalance);
    setBalanceBase(baseBalance);

  }, [botId, portfolio, decision]);

  /* ================= LOAD STRATEGY ================= */

  useEffect(() => {
    if (!decisionId) return;

    loadPlan();

  }, [decisionId]);

  async function loadPlan() {

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

  /* ================= PRICE POLLING ================= */

  useEffect(() => {

    if (!botId) return;

    loadPrice();

    const interval = setInterval(loadPrice, 60000);

    return () => clearInterval(interval);

  }, [botId]);

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

      if (!quantity || quantity <= 0) {
        throw new Error("Quantity is verplicht");
      }

      if (order.side === "buy" && valueEur > balanceQuote) {
        throw new Error("Onvoldoende EUR saldo");
      }

      if (order.side === "sell" && quantity > balanceBase) {
        throw new Error("Onvoldoende BTC");
      }

      await createManualOrder({
        bot_id: botId,
        symbol: "BTC",
        side: order.side,
        quantity: quantity,
        price: effectivePrice,
      });

      onManualTrade?.(order);

    } catch (err) {

      setError(err.message || "Order mislukt");

    } finally {

      setLoading(false);

    }

  }

  if (!price) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Marktprijs laden...
      </div>
    );
  }

  /* ================= UI ================= */

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
