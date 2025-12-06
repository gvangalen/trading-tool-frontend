"use client";

import { fetchWithAuth } from "@/lib/utils/fetchWithAuth";
import { API_BASE_URL } from "@/lib/config";

//
// =========================
// 🧠 INSIGHTS PER CATEGORIE
// =========================
//

// Iedere endpoint geeft terug: { insight: "..." }
export const fetchMacroInsight = async () => {
  const res = await fetchWithAuth(`/api/agents/insights/macro`, "GET");
  return res?.insight ?? null;
};

export const fetchMarketInsight = async () => {
  const res = await fetchWithAuth(`/api/agents/insights/market`, "GET");
  return res?.insight ?? null;
};

export const fetchTechnicalInsight = async () => {
  const res = await fetchWithAuth(`/api/agents/insights/technical`, "GET");
  return res?.insight ?? null;
};

export const fetchSetupInsight = async () => {
  const res = await fetchWithAuth(`/api/agents/insights/setup`, "GET");
  return res?.insight ?? null;
};

export const fetchStrategyInsight = async () => {
  const res = await fetchWithAuth(`/api/agents/insights/strategy`, "GET");
  return res?.insight ?? null;
};


//
// ============================
// 🪞 REFLECTIES PER CATEGORIE
// ============================
//

// Iedere endpoint geeft terug: { reflections: [] }
export const fetchMacroReflections = async () => {
  const res = await fetchWithAuth(`/api/agents/reflections/macro`, "GET");
  return res?.reflections ?? [];
};

export const fetchMarketReflections = async () => {
  const res = await fetchWithAuth(`/api/agents/reflections/market`, "GET");
  return res?.reflections ?? [];
};

export const fetchTechnicalReflections = async () => {
  const res = await fetchWithAuth(`/api/agents/reflections/technical`, "GET");
  return res?.reflections ?? [];
};

export const fetchSetupReflections = async () => {
  const res = await fetchWithAuth(`/api/agents/reflections/setup`, "GET");
  return res?.reflections ?? [];
};

export const fetchStrategyReflections = async () => {
  const res = await fetchWithAuth(`/api/agents/reflections/strategy`, "GET");
  return res?.reflections ?? [];
};
