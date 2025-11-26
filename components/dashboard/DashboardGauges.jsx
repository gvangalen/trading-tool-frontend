"use client";

import { useScoresData } from "@/hooks/useScoresData";
import GaugeChart from "@/components/ui/GaugeChart";
import TopSetupsMini from "@/components/setup/TopSetupsMini";
import CardWrapper from "@/components/ui/CardWrapper";

// Lucide icons
import { Globe2, LineChart, DollarSign, Settings2 } from "lucide-react";

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
      showSetups: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {gauges.map((g, idx) => (
        <GaugeCard
          key={idx}
          title={g.title}
          icon={g.icon}
          score={g.data?.score}
          explanation={
            g.data?.explanation || g.data?.uitleg || g.data?.interpretation
          }
          topContributors={g.data?.top_contributors || []}
          showTopSetups={g.showSetups}
        />
      ))}
    </div>
  );
}

/* =====================================================
   SINGLE GAUGE CARD — Clean PRO Look
===================================================== */

function GaugeCard({
  title,
  icon,
  score,
  explanation,
  topContributors = [],
  showTopSetups = false,
}) {
  const numericScore =
    typeof score === "number" ? score : Number(score ?? 0) || 0;

  const displayScore = Math.round(numericScore);

  const autoExplanation =
    topContributors.length > 0
      ? `Belangrijkste factoren: ${topContributors.join(", ")}`
      : "Geen aanvullende uitleg beschikbaar.";

  const displayExplanation = (explanation || "").trim() || autoExplanation;

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
        {/* Score wordt nu getoond IN de GaugeChart */}
        <GaugeChart value={displayScore} />
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

      {/* MINI-SETUPS (SETUP gauge) */}
      {showTopSetups && (
        <div className="mt-4">
          <TopSetupsMini />
        </div>
      )}

      {/* Explanation */}
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-light)] italic">
        {displayExplanation}
      </p>
    </CardWrapper>
  );
}
