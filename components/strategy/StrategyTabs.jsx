'use client';

import { useState } from 'react';
import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';
import StrategyFormManual from './StrategyFormManual';

export default function StrategyTabs({ onSubmit }) {
  const [activeTab, setActiveTab] = useState('trading');

  const tabStyle = (tab) =>
    `px-4 py-2 text-sm rounded-md font-medium border ${
      activeTab === tab
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
    }`;

  return (
    <div>
      {/* 🔘 Tab-knoppen */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button className={tabStyle('trading')} onClick={() => setActiveTab('trading')}>
          📈 Tradingstrategie (AI)
        </button>
        <button className={tabStyle('dca')} onClick={() => setActiveTab('dca')}>
          💰 DCA-strategie
        </button>
        <button className={tabStyle('manual')} onClick={() => setActiveTab('manual')}>
          ✍️ Handmatige strategie
        </button>
      </div>

      {/* 🧠 Tab inhoud */}
      {activeTab === 'trading' && <StrategyFormTrading onSubmit={onSubmit} />}
      {activeTab === 'dca' && <StrategyFormDCA onSubmit={onSubmit} />}
      {activeTab === 'manual' && <StrategyFormManual onSubmit={onSubmit} />}
    </div>
  );
}
