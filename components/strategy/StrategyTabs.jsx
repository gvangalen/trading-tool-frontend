'use client';

import { useState } from 'react';
import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';
import StrategyFormManual from './StrategyFormManual';
import { createStrategy } from '@/lib/api/strategy';
import { useStrategyData } from '@/hooks/useStrategyData';

export default function StrategyTabs({ onSubmit, setups = [], dcaSetups = [] }) {
  const [activeTab, setActiveTab] = useState('trading');
  const { loadStrategies } = useStrategyData();

  const tabStyle = (tab) =>
    `px-4 py-2 text-sm rounded-md font-medium border ${
      activeTab === tab
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
    }`;

  const handleStandardSubmit = async (strategy) => {
    try {
      console.log('📤 Strategie opslaan:', strategy);
      await createStrategy(strategy);
      await loadStrategies();
      onSubmit?.('✅ Strategie succesvol opgeslagen!');
    } catch (err) {
      console.error('❌ Fout bij opslaan strategie:', err);
      alert('❌ Fout bij opslaan strategie.');
    }
  };

  const handleDcaSubmit = async (strategy) => {
    try {
      const payload = {
        ...strategy,
        strategy_type: 'dca',
      };
      console.log('📤 DCA-strategie opslaan:', payload);
      await createStrategy(payload);
      await loadStrategies();
      onSubmit?.('✅ DCA-strategie succesvol opgeslagen!');
    } catch (err) {
      console.error('❌ Fout bij opslaan DCA-strategie:', err);
      alert('❌ Fout bij opslaan DCA-strategie.');
    }
  };

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
      {activeTab === 'trading' && (
        <StrategyFormTrading onSubmit={handleStandardSubmit} setups={setups} />
      )}
      {activeTab === 'dca' && (
        <StrategyFormDCA onSubmit={handleDcaSubmit} setups={dcaSetups} />
      )}
      {activeTab === 'manual' && (
        <StrategyFormManual onSubmit={handleStandardSubmit} setups={setups} />
      )}
    </div>
  );
}