import { fetchAuth } from "./apiClient";

/**
 * Market Intelligence ophalen
 * (Bot Brain output)
 */
export async function fetchMarketIntelligence() {

  const res = await fetchAuth("/api/market/intelligence");

  if (!res.ok) {
    throw new Error("Failed to load market intelligence");
  }

  return res.json();
}
