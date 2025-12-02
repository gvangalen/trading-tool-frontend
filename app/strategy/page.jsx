"use client";

import { useState, useMemo, useEffect } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  LineChart,
  Search,
  PlusCircle,
  ClipboardList,
} from "lucide-react";

import StrategyList from "@/components/strategy/StrategyList";
import StrategyTabs from "@/components/strategy/StrategyTabs";

import { useSetupData } from "@/hooks/useSetupData";
import { useStrategyData } from "@/hooks/useStrategyData";
import { createStrategy } from "@/lib/api/strategy";

import CardWrapper from "@/components/ui/CardWrapper";

// 🧠 Updated AI Insight Panel
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

export default function StrategyPage() {
  const { showSnackbar } = useModal();

  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const { setups, loadSetups } = useSetupData();
  const { strategies, loadStrategies } = useStrategyData();

  /* -------------------------------------------------- */
  /* SAFE ARRAYS */
  /* -------------------------------------------------- */
  const safeSetups = Array.isArray(setups) ? setups : [];
  const safeStrategies = Array.isArray(strategies) ? strategies : [];

  /* -------------------------------------------------- */
  /* INITIAL LOAD */
  /* -------------------------------------------------- */
  useEffect(() => {
    loadSetups();
    loadStrategies();
  }, []);

  /* -------------------------------------------------- */
  /* REFRESH EVERYTHING */
  /* -------------------------------------------------- */
  const refreshEverything = () => {
    loadStrategies();
    loadSetups();

    setTimeout(() => setRefreshKey((k) => k + 1), 30);
  };

  /* -------------------------------------------------- */
  /* SUBMIT NEW STRATEGY */
  /* -------------------------------------------------- */
  const handleStrategySubmit = async (strategy) => {
    try {
      const setup = safeSetups.find(
        (s) => String(s.id) === String(strategy.setup_id)
      );

      if (!setup) {
        showSnackbar("Geen geldige setup geselecteerd.", "danger");
        return;
      }

      const payload = {
        ...strategy,
        setup_id: setup.id,
        setup_name: setup.name,
        symbol: setup.symbol,
        timeframe: setup.timeframe,
        explanation: strategy.explanation || strategy.rules || "",
        entry: strategy.entry ?? null,
        targets: strategy.targets || [],
        stop_loss: strategy.stop_loss ?? null,
        favorite: strategy.favorite ?? false,
        tags: strategy.tags || [],
      };

      await createStrategy(payload);

      showSnackbar("Strategie succesvol opgeslagen ✔", "success");
      refreshEverything();
    } catch (err) {
      console.error("❌ Strategie opslaan mislukt:", err);
      showSnackbar("Strategie opslaan mislukt.", "danger");
    }
  };

  /* -------------------------------------------------- */
  /* FILTERS */
  /* -------------------------------------------------- */

  const setupsWithoutTrading = useMemo(() => {
    return safeSetups.filter(
      (s) =>
        !safeStrategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type || "").toLowerCase() === "trading"
        )
    );
  }, [safeSetups, safeStrategies, refreshKey]);

  const setupsWithoutDCA = useMemo(() => {
    return safeSetups.filter(
      (s) =>
        !safeStrategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type || "").toLowerCase() === "dca"
        )
    );
  }, [safeSetups, safeStrategies, refreshKey]);

  const setupsWithoutManual = useMemo(() => {
    return safeSetups.filter(
      (s) =>
        !safeStrategies.some(
          (strat) =>
            String(strat.setup_id) === String(s.id) &&
            String(strat.strategy_type || "").toLowerCase() === "manual"
        )
    );
  }, [safeSetups, safeStrategies, refreshKey]);

  /* -------------------------------------------------- */
  /* RENDER */
  /* -------------------------------------------------- */
  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* Titel */}
      <div className="flex items-center gap-3 mb-2">
        <LineChart size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)] tracking-tight">
          Strategieën
        </h1>
      </div>

      <p className="text-[var(--text-light)] max-w-2xl">
        Bouw, beheer en optimaliseer je tradingstrategieën.  
        De AI helpt bij validatie, tips en automatische generaties.
      </p>

      {/* AI AGENT INSIGHTS */}
      <AgentInsightPanel category="strategy" />

      {/* Strategieën lijst */}
      <CardWrapper
        title={
          <div className="flex items-center gap-2">
            <ClipboardList className="text-[var(--primary)]" size={20} />
            <span>Huidige Strategieën</span>
          </div>
        }
      >
        <div className="flex justify-between items-center mb-4">
          {/* Zoekveld */}
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

      {/* Nieuwe strategie */}
      <CardWrapper
        title={
          <div className="flex items-center gap-2">
            <PlusCircle className="text-[var(--primary)]" size={20} />
            <span>Nieuwe Strategie</span>
          </div>
        }
      >
        <p className="text-sm text-[var(--text-light)] mb-4">
          Selecteer een setup en laat AI een strategie genereren,
          of voeg zelf handmatig een strategie toe.
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
