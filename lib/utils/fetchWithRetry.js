// ✅ Universele fetch met retries + foutafhandeling + logging en ondersteuning voor baseURL
export async function fetchWithRetry(endpoint, method = 'GET', body = null, retries = 3, delay = 2000) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // 🚨 Waarschuwing als endpoint geen /api bevat (mogelijke fout)
  if (!endpoint.startsWith('/api/') && !endpoint.startsWith('http')) {
    console.warn(`⚠️ Mogelijk fout endpoint zonder '/api/': '${endpoint}' ➝ resultaat URL: '${url}'`);
  }

  let attempts = 0;
  while (attempts < retries) {
    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        options.body = JSON.stringify(body);
        console.log(`🔍 [fetchWithRetry] ${method.toUpperCase()} ${url}`);
        console.log("📦 Body:", body);
      } else {
        console.log(`🔍 [fetchWithRetry] ${method.toUpperCase()} ${url} (geen body)`);
      }

      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      // ✅ Alleen null of undefined wordt als fout beschouwd — leeg object mag gewoon
      if (data === null || data === undefined) {
        throw new Error('❌ Geen data ontvangen');
      }

      return data;
    } catch (err) {
      console.warn(`⚠️ Poging ${attempts + 1} mislukt voor ${url}: ${err.message}`);
      attempts++;
      if (attempts === retries) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}
