'use client';

import { useState } from 'react';
import TechnicalTabs from '@/components/technical/TechnicalTabs';
import CardWrapper from '@/components/ui/CardWrapper';

const dayData = [
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

const weekData = [
  {
    indicator: 'RSI (Week)',
    waarde: 65.2,
    score: 2,
    advies: 'Bullish',
    uitleg: 'RSI boven 60 wijst op kracht.',
    symbol: 'BTC',
  },
  {
    indicator: 'Volume (Week)',
    waarde: '12.4M',
    score: 1,
    advies: 'Neutraal',
    uitleg: 'Volume gemiddeld op weekbasis.',
    symbol: 'BTC',
  },
  {
    indicator: '200MA (Week)',
    waarde: 'Boven MA',
    score: 2,
    advies: 'Bullish',
    uitleg: 'Prijs boven 200-week MA.',
    symbol: 'BTC',
  },
];

const monthData = dayData;     // Voor nu dezelfde
const quarterData = dayData;   // Voor nu dezelfde

export default function TechnicalPage() {
  const [timeframe, setTimeframe] = useState('day');

  const activeData =
    timeframe === 'day'
      ? dayData
      : timeframe === 'week'
      ? weekData
      : timeframe === 'month'
      ? monthData
      : quarterData;

  const avgScore =
    activeData.reduce((sum, item) => sum + item.score, 0) /
    activeData.length;
  const advies = avgScore >= 1.5 ? 'Bullish' : avgScore <= -1.5 ? 'Bearish' : 'Neutral';

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
            <span className={scoreColor(avgScore)}>{avgScore.toFixed(1)}</span>
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
