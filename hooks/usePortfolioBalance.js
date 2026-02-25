"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchPortfolioBalanceHistory } from "@/lib/api/botApi";

export default function usePortfolioBalance({
  bucket = "1h",
  limit = 300,
  autoLoad = true,
} = {}) {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPortfolioBalanceHistory({
        bucket,
        limit,
      });
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Portfolio history laden mislukt");
    } finally {
      setLoading(false);
    }
  }, [bucket, limit]);

  useEffect(() => {
    if (autoLoad) load();
  }, [load, autoLoad]);

  return {
    data,
    loading,
    error,
    reload: load,
  };
}
