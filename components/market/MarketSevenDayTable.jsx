'use client';

import CardWrapper from '@/components/ui/CardWrapper';
import { formatChange, formatNumber } from '@/components/market/utils';
import { useMemo } from 'react';

export default function MarketSevenDayTable({ history }) {
  const today = new Date();
  const MAX_ROWS = 7;

  // ⚙️ Genereer altijd 7 rijen met fallback
  const rows = useMemo(() => {
    const data = [];

    for (let i = 0; i < MAX_ROWS; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const formattedDate = date.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: 'short',
      });

      const record = history?.find(
        (d) => new Date(d.date).toDateString() === date.toDateString()
      );

      data.push({
        date: formattedDate,
        open: record?.open ?? '…',
        high: record?.high ?? '…',
        low: record?.low ?? '…',
        close: record?.close ?? '…',
        change: record?.change ?? '…',
        volume: record?.volume ?? '…',
      });
    }

    return data;
  }, [history]);

  return (
    <CardWrapper>
      <h2 className="text-lg font-semibold mb-2">🔷 2. Tabel: Laatste 7 dagen (Price Overview)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2">Datum</th>
              <th className="p-2">Open</th>
              <th className="p-2">Hoog</th>
              <th className="p-2">Laag</th>
              <th className="p-2">Sluit</th>
              <th className="p-2">% Dag</th>
              <th className="p-2">Volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((day, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{day.date}</td>
                <td className="p-2">
                  {typeof day.open === 'number' ? formatNumber(day.open) : '…'}
                </td>
                <td className="p-2">
                  {typeof day.high === 'number' ? formatNumber(day.high) : '…'}
                </td>
                <td className="p-2">
                  {typeof day.low === 'number' ? formatNumber(day.low) : '…'}
                </td>
                <td className="p-2">
                  {typeof day.close === 'number' ? formatNumber(day.close) : '…'}
                </td>
                <td className="p-2">
                  {typeof day.change === 'number' ? formatChange(day.change) : '…'}
                </td>
                <td className="p-2">
                  {typeof day.volume === 'number'
                    ? `$${(day.volume / 1e9).toFixed(1)}B`
                    : '…'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Slottekst */}
      <p className="text-sm text-green-700 mt-3">✅ We tonen 7 rijen met de 7 meest recente dagen</p>
    </CardWrapper>
  );
}
