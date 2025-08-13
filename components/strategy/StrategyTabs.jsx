'use client';

import { useState } from 'react';
import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';
import StrategyFormManual from './StrategyFormManual';
import { createStrategy } from '@/lib/api/strategy';
import { useStrategyData } from '@/hooks/useStrategyData';

export default function StrategyTabs({
  onSubmit,
  setupsDCA = [],
  setupsAI = [],
  setupsManual = [],
}) {
  const [activeTab, setActiveTab] = useState('trading');
  const { loadStrategies } = useStrategyData();

  const tabStyle = (tab) =>
    `px-4 py-2 text-sm rounded-md font-medium border ${
      activeTab === tab
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
    }`;

  const handleStandardSubmit = async (strategy, type = 'ai') => {
    try {
      const payload = {
        ...strategy,
        strategy_type: type,
      };
      console.log('📤 Strategie opslaan:', payload);
      await createStrategy(payload);
      await loadStrategies();
      if (onSubmit) onSubmit(`✅ ${type.toUpperCase()}-strategie succesvol opgeslagen!`);
    } catch (err) {
      console.error(`❌ Fout bij opslaan ${type}-strategie:`, err);
      alert(`❌ Fout bij opslaan ${type}-strategie.`);
    }
  };

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={tabStyle('trading')}
          onClick={() => setActiveTab('trading')}
          type="button"
        >
          📈 Tradingstrategie (AI)
        </button>
        <button
          className={tabStyle('dca')}
          onClick={() => setActiveTab('dca')}
          type="button"
        >
          💰 DCA-strategie
        </button>
        <button
          className={tabStyle('manual')}
          onClick={() => setActiveTab('manual')}
          type="button"
        >
          ✍️ Handmatige strategie
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'trading' && (
        <StrategyFormTrading
          onSubmit={(strategy) => handleStandardSubmit(strategy, 'ai')}
          setups={setupsAI}
        />
      )}
      {activeTab === 'dca' && (
        <StrategyFormDCA
          onSubmit={(strategy) => handleStandardSubmit(strategy, 'dca')}
          setups={setupsDCA}
        />
      )}
      {activeTab === 'manual' && (
        <StrategyFormManual
          onSubmit={(strategy) => handleStandardSubmit(strategy, 'manual')}
          setups={setupsManual}
        />
      )}
    </div>
  );
}
