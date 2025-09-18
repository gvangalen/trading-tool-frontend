'use client';

import { useState } from 'react';
import TechnicalTabs from '@/components/technical/TechnicalTabs';
import CardWrapper from '@/components/ui/CardWrapper';

// ✅ Lokale dummydata voor alle timeframes
const dummyData = [
  {
    indicator: 'RSI',
    waarde: 28.4,
    score: -3,
    advies: 'Bearish',
    uitleg: 'RSI onder 30 geeft oversold aan.',
    symbol: 'BTC',
  },
  {
    indicator: 'Volume',
    waarde: '8.2M',
    score: -2,
    advies: 'Bearish',
    uitleg: 'Volume is laag t.o.v. gemiddeld.',
    symbol: 'BTC',
  },
  {
    indicator: '200MA',
    waarde: 'Onder MA',
    score: -1,
    advies: 'Bearish',
    uitleg: 'Prijs zit onder 200-daags gemiddelde.',
    symbol: 'BTC',
  },
];

export default function TechnicalPage() {
  const [timeframe, setTimeframe] = useState('day'); // ✅ Engels

  // 🔧 Gebruik overal dezelfde dummydata (day/week/month/quarter)
  const dayData = dummyData;
  const weekData = dummyData;
  const monthData = dummyData;
  const quarterData = dummyData;

  const avgScore = -2;
  const advies = 'Bearish';

  const scoreColor = (score) => {
    const s = typeof score === 'number' ? score : parseFloat(score);
    if (isNaN(s)) return 'text-gray-600';
    if (s >= 1.5) return 'text-green-600';
    if (s <= -1.5) return 'text-red-600';
    return 'text-gray-600';
  };

  const deleteAsset = (symbol) => {
    console.log('🗑️ Simulatie: zou nu verwijderen', symbol);
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold">🧪 Technical Analysis</h1>

      <CardWrapper>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            📊 Technical Score:{' '}
            <span className={scoreColor(avgScore)}>{avgScore ?? 'N/A'}</span>
          </h3>
          <h3 className="text-lg font-semibold">
            🧠 Advice:{' '}
            <span className="text-blue-600">{advies}</span>
          </h3>
        </div>
      </CardWrapper>

      <TechnicalTabs
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        dayData={dayData}
        weekData={weekData}
        monthData={monthData}
        quarterData={quarterData}
        loading={false}
        error={''}
        onRemove={deleteAsset}
      />
    </div>
  );
}
