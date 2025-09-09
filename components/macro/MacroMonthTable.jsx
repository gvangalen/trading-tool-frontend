'use client';

import { useMacroData } from '@/hooks/useMacroData';

export default function MacroMonthTable() {
  const { macroData } = useMacroData();

  return macroData.map((item) => (
    <tr key={item.name} className="border-t dark:border-gray-700">
      <td className="p-2 font-medium">{item.name}</td>
      <td className="p-2 text-gray-500">Gem. maandwaarde</td>
      <td className="p-2 italic text-gray-500">{item.trend?.trim() || '–'}</td>
      <td className="p-2 italic text-gray-500">{item.interpretation?.trim() || '–'}</td>
      <td className="p-2 italic text-gray-500">{item.action?.trim() || '–'}</td>
      <td className="p-2 text-center text-gray-400">–</td>
      <td className="p-2 text-center text-gray-400">–</td>
    </tr>
  ));
}
