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
      emptyText: "Nog geen macrodata beschikbaar.",
    },
    {
      title: "Technical",
      icon: <LineChart className="w-4 h-4" />,
      data: technical,
      emptyText: "Nog geen technische analyse beschikbaar.",
    },
    {
      title: "Market",
      icon: <DollarSign className="w-4 h-4" />,
      data: market,
      emptyText: "Nog geen marktdata beschikbaar.",
    },
    {
      title: "Setup",
      icon: <Settings2 className="w-4 h-4" />,
      data: setup,
      emptyText: "Geen actieve setups gevonden.",
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
          data={g.data}
          emptyText={g.emptyText}
          showTopSetups={g.showSetups}
        />
      ))}
    </div>
  );
}

/* =====================================================
   SINGLE GAUGE CARD — Clean PRO Look (with empty state)
===================================================== */

function GaugeCard({
  title,
  icon,
  data,
  emptyText,
  showTopSetups = false,
}) {
  const score = data?.score;

  const hasScore = typeof score === "number" && score > 0;

  const numericScore = hasScore ? score : 0;
  const displayScore = hasScore ? Math.round(numericScore) : "—";

  const explanation =
    (data?.explanation ||
      data?.uitleg ||
      data?.interpretation ||
      null) ?? null;

  const topContributors = data?.top_contributors || [];

  const showExplanation = explanation?.trim?.() || emptyText;

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
        <GaugeChart value={numericScore} displayValue={displayScore} />
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

      {/* EXPLANATION */}
      <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-light)] italic">
        {showExplanation}
      </p>
    </CardWrapper>
  );
}
