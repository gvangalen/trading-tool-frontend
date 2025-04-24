// ✅ useDashboardData.js — vervangt oude script.js
'use client';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';

// ✅ Helper voor fetch met retry
export async function safeFetch(url, retries = 3) {
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
}

// ✅ Hook voor live dashboarddata ophalen
export function useDashboardData() {
  const [marketData, setMarketData] = useState(null);
  const [macroData, setMacroData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const updateDashboardData = async () => {
      setLoading(true);
      const data = await safeFetch('/market_data');

      if (mounted) {
        setMarketData(data?.crypto || {});
        setMacroData({
          fear_greed_index: data?.fear_greed_index ?? 'N/A',
          dominance: data?.crypto?.bitcoin?.dominance?.toFixed(2) ?? 'N/A'
        });
        setLoading(false);
      }
    };

    updateDashboardData();
    const interval = setInterval(updateDashboardData, 60000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return { marketData, macroData, loading };
}

// ✅ Helpers (optioneel exporteren)
export function formatNumber(num) {
  return num >= 1e9 ? `${(num / 1e9).toFixed(2)}B`
    : num >= 1e6 ? `${(num / 1e6).toFixed(2)}M`
    : num?.toLocaleString() ?? '-';
}

export function setText(el, text) {
  if (!el) return;
  el.textContent = text;
  if (typeof text === 'string' && text.includes('%')) {
    el.style.color = text.includes('-') ? 'red' : 'green';
  }
}

export function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.color = 'red';
}  

// ✅ Macro toevoegen functie (kan later in aparte component)
export function addMacroRow(tableRef) {
  if (!tableRef?.current) return;
  const table = tableRef.current;
  const row = table.insertRow();
  row.innerHTML = `
    <td><input type="text" placeholder="Naam Indicator"></td>
    <td>Laden...</td>
    <td>N/A</td>
    <td>N/A</td>
    <td>N/A</td>
    <td><button class="btn-remove">❌</button></td>
  `;
  updateRemoveButtons();
}

export function updateRemoveButtons() {
  document.querySelectorAll(".btn-remove").forEach(button => {
    button.removeEventListener("click", removeRow);
    button.addEventListener("click", removeRow);
  });
}

export function removeRow(event) {
  event.target.closest("tr")?.remove();
}
