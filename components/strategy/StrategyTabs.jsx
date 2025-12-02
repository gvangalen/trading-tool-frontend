'use client';

import { useState } from 'react';

import StrategyFormTrading from './StrategyFormTrading';
import StrategyFormDCA from './StrategyFormDCA';
import StrategyFormManual from './StrategyFormManual';

import { LineChart, Coins, Edit3 } from 'lucide-react';

export default function StrategyTabs({
  onSubmit,
  setupsTrading = [],
  setupsDCA = [],
  setupsManual = [],
}) {
  const [activeTab, setActiveTab] = useState('trading');

  /* ===========================================================
     TAB STYLE
  ============================================================ */
  const tabBase =
    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border";

  const tabStyle = (tab) =>
    activeTab === tab
      ? `${tabBase} bg-[var(--primary)] text-white border-[var(--primary)] shadow-md`
      : `${tabBase} bg-[var(--bg-soft)] text-[var(--text-dark)] border-[var(--border)] hover:bg-[var(--bg-hover)]`;

  /* ===========================================================
     HANDLER
  ============================================================ */
  const handleStandardSubmit = (strategy, type) => {
    if (!onSubmit) return;

    const payload = {
      ...strategy,
      strategy_type: type,
    };

    onSubmit(payload);
  };

  return (
    <div className="space-y-8">

      {/* ===========================================================
         TABS
      ============================================================ */}
      <div className="flex flex-wrap gap-3 mb-4">

        {/* Trading */}
        <button
          type="button"
          className={tabStyle('trading')}
          onClick={() => setActiveTab('trading')}
        >
          <LineChart size={16} />
          Tradingstrategie (AI)
        </button>

        {/* DCA */}
        <button
          type="button"
          className={tabStyle('dca')}
          onClick={() => setActiveTab('dca')}
        >
          <Coins size={16} />
          DCA-strategie
        </button>

        {/* Handmatig */}
        <button
          type="button"
          className={tabStyle('manual')}
          onClick={() => setActiveTab('manual')}
        >
          <Edit3 size={16} />
          Handmatige strategie
        </button>
      </div>

      {/* ===========================================================
         TRADING TAB
      ============================================================ */}
      {activeTab === 'trading' && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-light)]">
            Koppel aan een setup die nog geen tradingstrategie heeft.
          </p>

          <StrategyFormTrading
            setups={setupsTrading}
            onSubmit={(strategy) =>
              handleStandardSubmit(strategy, 'trading')
            }
          />
        </div>
      )}

      {/* ===========================================================
         DCA TAB
      ============================================================ */}
      {activeTab === 'dca' && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-light)]">
            Hieronder staan setups die nog geen DCA-strategie hebben.
          </p>

          <StrategyFormDCA
            setups={setupsDCA}
            onSubmit={(strategy) =>
              handleStandardSubmit(strategy, 'dca')
            }
          />
        </div>
      )}

      {/* ===========================================================
         MANUAL TAB
      ============================================================ */}
      {activeTab === 'manual' && (
        <div className="space-y-3">
          <p className="text-sm text-[var(--text-light)]">
            Voeg een handmatige strategie toe aan een setup.
          </p>

          <StrategyFormManual
            setups={setupsManual}
            onSubmit={(strategy) =>
              handleStandardSubmit(strategy, 'manual')
            }
          />
        </div>
      )}
    </div>
  );
}
