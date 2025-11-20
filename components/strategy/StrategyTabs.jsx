'use client';

import { useState } from 'react';
import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';
import StrategyFormManual from './StrategyFormManual';

export default function StrategyTabs({
  onSubmit,
  setupsTrading = [],
  setupsDCA = [],
  setupsManual = [],
}) {
  const [activeTab, setActiveTab] = useState('trading');

  const tabStyle = (tab) =>
    `px-4 py-2 text-sm rounded-md font-medium border transition ${
      activeTab === tab
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
    }`;

  // Standaard handler: formulier returned “kale strategy”
  const handleStandardSubmit = (strategy, type) => {
    if (!onSubmit) return;

    const payload = {
      ...strategy,
      strategy_type: type, // trading | dca | manual
    };

    onSubmit(payload);
  };

  return (
    <div className="space-y-6">

      {/* ======= TABS ======= */}
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

      {/* ======= TRADING TAB ======= */}
      {activeTab === 'trading' && (
        <div className="space-y-2">

          {/* Sub-title */}
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Koppel aan een setup zonder bestaande tradingstrategie.
          </p>

          <StrategyFormTrading
            setups={setupsTrading}
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'trading')}
          />
        </div>
      )}

      {/* ======= DCA TAB ======= */}
      {activeTab === 'dca' && (
        <div className="space-y-2">

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Alleen setups die nog geen DCA-strategie hebben worden getoond.
          </p>

          <StrategyFormDCA
            setups={setupsDCA}
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'dca')}
          />
        </div>
      )}

      {/* ======= MANUAL TAB ======= */}
      {activeTab === 'manual' && (
        <div className="space-y-2">

          <p className="text-sm text-gray-600 dark:text-gray-300">
            Koppel aan een setup zonder bestaande handmatige strategie.
          </p>

          <StrategyFormManual
            setups={setupsManual}
            onSubmit={(strategy) => handleStandardSubmit(strategy, 'manual')}
          />
        </div>
      )}
    </div>
  );
}
