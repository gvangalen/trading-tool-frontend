'use client';

export default function TechnicalQuarterTable({ data }) {
  return (
    <div className="space-y-2 text-sm text-gray-600">
      <p className="text-gray-700">📉 Kwartaaldata (nog geen filters)</p>
      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Asset</th>
            <th>RSI</th>
            <th>Volume</th>
            <th>200MA</th>
            <th>Score</th>
            <th>Advies</th>
          </tr>
        </thead>
        <tbody>
          {data.map((asset) => {
            const score = asset._score;
            const trend =
              score >= 1.5
                ? '🟢 Bullish'
                : score <= -1.5
                ? '🔴 Bearish'
                : '⚖️ Neutraal';
            const scoreColor =
              score >= 2
                ? 'text-green-600'
                : score <= -2
                ? 'text-red-600'
                : 'text-gray-600';

            return (
              <tr key={asset.id} className="border-t">
                <td className="p-2">{asset.symbol}</td>
                <td>{asset.rsi}</td>
                <td>{(asset.volume / 1e6).toFixed(1)}M</td>
                <td>{asset.ma_200}</td>
                <td className={`font-bold ${scoreColor}`}>{score}</td>
                <td>{trend}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
