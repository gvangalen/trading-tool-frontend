export default function MarketSevenDayTable({ history }) {
  return (
    <div className="overflow-x-auto border rounded p-4 bg-white dark:bg-gray-900">
      <h2 className="text-lg font-semibold mb-2">📆 Laatste 7 dagen</h2>
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
          {history.map((day, idx) => {
            const color = day.change >= 0 ? 'text-green-600' : 'text-red-600';
            return (
              <tr key={idx} className="border-t">
                <td className="p-2">{day.date}</td>
                <td className="p-2">${day.open.toFixed(2)}</td>
                <td className="p-2">${day.high.toFixed(2)}</td>
                <td className="p-2">${day.low.toFixed(2)}</td>
                <td className="p-2">${day.close.toFixed(2)}</td>
                <td className={`p-2 ${color}`}>{day.change.toFixed(2)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
