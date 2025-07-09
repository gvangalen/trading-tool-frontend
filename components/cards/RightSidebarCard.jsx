'use client';

import Link from 'next/link';
import CardWrapper from '@/components/ui/CardWrapper';
import { useSidebarData } from '@/hooks/useSidebarData';

export default function RightSidebarCard() {
  const { summary, trades, aiStatus, loading } = useSidebarData();

  return (
    <CardWrapper>
      <div className="space-y-4">

        {/* 📅 Dagelijks Rapport */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-2">📅 Dagelijks Rapport</h3>
          {loading ? (
            <p className="text-sm text-gray-400">Laden...</p>
          ) : (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="mb-2">{summary || 'Geen samenvatting beschikbaar'}</p>
              <Link href="/report" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Bekijk volledig rapport →
              </Link>
            </div>
          )}
        </div>

        {/* 📈 Actieve Trades */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-2">📈 Actieve Trades</h3>
          {loading ? (
            <p className="text-sm text-gray-400">Laden...</p>
          ) : trades.length > 0 ? (
            <ul className="text-sm space-y-1">
              {trades.map((trade) => (
                <li key={trade.id} className="flex justify-between">
                  <span>{trade.symbol}</span>
                  <span className="font-medium">{trade.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">Geen actieve trades</p>
          )}
        </div>

        {/* 🤖 AI Trading Bot */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-2">🤖 AI Trading Bot</h3>
          {loading ? (
            <p className="text-sm text-gray-400">Botstatus ophalen...</p>
          ) : (
            <div className="text-sm">
              <p>Status: <span className="font-medium">{aiStatus.state || 'onbekend'}</span></p>
              <p>Strategie: {aiStatus.strategy || 'n.v.t.'}</p>
              <p>Laatste update: {aiStatus.updated || 'onbekend'}</p>
            </div>
          )}
        </div>

      </div>
    </CardWrapper>
  );
}
