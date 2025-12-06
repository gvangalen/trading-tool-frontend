// ===============================
// 🔐 fetchWithAuth.js
// ===============================
//
// Universele fetch-functie die ALTIJD:
// ✔ JWT access token meestuurt
// ✔ automatisch JSON verwerkt
// ✔ correcte headers zet
// ✔ foutafhandeling doet
//

export async function fetchWithAuth(endpoint, method = 'GET', body = null) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  // URL opbouw
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // Haal token op uit localStorage
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('access_token')
    : null;

  if (!token) {
    console.warn(`⚠️ Geen access_token gevonden voor fetchWithAuth(${url})`);
  }

  // Request options
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
  };

  // BODY toevoegen
  if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    options.body = JSON.stringify(body);
  }

  // Uitvoeren
  const res = await fetch(url, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}
