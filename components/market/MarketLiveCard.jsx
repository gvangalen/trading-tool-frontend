"use client";

import { useEffect, useState } from "react";
import CardWrapper from "@/components/ui/CardWrapper";
import { formatChange, formatNumber } from "@/components/market/utils";
import { fetchLatestBTC } from "@/lib/api/market";

// Lucide icons
import {
  Bitcoin,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Loader2,
  Clock,
} from "lucide-react";

export default function MarketLiveCard() {
  const [btc, setBtc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchLatestBTC();
      setBtc(data);
      setError("");
    } catch (err) {
      console.error("❌ Fout bij ophalen BTC:", err);
      setError("Fout bij ophalen BTC-data");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // LOADING
  // -------------------------
  if (loading) {
    return (
      <CardWrapper>
        <div className="flex items-center gap-2 p-5 text-[var(--text-light)]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>BTC-data laden…</span>
        </div>
      </CardWrapper>
    );
  }

  // -------------------------
  // ERROR
  // -------------------------
  if (error || !btc) {
    return (
      <CardWrapper>
        <div className="p-5 text-red-600 dark:text-red-400">
          <p className="font-medium flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            {error || "Geen BTC data beschikbaar"}
          </p>
        </div>
      </CardWrapper>
    );
  }

  // -------------------------
  // PRICE COLOR
  // -------------------------
  const priceChange = btc.change_24h || 0;
  const positive = priceChange >= 0;

  const changeColor = positive
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";

  const ChangeIcon = positive ? TrendingUp : TrendingDown;

  return (
    <CardWrapper
      title={
        <div className="flex items-center gap-2">
          <Bitcoin className="w-4 h-4" />
          Live BTC Prijs
        </div>
      }
    >
      <div className="space-y-4 p-1">

        {/* PRICE */}
        <div>
          <p className="text-4xl font-mono font-bold tracking-tight">
            {formatNumber(btc.price, true)}
          </p>

          {/* Change */}
          <div className={`flex items-center gap-1 mt-1 text-sm ${changeColor}`}>
            <ChangeIcon className="w-4 h-4" />
            {formatChange(priceChange)}
          </div>
        </div>

        {/* EXTRA INFO */}
        <div className="space-y-1 text-sm text-[var(--text-light)]">
          <p className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--text-light)]" />
            Volume: {formatNumber(btc.volume)}
          </p>

          <p className="flex items-center gap-2 text-xs mt-1">
            <Clock className="w-4 h-4 text-[var(--text-light)]" />
            Laatste update:{" "}
            {btc.timestamp
              ? new Date(btc.timestamp).toLocaleTimeString()
              : "–"}
          </p>
        </div>
      </div>
    </CardWrapper>
  );
}
