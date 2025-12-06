// ===============================
// 🔐 fetchWithAuth.js (Correct voor jouw backend)
// ===============================

export async function fetchWithAuth(endpoint, method = 'GET', body = null) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",   // 🔥 DIT IS ALLES
  };

  if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status} - ${errorText}`);
  }

  return res.json();
}
