import CardWrapper from '@/components/ui/CardWrapper';
import { formatChange } from '@/components/market/utils';

export default function MarketSevenDayTable({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-gray-500">📭 Geen historische data beschikbaar</p>;
  }

  return (
    <CardWrapper>
      <h2 className="text-lg font-semibold mb-2">📆 Laatste 7 dagen</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-2">Datum</th>
              <th className="p-2">Open</th>
              <th className="p-2">Hoog</th>
              <th className="p-2">Laag</th>
              <th className="p-2">Slot</th>
              <th className="p-2">% Verandering</th>
            </tr>
          </thead>
          <tbody>
            {history.map((day, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{day.date}</td>
                <td className="p-2">${day.open.toFixed(2)}</td>
                <td className="p-2">${day.high.toFixed(2)}</td>
                <td className="p-2">${day.low.toFixed(2)}</td>
                <td className="p-2">${day.close.toFixed(2)}</td>
                <td className="p-2">{formatChange(day.change)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  );
}
