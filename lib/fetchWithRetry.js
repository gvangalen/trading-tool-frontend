// lib/fetchWithRetry.js

/**
 * Universele fetch-functie met retries, foutafhandeling en validatie.
 */
export async function fetchWithRetry(url, options = {}, maxRetries = 3, delay = 2000) {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        throw new Error('❌ Lege of ongeldige response');
      }

      return data;
    } catch (err) {
      console.warn(`⚠️ Poging ${attempts + 1} mislukt voor ${url}: ${err.message}`);
      attempts++;
      if (attempts === maxRetries) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
} 
