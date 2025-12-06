'use client';

import { fetchWithAuth } from '@/lib/utils/fetchWithAuth';
import { API_BASE_URL } from '@/lib/config';

//
// ========================================
// 🧠 1. Genereer AI-uitleg voor een setup
// ========================================
// Backend verwacht: { name, indicators, trend }
export const generateAIExplanation = ({ name, indicators, trend }) => {
  return fetchWithAuth(`/api/ai/explain_setup`, 'POST', {
    name,
    indicators,
    trend,
  });
};


//
// ========================================
// 🤖 2. Genereer AI-strategie van volledige setup
// ========================================
// Backend verwacht het volledige setup-object
export const generateAIStrategy = (setup) => {
  return fetchWithAuth(`/api/ai/strategy`, 'POST', setup);
};


//
// ========================================
// 📊 3. Haal AI-score op voor asset (default BTC)
// ========================================
export const fetchAIScore = (symbol = 'BTC') => {
  return fetchWithAuth(`/api/ai/score?symbol=${symbol}`, 'GET');
};
