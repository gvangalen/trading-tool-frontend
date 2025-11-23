'use client';

import { useState, useMemo, useEffect } from 'react';

import { LineChart, Search, PlusCircle, ClipboardList } from 'lucide-react';

import StrategyList from '@/components/strategy/StrategyList';
import StrategyTabs from '@/components/strategy/StrategyTabs';

import { useSetupData } from '@/hooks/useSetupData';
import { useStrategyData } from '@/hooks/useStrategyData';
import { createStrategy } from '@/lib/api/strategy';

import InfoTooltip from '@/components/ui/InfoTooltip';
import CardWrapper from '@/components/ui/CardWrapper';

export default function StrategyPage() {
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const { setups, loadSetups } = useSetupData();
  const { strategies, loadStrategies } = useStrategyData();

  // Initial load
  useEffect(() => {
    loadSetups();
    loadStrategies();
  }, []);

  // 🔄 Force full refresh (tabs, filters, lists)
  const refreshEverything = () => {
    loadStrategies();
    loadSetups();

    setTimeout(() => setRefreshKey((k) => k + 1), 30);
  };

  const handleSuccess = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // 📤 STRATEGIE OPSLAAN
  const handleStrategySubmit = async (strategy) => {
    try {
      const setup = setups.find(
        (s) => String(s.id) === String(strategy.setup_id)
      );

      if (!setup) {
        setToast('❌ Geen geldige setup geselecteerd.');
        return;
      }

      const payload = {
        ...strategy,
        setup_id: setup.id,
        setup_name: setup.name,
        symbol: setup.symbol,
        timeframe: setup.timeframe,
        explanation: strategy.explanation || strategy.rules || '',
        entry: strategy.entry ?? null,
        targets: strategy.targets || [],
        stop_loss: strategy.stop_loss ?? null,
        favorite: strategy.favorite ?? false,
        tags: strategy.tags || [],
      };

      await createStrategy(payload);
      handleSuccess('✅ Strategie succesvol opgeslagen!');

      refreshEverything();

    } catch (err) {
      console.error('❌ Strategie opslaan mislukt:', err);
      setToast('❌ Strategie opslaan mislukt.');
    }
  };

  // 🔍 FILTERS
  const setupsWithoutTrading = useMemo(() => {
    return setups.filter(
      (s) =>
        !strategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === 'trading'
        )
    );
  }, [setups, strategies, refreshKey]);

  const setupsWithoutDCA = useMemo(() => {
    return setups.filter(
      (s) =>
        !strategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === 'dca'
        )
    );
  }, [setups, strategies, refreshKey]);

  const setupsWithoutManual = useMemo(() => {
    return setups.filter(
      (s) =>
        !strategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type).toLowerCase() === 'manual'
        )
    );
  }, [setups, strategies, refreshKey]);

  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* -------------------------------------------------- */}
      {/* 🧭 Titel */}
      {/* -------------------------------------------------- */}
      <div className="flex items-center gap-3 mb-2">
        <LineChart size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)] tracking-tight">
          Strategieën
        </h1>
      </div>

      <p className="text-[var(--text-light)] max-w-2xl">
        Bouw, beheer en optimaliseer je tradingstrategieën. AI ondersteunt bij
        validatie en automatische generaties.
      </p>

      {/* -------------------------------------------------- */}
      {/* 📋 Huidige strategieën */}
      {/* -------------------------------------------------- */}
      <CardWrapper
        title={
          <div className="flex items-center gap-2">
            <ClipboardList className="text-[var(--primary)]" size={20} />
            <span>Huidige Strategieën</span>
          </div>
        }
      >
        <div className="flex justify-between items-center mb-4">

          {/* 🔎 Zoekbalk */}
          <div
            className="
              flex items-center px-3 py-2
              bg-[var(--bg-soft)] border border-[var(--border)]
              rounded-lg gap-2
              focus-within:ring-1 focus-within:ring-[var(--primary)]
            "
          >
            <Search size={18} className="text-[var(--text-light)]" />
            <input
              type="text"
              placeholder="Zoek op asset of tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-48"
            />
          </div>
        </div>

        <StrategyList searchTerm={search} key={refreshKey} />
      </CardWrapper>

      {toast && (
        <div className="bg-green-100 text-green-800 border border-green-300 px-4 py-2 rounded text-sm">
          {toast}
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* ➕ Nieuwe strategie */}
      {/* -------------------------------------------------- */}
      <CardWrapper
        title={
          <div className="flex items-center gap-2">
            <PlusCircle className="text-[var(--primary)]" size={20} />
            <span>Nieuwe Strategie</span>
          </div>
        }
      >
        <p className="text-sm text-[var(--text-light)] mb-4">
          Kies welke setup je wilt gebruiken en genereer een strategie via AI,
          of voer hem zelf handmatig in.
        </p>

        <StrategyTabs
          key={refreshKey}
          onSubmit={handleStrategySubmit}
          setupsTrading={setupsWithoutTrading}
          setupsDCA={setupsWithoutDCA}
          setupsManual={setupsWithoutManual}
        />
      </CardWrapper>

    </div>
  );
}
