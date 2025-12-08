//----------------------------------------------------------
//  GLOBAL API CLIENT — 100% Bearer JWT AUTH
//----------------------------------------------------------

import { loadAccessToken } from "@/lib/api/auth"; // token loader

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002";

//----------------------------------------------------------
// 🔧 Helper: Authorization header toevoegen
//----------------------------------------------------------

function authHeaders(init?: RequestInit) {
  const token = loadAccessToken();

  return {
    "Content-Type": "application/json",
    ...(init?.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

//----------------------------------------------------------
// 📡 GET
//----------------------------------------------------------

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    method: "GET",
    headers: authHeaders(init),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`❌ API GET ${url} failed:`, res.status, text);
    throw new Error(`API GET failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

//----------------------------------------------------------
// 📡 POST
//----------------------------------------------------------

export async function apiPost<T>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    method: "POST",
    headers: authHeaders(init),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`❌ API POST ${url} failed:`, res.status, text);
    throw new Error(`API POST failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

//----------------------------------------------------------
// 📡 PUT
//----------------------------------------------------------

export async function apiPut<T>(
  path: string,
  body?: any,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    method: "PUT",
    headers: authHeaders(init),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`❌ API PUT ${url} failed:`, res.status, text);
    throw new Error(`API PUT failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

//----------------------------------------------------------
// 📡 DELETE
//----------------------------------------------------------

export async function apiDelete<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    method: "DELETE",
    headers: authHeaders(init),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`❌ API DELETE ${url} failed:`, res.status, text);
    throw new Error(`API DELETE failed (${res.status})`);
  }

  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}
