'use client';
import { API_BASE_URL } from '@/config';
import { useCallback } from 'react';

export function useSafeFetch() {
  const safeFetch = useCallback(async (url, retries = 3) => {
    while (retries > 0) {
      try {
        const res = await fetch(`${API_BASE_URL}${url}`);
        if (!res.ok) throw new Error(`Fout bij ${url}`);
        const data = await res.json();
        if (!data || Object.keys(data).length === 0) throw new Error('Lege data');
        return data;
      } catch (err) {
        console.warn(`⏳ Retry bij ${url} (${retries})`);
        retries--;
        await new Promise(res => setTimeout(res, 2000));
      }
    }
    return null;
  }, []);

  return safeFetch;
}
