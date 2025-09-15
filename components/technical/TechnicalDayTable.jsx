'use client';

export default function TechnicalDayTable({ data = [], onRemove }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="p-4 text-center text-gray-500">
          Geen technische data beschikbaar.
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((item, index) => {
        const scoreColor =
          item.score >= 2 ? 'text-green-600'
          : item.score <= -2 ? 'text-red-600'
          : 'text-gray-600';

        return (
          <tr key={index} className="border-t dark:border-gray-700">
            <td className="p-2 font-medium">{item.indicator}</td>
            <td className="p-2 text-center">{item.waarde ?? '–'}</td>
            <td className={`p-2 text-center font-bold ${scoreColor}`}>
              {item.score ?? '–'}
            </td>
            <td className="p-2 text-center">{item.advies ?? '–'}</td>
            <td className="p-2">{item.uitleg ?? '–'}</td>
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
