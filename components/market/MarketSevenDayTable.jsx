'use client';

import CardWrapper from '@/components/ui/CardWrapper';
import { formatChange, formatNumber } from '@/components/market/utils';
import { useMemo } from 'react';

export default function MarketSevenDayTable({ history }) {
  const MAX_ROWS = 7;

  const rows = useMemo(() => {
    const today = new Date();
    const result = [];

    for (let i = 0; i < MAX_ROWS; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const isoDate = date.toISOString().slice(0, 10); // YYYY-MM-DD
      const formattedDate = date.toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: 'short',
      });

      const record = history?.find((d) => {
        return new Date(d.date).toISOString().slice(0, 10) === isoDate;
      });

      result.push({
        date: formattedDate,
        open: record?.open ?? null,
        high: record?.high ?? null,
        low: record?.low ?? null,
        close: record?.close ?? null,
        change: record?.change ?? null,
        volume: record?.volume ?? null,
      });
    }

    return result;
  }, [history]);

  return (
    <CardWrapper>
      <h2 className="text-lg font-semibold mb-2">📅 Laatste 7 dagen (Prijs & Volume)</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2 text-left">Datum</th>
              <th className="p-2 text-right">Open</th>
              <th className="p-2 text-right">Hoog</th>
              <th className="p-2 text-right">Laag</th>
              <th className="p-2 text-right">Sluit</th>
              <th className="p-2 text-right">% Dag</th>
              <th className="p-2 text-right">Volume</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((day, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{day.date}</td>
                <td className="p-2 text-right">
                  {typeof day.open === 'number' ? formatNumber(day.open) : '…'}
                </td>
                <td className="p-2 text-right">
                  {typeof day.high === 'number' ? formatNumber(day.high) : '…'}
                </td>
                <td className="p-2 text-right">
                  {typeof day.low === 'number' ? formatNumber(day.low) : '…'}
                </td>
                <td className="p-2 text-right">
                  {typeof day.close === 'number' ? formatNumber(day.close) : '…'}
                </td>
                <td className="p-2 text-right">
                  {typeof day.change === 'number' ? formatChange(day.change) : '…'}
                </td>
                <td className="p-2 text-right">
                  {typeof day.volume === 'number'
                    ? `$${(day.volume / 1e9).toFixed(1)}B`
                    : '…'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
