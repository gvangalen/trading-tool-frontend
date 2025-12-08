"use client";

import { useEffect } from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

import CardWrapper from "@/components/ui/CardWrapper";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function OnboardingPage() {
  const {
    status,
    loading,
    error,
    complete,
    finish,
    updating,
    reload,
  } = useOnboarding();

  /* -------------------------------------------------------
     Redirect zodra onboarding gereed is
  ------------------------------------------------------- */
  const onboardingComplete =
    status?.setup &&
    status?.technical &&
    status?.macro &&
    status?.market &&
    status?.strategy;

  useEffect(() => {
    if (onboardingComplete) {
      const timer = setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [onboardingComplete]);

  /* -------------------------------------------------------
     Loading UI
  ------------------------------------------------------- */
  if (loading || !status) {
    return (
      <div className="max-w-screen-md mx-auto py-10 px-4 text-center">
        <p className="text-gray-500">Onboarding wordt geladen…</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     Onboarding stappen definitie
  ------------------------------------------------------- */
  const steps = [
    {
      key: "setup",
      title: "Setup aanmaken",
      description: "Maak jouw eerste trading setup aan.",
      done: status.setup,
      link: "/setups",
    },
    {
      key: "technical",
      title: "Technische indicatoren",
      description: "Voeg RSI, MA200, Volume of andere indicatoren toe.",
      done: status.technical,
      link: "/technical",
    },
    {
      key: "macro",
      title: "Macro indicatoren",
      description: "Voeg macro-indicatoren toe (DXY, F&G Index, BTC dominante).",
      done: status.macro,
      link: "/macro",
    },
    {
      key: "market",
      title: "Market indicatoren",
      description: "De tool gebruikt prijs, volume en volatiliteit automatisch.",
      done: status.market,
      link: "/market",
    },
    {
      key: "strategy",
      title: "Strategie genereren",
      description: "Genereer je eerste AI-strategie voor de setup.",
      done: status.strategy,
      link: "/strategies",
    },
    {
      key: "complete",
      title: "Onboarding afronden",
      description: "Alle stappen voltooid → dashboard activeren.",
      done: onboardingComplete,
      link: "/dashboard",
    },
  ];

  return (
    <div className="max-w-screen-md mx-auto py-12 px-6 space-y-8 animate-fade-slide">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-dark)]">
          🚀 Onboarding
        </h1>
        <p className="text-[var(--text-light)] mt-2">
          Voltooi de stappen hieronder om jouw persoonlijke tradingdashboard te activeren.
        </p>
      </div>

      {/* Error melding */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      {/* Stappenlijst */}
      <CardWrapper>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-dark)]">
          Jouw voortgang
        </h2>

        <div className="space-y-6">
          {steps.map((step) => (
            <StepRow
              key={step.key}
              step={step}
              completeStep={complete}
              disabled={updating}
            />
          ))}
        </div>
      </CardWrapper>

      {/* Als onboarding klaar is */}
      {onboardingComplete && (
        <CardWrapper>
          <div className="text-center">
            <p className="mb-4 text-[var(--text-dark)] font-medium">
              🎉 Je onboarding is voltooid!
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg shadow hover:bg-[var(--primary-strong)] transition"
            >
              Naar Dashboard
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </CardWrapper>
      )}
    </div>
  );
}

/* ============================================================
   Step Row Component
   FIXED VERSION — veilige completeStep() + redirect
============================================================ */
function StepRow({ step, completeStep, disabled }) {
  const isDone = step.done;
  const buttonLabel = isDone ? "Bekijken" : "Starten";

  const handleClick = async () => {
    try {
      if (!isDone) {
        await completeStep(step.key);
      }
    } catch (err) {
      console.warn(`Step '${step.key}' kon niet worden opgeslagen → doorgaan`, err);
    }

    // We gaan ALTIJD door naar de pagina
    window.location.href = step.link;
  };

  return (
    <div className="flex items-start gap-4 p-4 border border-[var(--card-border)] rounded-lg bg-white shadow-sm">

      {/* Status icoon */}
      <div>
        {isDone ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <Circle className="w-6 h-6 text-gray-300" />
        )}
      </div>

      {/* Tekst */}
      <div className="flex-1">
        <h3 className="font-semibold text-[var(--text-dark)]">{step.title}</h3>
        <p className="text-[var(--text-light)] text-sm">{step.description}</p>
      </div>

      {/* Button */}
      <div>
        <button
          disabled={disabled}
          onClick={handleClick}
          className={`
            px-4 py-2 rounded-lg text-sm border transition
            ${
              isDone
                ? "border-gray-300 text-gray-500 hover:bg-gray-100"
                : "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
            }
          `}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
