'use client';

import { useState } from 'react';
import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';
import StrategyFormManual from './StrategyFormManual';
import InfoTooltip from '@/components/ui/InfoTooltip';

export default function StrategyTabs({
  onSubmit,
  setupsTrading = [],
  setupsDCA = [],
  setupsManual = [],
}) {
  const [activeTab, setActiveTab] = useState('trading');

  const tabStyle = (tab) =>
    `px-4 py-2 text-sm rounded-md font-medium border ${
      activeTab === tab
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
    }`;

  // Standaard handler: forms geven "kale" data terug, hier voeg ik strategy_type toe
  const handleStandardSubmit = (strategy, type) => {
    if (!onSubmit) return;

    const payload = {
      ...strategy,
      strategy_type: type, // 'trading' | 'dca' | 'manual'
    };

    onSubmit(payload);
  };

  return (
    <div>
      {/* Tabs */}
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

      {/* Trading (AI) */}
      {activeTab === 'trading' && (
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
              Koppel aan Setup (AI)
            </label>
            <InfoTooltip text="Alleen setups zonder bestaande tradingstrategie worden hier weergegeven." />
          </div>
          <StrategyFormTrading
            setups={setupsTrading}
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'trading')}
          />
        </div>
      )}

      {/* DCA */}
      {activeTab === 'dca' && (
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
              Koppel aan Setup (DCA)
            </label>
            <InfoTooltip text="Alleen setups zonder bestaande DCA-strategie worden hier weergegeven." />
          </div>
          <StrategyFormDCA
            setups={setupsDCA}
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'dca')}
          />
        </div>
      )}

      {/* Handmatig */}
      {activeTab === 'manual' && (
        <div>
          <div className="flex items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-1">
              Koppel aan Setup (Handmatig)
            </label>
            <InfoTooltip text="Alleen setups zonder bestaande handmatige strategie worden hier weergegeven." />
          </div>
          <StrategyFormManual
            setups={setupsManual}
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'manual')}
          />
        </div>
      )}
    </div>
  );
}
