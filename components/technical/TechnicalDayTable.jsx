'use client';

export default function TechnicalDayTable({ data = [], onRemove }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="p-4 text-center text-gray-500">
          Geen technische data beschikbaar.
        </td>
      </tr>
    );
  }

  // ✨ Helpers: zoek per indicator
  const getValue = (indicator) => {
    const item = data.find((d) => d.indicator === indicator);
    return {
      value: item?.waarde ?? '–',
      score: item?.score ?? '–',
      advies: item?.advies ?? '–',
      uitleg: item?.uitleg ?? '–',
      symbol: item?.symbol ?? '',
    };
  };

  // ✨ Hier definieer je welke indicators je in de tabel wilt
  const rows = [
    { label: 'RSI', ...getValue('RSI') },
    { label: 'Volume', ...getValue('Volume') },
    { label: '200MA', ...getValue('200MA') },
  ];

  return (
    <>
      {rows.map(({ label, value, score, advies, uitleg, symbol }) => {
        const scoreColor =
          score >= 2 ? 'text-green-600'
          : score <= -2 ? 'text-red-600'
          : 'text-gray-600';

        return (
          <tr key={label} className="border-t dark:border-gray-700">
            <td className="p-2 font-medium">{label}</td>
            <td className="p-2 text-center">{value}</td>
            <td className={`p-2 text-center font-bold ${scoreColor}`}>
              {score}
            </td>
            <td className="p-2 text-center">{advies}</td>
            <td className="p-2">{uitleg}</td>
            <td className="p-2 text-center">
              <button
                onClick={() => onRemove?.(symbol)}
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
