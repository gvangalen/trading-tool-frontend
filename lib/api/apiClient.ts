// frontend/lib/apiClient.ts
import { getCurrentUserId } from "./user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002";

function withUserId(path: string): string {
  const userId = getCurrentUserId();
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}user_id=${userId}`;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${withUserId(path)}`;
  const res = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`GET ${url} failed:`, res.status, text);
    throw new Error(`API GET failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: any, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${withUserId(path)}`;
  const userId = getCurrentUserId();

  const payload = {
    ...body,
    user_id: userId, // ✅ ook in body meesturen (voor backend die body leest)
  };

  const res = await fetch(url, {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`POST ${url} failed:`, res.status, text);
    throw new Error(`API POST failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export async function apiPut<T>(path: string, body: any, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${withUserId(path)}`;
  const userId = getCurrentUserId();

  const payload = {
    ...body,
    user_id: userId,
  };

  const res = await fetch(url, {
    ...init,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`PUT ${url} failed:`, res.status, text);
    throw new Error(`API PUT failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${withUserId(path)}`;

  const res = await fetch(url, {
    ...init,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`DELETE ${url} failed:`, res.status, text);
    throw new Error(`API DELETE failed (${res.status})`);
  }

  // sommige delete-routes hebben geen JSON
  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}
