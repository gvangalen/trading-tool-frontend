"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/components/modal/ModalProvider";

import {
  Settings,
  Search,
  ClipboardList,
  PlusCircle,
} from "lucide-react";

import SetupForm from "@/components/setup/SetupForm";
import SetupList from "@/components/setup/SetupList";

import { useSetupData } from "@/hooks/useSetupData";
import CardWrapper from "@/components/ui/CardWrapper";

// 🧠 AI Agent Panel
import AgentInsightPanel from "@/components/agents/AgentInsightPanel";

export default function SetupPage() {
  const [search, setSearch] = useState("");

  const { showSnackbar } = useModal();

  const {
    setups,
    loading,
    error,
    loadSetups,
    saveSetup,
    removeSetup,
  } = useSetupData();

  /* =====================================================
     🔄 INITIAL LOAD
  ===================================================== */
  useEffect(() => {
    loadSetups();
  }, []);

  const reloadSetups = async () => {
    await loadSetups();
    showSnackbar("🔄 Setups vernieuwd", "info");
  };

  /* =====================================================
     🛡️ SAFE SETUPS
  ===================================================== */
  const safeSetups = Array.isArray(setups) ? setups : [];

  return (
    <div className="max-w-screen-xl mx-auto py-10 px-6 space-y-12 animate-fade-slide">

      {/* -------------------------------------------------- */}
      {/* 🧩 Titel */}
      {/* -------------------------------------------------- */}
      <div className="flex items-center gap-3 mb-2">
        <Settings size={28} className="text-[var(--primary)]" />
        <h1 className="text-3xl font-bold text-[var(--text-dark)] tracking-tight">
          Setup Editor
        </h1>
      </div>

      <p className="text-[var(--text-light)] max-w-2xl">
        Beheer al je trading-setups. De AI valideert deze dagelijks op basis van 
        macro-, technische- en marktdata.
      </p>

      {/* -------------------------------------------------- */}
      {/* 🧠 AI Agent Insight Panel  */}
      {/* -------------------------------------------------- */}
      <AgentInsightPanel category="setup" />

      {/* -------------------------------------------------- */}
      {/* 📋 Huidige setups */}
      {/* -------------------------------------------------- */}
      <CardWrapper
        title={
          <div className="flex items-center gap-2">
            <ClipboardList className="text-[var(--primary)]" size={20} />
            <span>Huidige Setups</span>
          </div>
        }
      >

        {/* Zoekveld */}
        <div className="flex justify-between items-center mb-4">
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
              placeholder="Zoek op naam…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-48"
            />
          </div>
        </div>

        {/* Setup lijst */}
        <SetupList
          setups={safeSetups}
          loading={loading}
          error={error}
          searchTerm={search}
          saveSetup={saveSetup}
          removeSetup={removeSetup}
          reload={reloadSetups}
        />
      </CardWrapper>

      {/* -------------------------------------------------- */}
      {/* ➕ Nieuwe setup */}
      {/* -------------------------------------------------- */}
      <CardWrapper
        title={
          <div className="flex items-center gap-2">
            <PlusCircle className="text-[var(--primary)]" size={20} />
            <span>Nieuwe Setup</span>
          </div>
        }
      >
        <p className="text-sm text-[var(--text-light)] mb-4">
          Vul alle details in om een nieuwe trading-setup toe te voegen.
        </p>

        <SetupForm onSaved={reloadSetups} />
      </CardWrapper>
    </div>
  );
}
