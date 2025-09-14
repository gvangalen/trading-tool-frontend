'use client';

export default function TechnicalWeekTable({ data = [], calculateScore }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          Geen technische data beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((item) => {
        const score = calculateScore?.(item) ?? 0;

        return (
          <tr key={item.id || item.symbol} className="border-b">
            <td className="p-2 font-medium">{item.symbol}</td>
            <td className="p-2 text-center">{item.rsi}</td>
            <td className="p-2 text-center">
              {(item.volume / 1e6).toFixed(1)}M
            </td>
            <td className="p-2 text-center">{item.price}</td>
            <td className="p-2 text-center">{item.ma_200}</td>
            <td className="p-2 text-center font-semibold">
              {score > 0 && <span className="text-green-600">+{score}</span>}
              {score < 0 && <span className="text-red-600">{score}</span>}
              {score === 0 && <span className="text-gray-600">0</span>}
            </td>
          </tr>
        );
      })}
    </>
  );
}
