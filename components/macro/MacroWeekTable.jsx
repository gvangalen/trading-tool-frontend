'use client';

export default function MacroWeekTable({ data }) {
  return (
    <tbody>
      {data.map((item) => (
        <tr key={item.name} className="border-t dark:border-gray-700">
          <td className="p-2 font-medium">{item.name}</td>
          <td className="p-2 text-gray-500">Gem. weekwaarde</td>
          <td className="p-2 italic text-gray-500">{item.trend ?? '–'}</td>
          <td className="p-2 italic text-gray-500">{item.interpretation ?? '–'}</td>
          <td className="p-2 italic text-gray-500">{item.action ?? '–'}</td>
          <td className="p-2">–</td>
          <td className="p-2">–</td>
        </tr>
      ))}
    </tbody>
  );
}
