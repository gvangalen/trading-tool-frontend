'use client';

import { useState } from 'react';
import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';
import StrategyFormManual from './StrategyFormManual';
import { createStrategy } from '@/lib/api/strategy';
import { useStrategyData } from '@/hooks/useStrategyData';
import InfoTooltip from '@/components/ui/InfoTooltip';

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

      {/* Tab content met tooltips */}
      {activeTab === 'trading' && (
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
              Koppel aan Setup (AI)
            </label>
            <InfoTooltip text="Alleen setups zonder bestaande AI-strategie worden hier weergegeven." />
          </div>
          <StrategyFormTrading
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'ai')}
            setups={setupsAI}
          />
        </div>
      )}

      {activeTab === 'dca' && (
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
              Koppel aan Setup (DCA)
            </label>
            <InfoTooltip text="Alleen setups zonder bestaande DCA-strategie worden hier weergegeven." />
          </div>
          <StrategyFormDCA
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'dca')}
            setups={setupsDCA}
          />
        </div>
      )}

      {activeTab === 'manual' && (
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
              Koppel aan Setup (Handmatig)
            </label>
            <InfoTooltip text="Alleen setups zonder bestaande handmatige strategie worden hier weergegeven." />
          </div>
          <StrategyFormManual
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'manual')}
            setups={setupsManual}
          />
        </div>
      )}
    </div>
  );
}
