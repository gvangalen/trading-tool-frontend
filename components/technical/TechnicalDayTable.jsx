'use client';

export default function TechnicalDayTable({ data = [], calculateScore, onRemove }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={4} className="p-4 text-center text-gray-500">
          Geen technische data beschikbaar.
        </td>
      </tr>
    );
  }

  const item = data[0]; // ✅ Alleen BTC gebruiken

  const rows = [
    { label: 'RSI', value: item.rsi },
    { label: 'Volume', value: item.volume },
    { label: '200MA', value: item.ma_200 },
  ];

  return (
    <>
      {rows.map(({ label, value }) => {
        const score = calculateScore?.({ ...item, type: label.toLowerCase() }) ?? 0;
        const scoreColor =
          score >= 2 ? 'text-green-600'
          : score <= -2 ? 'text-red-600'
          : 'text-gray-600';

        return (
          <tr key={label} className="border-t dark:border-gray-700">
            <td className="p-2 font-medium">{label}</td>
            <td className="p-2 text-center">{value ?? '–'}</td>
            <td className={`p-2 text-center font-bold ${scoreColor}`}>{score}</td>
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
    </>
  );
}
