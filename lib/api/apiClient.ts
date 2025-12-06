//----------------------------------------------------------
//  GLOBAL API CLIENT
//  - Stuurt cookies mee via credentials: "include"
//  - Injecteert automatisch user_id in elke request
//----------------------------------------------------------

import { getCurrentUserId } from "./user";   // ✅ ENIGE juiste import

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002";

//----------------------------------------------------------
// 🆔 Helper: user_id toevoegen aan URL
//----------------------------------------------------------
function withUserId(path: string): string {
  const userId = getCurrentUserId();

  if (!userId) return path;

  const sep = path.includes("?") ? "&" : "?";
  if (path.includes("user_id=")) return path;

  return `${path}${sep}user_id=${userId}`;
}

//----------------------------------------------------------
// 🛠️ body verrijken met user_id
//----------------------------------------------------------
function attachUserIdToBody(body: any): any {
  const userId = getCurrentUserId();
  if (!userId) return body || {};

  return { ...(body || {}), user_id: userId };
}

//----------------------------------------------------------
// 📡 GET
//----------------------------------------------------------
export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${withUserId(path)}`;

  const res = await fetch(url, {
    ...init,
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
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
  body: any,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${withUserId(path)}`;
  const payload = attachUserIdToBody(body);

  const res = await fetch(url, {
    ...init,
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify(payload),
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
  body: any,
  init?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${withUserId(path)}`;
  const payload = attachUserIdToBody(body);

  const res = await fetch(url, {
    ...init,
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify(payload),
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
  const url = `${API_BASE_URL}${withUserId(path)}`;

  const res = await fetch(url, {
    ...init,
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
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
