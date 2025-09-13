'use client';

export default function TechnicalWeekTable({
  data,
  getExplanation,
  calculateScore,
  onRemove = () => {}, // ✅ veilige fallback
}) {
  return (
    <div className="space-y-2 text-sm text-gray-600">
      <p className="text-gray-700">📈 Weekdata</p>

      <table className="w-full border text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Asset</th>
            <th>RSI</th>
            <th>Volume</th>
            <th>200MA</th>
            <th>Score</th>
            <th>Uitleg</th>
            <th>🗑️</th>
          </tr>
        </thead>
        <tbody>
          {data.map((asset) => {
            const score = calculateScore(asset);
            const scoreColor =
              score >= 2
                ? 'text-green-600'
                : score <= -2
                ? 'text-red-600'
                : 'text-gray-600';

            return (
              <tr key={asset.id} className="border-t">
                <td className="p-2 font-medium">{asset.symbol}</td>
                <td>{asset.rsi}</td>
                <td>{(asset.volume / 1e6).toFixed(1)}M</td>
                <td>{asset.ma_200}</td>
                <td className={`font-bold ${scoreColor}`}>{score}</td>
                <td>
                  <ul className="list-disc list-inside">
                    <li>{getExplanation('rsi')}</li>
                    <li>{getExplanation('volume')}</li>
                    <li>{getExplanation('ma_200')}</li>
                  </ul>
                </td>
                <td>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => onRemove(asset.id)}
                    title="Verwijderen"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
