'use client';

import { useEffect, useState } from 'react';
import CardWrapper from '@/components/ui/CardWrapper';
import { fetchDailyReportSummary, fetchActiveTrades, fetchAIBotStatus } from '@/lib/api/sidebar';

export default function RightSidebarCard() {
  const [report, setReport] = useState(null);
  const [trades, setTrades] = useState([]);
  const [botStatus, setBotStatus] = useState(null);

  useEffect(() => {
    fetchDailyReportSummary().then(setReport);
    fetchActiveTrades().then(setTrades);
    fetchAIBotStatus().then(setBotStatus);
  }, []);

  return (
    <CardWrapper>
      <div className="space-y-4">
        {/* 📅 Dagelijks Rapport */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-2">📅 Dagelijks Rapport</h3>
          {report ? (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="mb-2">{report.summary}</p>
              <a
                href="/rapporten"
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                Bekijk volledig rapport →
              </a>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Laden...</p>
          )}
        </div>

        {/* 📈 Actieve Trades */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm bg-white dark:bg-gray-900">
          <h3 className="text-lg font-semibold mb-2">📈 Actieve Trades</h3>
          {trades.length > 0 ? (
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
          {botStatus ? (
            <div className="text-sm">
              <p>Status: <span className="font-medium">{botStatus.state}</span></p>
              <p>Strategie: {botStatus.strategy}</p>
              <p>Laatste update: {botStatus.updated}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Botstatus ophalen...</p>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}
