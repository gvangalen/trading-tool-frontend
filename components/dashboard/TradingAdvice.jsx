'use client';

import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/lib/config';

export default function TradingAdvice() {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('BTC');

  useEffect(() => {
    fetchAdvice(symbol);
    const select = document.getElementById('symbolSelect');
    if (select) {
      select.addEventListener('change', handleSymbolChange);
    }
    return () => {
      if (select) select.removeEventListener('change', handleSymbolChange);
    };
  }, []);

  async function handleSymbolChange(e) {
    const selected = e.target.value;
    setSymbol(selected);
    await fetchAdvice(selected);
  }

  async function fetchAdvice(sym) {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/trading_advice?symbol=${sym}`);
      const data = await res.json();
      setAdvice(data);
    } catch (err) {
      console.error('❌ Fout bij ophalen tradingadvies:', err);
      setAdvice(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="advice-card neutral">📡 Advies wordt geladen...</div>;
  }

  if (!advice || advice.error) {
    return <div className="advice-card neutral">❌ Geen advies beschikbaar voor {symbol}</div>;
  }

  const trendClass =
    advice.trend === 'Bullish'
      ? 'bullish'
      : advice.trend === 'Bearish'
      ? 'bearish'
      : 'neutral';

  const assetName = symbol === 'SOL' ? 'Solana' : 'Bitcoin';

  return (
    <div className={`advice-card ${trendClass}`} id="tradingAdviceBox">
      <h3 className="text-lg font-semibold">🚀 Actueel Tradingadvies ({assetName})</h3>
      <p><strong>📋 Setup:</strong> {advice.setup ?? '-'}</p>
      <p><strong>📈 Trend:</strong> {advice.trend ?? '-'}</p>
      <p><strong>🎯 Entry:</strong> ${Number(advice.entry ?? 0).toFixed(2)}</p>
      <p>
        <strong>🎯 Targets:</strong>{' '}
        {Array.isArray(advice.targets) ? advice.targets.map(t => `$${t}`).join(' / ') : '-'}
      </p>
      <p><strong>🛑 Stop-loss:</strong> {advice.stop_loss ?? '-'}</p>
      <p><strong>⚠️ Risico:</strong> {advice.risico ?? '-'}</p>
      {advice.reden && (
        <p className="text-sm text-gray-500 italic">{advice.reden}</p>
      )}
    </div>
  );
}
