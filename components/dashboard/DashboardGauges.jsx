"use client";

import { useScoresData } from "@/hooks/useScoresData";
import GaugeChart from "@/components/ui/GaugeChart";
import TopSetupsMini from "@/components/setup/TopSetupsMini";
import CardWrapper from "@/components/ui/CardWrapper";

// Lucide icons
import { Globe2, LineChart, DollarSign, Settings2 } from "lucide-react";

export default function DashboardGauges() {
  const { macro, technical, market, setup, loading } = useScoresData();

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
   SINGLE GAUGE CARD
   Consistent premium fintech stijl
===================================================== */

function GaugeCard({
  title,
  icon,
  score,
  explanation,
  topContributors = [],
  showTopSetups = false,
}) {
  const displayScore = typeof score === "number" ? score : 0;

  const autoExplanation =
    topContributors.length > 0
      ? `Belangrijkste factoren: ${topContributors.join(", ")}`
      : "Geen uitleg beschikbaar.";

  const displayExplanation = explanation?.trim() || autoExplanation;

  return (
    <CardWrapper>
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="
            p-2 rounded-lg bg-[var(--bg-soft)] 
            border border-[var(--border)]
            shadow-sm
          "
        >
          {icon}
        </div>

        <h2 className="text-sm font-semibold text-[var(--text-dark)] tracking-tight">
          {title}
        </h2>
      </div>

      {/* GAUGE */}
      <div className="flex justify-center my-3">
        <GaugeChart value={displayScore} label={title} />
      </div>

      {/* CONTRIBUTORS */}
      {topContributors.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold text-[var(--text-dark)] mb-1">
            Top bijdragen
          </p>

          <div className="flex flex-wrap gap-2">
            {topContributors.map((c, i) => (
              <span
                key={i}
                className="
                  px-2 py-[3px] 
                  bg-[var(--bg-soft)] 
                  border border-[var(--border)]
                  text-[var(--text-light)]
                  rounded-lg text-xs
                "
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* EXTRA MINI SETUPS (alleen setup gauge) */}
      {showTopSetups && (
        <div className="mt-3">
          <TopSetupsMini />
        </div>
      )}

      {/* EXPLANATION */}
      <div
        className="
          mt-3 p-2 rounded-lg text-xs italic
          bg-[var(--bg-soft)]
          border border-[var(--border)]
          text-[var(--text-light)]
        "
      >
        {displayExplanation}
      </div>
    </CardWrapper>
  );
}
