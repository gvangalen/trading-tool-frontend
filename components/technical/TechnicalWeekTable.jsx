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

  const item = data[0]; // Alleen BTC
  const indicators = [
    {
      name: 'RSI',
      value: item.rsi,
      score: calculateScore?.({ ...item, rsi: item.rsi }) ?? 0,
      advice:
        item.rsi < 30 ? '🟢 Oversold' :
        item.rsi > 70 ? '🔴 Overbought' :
        '⚖️ Neutraal',
    },
    {
      name: 'Volume',
      value: (item.volume / 1e6).toFixed(1) + 'M',
      score: item.volume > 500_000_000 ? 1 : 0,
      advice: item.volume > 500_000_000 ? '🔼 Hoog' : '🔽 Laag',
    },
    {
      name: '200MA',
      value: item.price > item.ma_200 ? 'Boven MA' : 'Onder MA',
      score: item.price > item.ma_200 ? 1 : -1,
      advice: item.price > item.ma_200 ? '✅ Bullish' : '⚠️ Bearish',
    },
  ];

  return (
    <>
      {indicators.map((indicator) => {
        const scoreColor =
          indicator.score >= 2 ? 'text-green-600'
          : indicator.score <= -2 ? 'text-red-600'
          : 'text-gray-600';

        return (
          <tr key={indicator.name} className="border-t dark:border-gray-700">
            <td className="p-2 font-medium">{indicator.name}</td>
            <td className="p-2 text-center">{indicator.value}</td>
            <td className={`p-2 text-center font-bold ${scoreColor}`}>
              {indicator.score}
            </td>
            <td className="p-2 text-center">{indicator.advice}</td>
          </tr>
        );
      })}
    </>
  );
}
