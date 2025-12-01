import { fetchWithRetry } from "@/lib/utils/fetchWithRetry";
import { API_BASE_URL } from "@/lib/config";

//
// =========================
// 🧠 INSIGHTS PER CATEGORIE
// =========================
//

export const fetchMacroInsight = async () => {
  const url = `${API_BASE_URL}/api/agents/insights/macro`;
  return (await fetchWithRetry(url, "GET"))?.insight || null;
};

export const fetchMarketInsight = async () => {
  const url = `${API_BASE_URL}/api/agents/insights/market`;
  return (await fetchWithRetry(url, "GET"))?.insight || null;
};

export const fetchTechnicalInsight = async () => {
  const url = `${API_BASE_URL}/api/agents/insights/technical`;
  return (await fetchWithRetry(url, "GET"))?.insight || null;
};

export const fetchSetupInsight = async () => {
  const url = `${API_BASE_URL}/api/agents/insights/setup`;
  return (await fetchWithRetry(url, "GET"))?.insight || null;
};

export const fetchStrategyInsight = async () => {
  const url = `${API_BASE_URL}/api/agents/insights/strategy`;
  return (await fetchWithRetry(url, "GET"))?.insight || null;
};

//
// ============================
// 🪞 REFLECTIES PER CATEGORIE
// ============================
//

export const fetchMacroReflections = async () => {
  const url = `${API_BASE_URL}/api/agents/reflections/macro`;
  return (await fetchWithRetry(url, "GET"))?.reflections || [];
};

export const fetchMarketReflections = async () => {
  const url = `${API_BASE_URL}/api/agents/reflections/market`;
  return (await fetchWithRetry(url, "GET"))?.reflections || [];
};

export const fetchTechnicalReflections = async () => {
  const url = `${API_BASE_URL}/api/agents/reflections/technical`;
  return (await fetchWithRetry(url, "GET"))?.reflections || [];
};

export const fetchSetupReflections = async () => {
  const url = `${API_BASE_URL}/api/agents/reflections/setup`;
  return (await fetchWithRetry(url, "GET"))?.reflections || [];
};

export const fetchStrategyReflections = async () => {
  const url = `${API_BASE_URL}/api/agents/reflections/strategy`;
  return (await fetchWithRetry(url, "GET"))?.reflections || [];
};
