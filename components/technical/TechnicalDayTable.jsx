'use client';

export default function TechnicalDayTable({
  data,
  calculateScore,
  onRemove,
}) {
  return (
    <tbody>
      {data.map((item) => {
        const score = calculateScore?.(item) ?? 0;
        const scoreColor =
          score >= 2 ? 'text-green-600'
          : score <= -2 ? 'text-red-600'
          : 'text-gray-600';

        return (
          <tr key={item.id || item.symbol} className="border-t dark:border-gray-700">
            <td className="p-2 font-medium">{item.symbol}</td>
            <td className="p-2 text-center">{item.rsi ?? '–'}</td>
            <td className="p-2 text-center">{item.volume ?? '–'}</td>
            <td className="p-2 text-center">{item.ma_200 ?? '–'}</td>
            <td className={`p-2 text-center font-bold ${scoreColor}`}>
              {score}
            </td>
            <td className="p-2 text-center">
              <button
                onClick={() => onRemove?.(item.symbol)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ❌
              </button>
            </td>
          </tr>
        );
      })}
      {data.length === 0 && (
        <tr>
          <td colSpan={6} className="p-4 text-center text-gray-500">
            Geen technische data beschikbaar.
          </td>
        </tr>
      )}
    </tbody>
  );
}
