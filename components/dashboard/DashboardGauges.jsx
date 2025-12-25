"use client";

import { useScoresData } from "@/hooks/useScoresData";
import GaugeChart from "@/components/ui/GaugeChart";
import TopSetupsMini from "@/components/setup/TopSetupsMini";
import CardWrapper from "@/components/ui/CardWrapper";

// Icons
import { Globe2, LineChart, DollarSign, Settings2 } from "lucide-react";

/* =====================================================
   VASTE DASHBOARD TEKSTEN (GEEN AI)
===================================================== */
const DASHBOARD_TEXT = {
  Macro:
    "Macro-indicatoren geven inzicht in het bredere economische klimaat en de algemene risicobereidheid.",
  Technical:
    "Technische indicatoren tonen trend, momentum en marktstructuur op basis van prijsdata.",
  Market:
    "Marketdata weerspiegelt recente prijsbewegingen, volume en korte termijn dynamiek.",
  Setup:
    "Actieve setups worden geselecteerd op basis van de huidige macro-, market- en technische score.",
};

export default function DashboardGauges() {
  const { macro, technical, market, setup } = useScoresData();

  const gauges = [
    {
      title: "Macro",
      icon: <Globe2 className="w-4 h-4" />,
      data: macro,
    },
    {
      title: "Technical",
      icon: <LineChart className="w-4 h-4" />,
      data: technical,
    },
    {
      title: "Market",
      icon: <DollarSign className="w-4 h-4" />,
      data: market,
    },
    {
      title: "Setup",
      icon: <Settings2 className="w-4 h-4" />,
      data: setup,
      showTopSetups: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {gauges.map((g, idx) => (
        <GaugeCard
          key={idx}
          title={g.title}
          icon={g.icon}
          data={g.data}
          showTopSetups={g.showTopSetups}
        />
      ))}
    </div>
  );
}

/* =====================================================
   SINGLE GAUGE CARD
===================================================== */

function GaugeCard({ title, icon, data, showTopSetups = false }) {
  const score = typeof data?.score === "number" ? data.score : 0;
  const displayScore = Math.round(score);

  const topContributors = Array.isArray(data?.top_contributors)
    ? data.top_contributors
    : [];

  const hasSetups =
    showTopSetups &&
    Array.isArray(data?.top_contributors) &&
    data.top_contributors.length > 0;

  // 👉 ALTIJD vaste dashboardtekst
  const displayExplanation = DASHBOARD_TEXT[title];

  return (
    <CardWrapper>
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="
            h-7 w-7 rounded-full
            border border-[var(--card-border)]
            flex items-center justify-center
            text-[var(--text-light)]
            text-xs
          "
        >
          {icon}
        </div>
        <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
          {title}
        </h2>
      </div>

      {/* GAUGE */}
      <div className="flex flex-col items-center justify-center mt-1 mb-2">
        <GaugeChart value={score} displayValue={displayScore} />
      </div>

      {/* CONTRIBUTORS */}
      {topContributors.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-medium text-[var(--text-light)] uppercase tracking-wide mb-1">
            Top bijdragen
          </p>
          <div className="space-y-1">
            {topContributors.map((c, i) => (
              <div
                key={i}
                className="
                  text-xs text-[var(--text-dark)]
                  pl-1 border-l-2 border-[var(--primary)]
                "
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOP SETUPS */}
      {hasSetups && (
        <div className="mt-4">
          <TopSetupsMini />
        </div>
      )}

      {/* EXPLANATION */}
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-light)] italic">
        {displayExplanation}
      </p>
    </CardWrapper>
  );
}
