"use client";

import { useEffect } from "react";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

import CardWrapper from "@/components/ui/CardWrapper";
import { useOnboarding } from "@/hooks/useOnboarding";

export default function OnboardingPage() {
  const {
    status,
    loading,
    saving,
    completed,
    completeStep,
  } = useOnboarding();

  // Redirect zodra onboarding klaar is
  useEffect(() => {
    if (completed) {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [completed]);

  if (loading || !status) {
    return (
      <div className="max-w-screen-md mx-auto py-10 px-4 text-center">
        <p className="text-gray-500">Onboarding wordt geladen…</p>
      </div>
    );
  }

  // JUISTE routes volgens sidebar
  const steps = [
    {
      key: "setup",
      title: "Setup aanmaken",
      description: "Maak jouw eerste trading setup aan.",
      done: status.has_setup,
      link: "/setup",
    },
    {
      key: "technical",
      title: "Technische indicatoren",
      description: "Voeg RSI, MA200, Volume of andere indicatoren toe.",
      done: status.has_technical,
      link: "/technical",
    },
    {
      key: "macro",
      title: "Macro indicatoren",
      description: "Voeg macro-indicatoren toe.",
      done: status.has_macro,
      link: "/macro",
    },
    {
      key: "market",
      title: "Market indicatoren",
      description: "Prijs, volume & 7D data worden automatisch gevuld.",
      done: status.has_market,
      link: "/market",
    },
    {
      key: "strategy",
      title: "Strategie genereren",
      description: "Genereer je eerste AI-strategie.",
      done: status.has_strategy,
      link: "/strategy",
    },
  ];

  return (
    <div className="max-w-screen-md mx-auto py-12 px-6 space-y-8 animate-fade-slide">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-dark)]">
          🚀 Onboarding
        </h1>
        <p className="text-[var(--text-light)] mt-2">
          Voltooi de stappen hieronder om jouw tradingdashboard te activeren.
        </p>
      </div>

      <CardWrapper>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-dark)]">
          Jouw voortgang
        </h2>

        <div className="space-y-6">
          {steps.map((step) => (
            <StepRow
              key={step.key}
              step={step}
              completeStep={completeStep}
              disabled={saving}
            />
          ))}
        </div>
      </CardWrapper>

      {completed && (
        <CardWrapper>
          <div className="text-center">
            <p className="mb-4 text-[var(--text-dark)] font-medium">
              🎉 Je onboarding is volledig afgerond!
            </p>
            <a
              href="/"
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

function StepRow({ step, completeStep, disabled }) {
  const isDone = !!step.done;
  const buttonLabel = isDone ? "Bekijken" : "Starten";

  const handleClick = async () => {
    try {
      if (!isDone) {
        await completeStep(step.key);
      }
    } catch (err) {
      console.warn("Kon stap niet opslaan, maar redirect toch →", step.key);
    }

    window.location.href = step.link;
  };

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-white shadow-sm">
      
      <div>
        {isDone ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <Circle className="w-6 h-6 text-gray-300" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-[var(--text-dark)]">{step.title}</h3>
        <p className="text-[var(--text-light)] text-sm">{step.description}</p>
      </div>

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
