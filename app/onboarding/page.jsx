'use client';
import OnboardingProgress from '@/components/ui/OnboardingProgress';
import CardWrapper from '@/components/ui/CardWrapper';

export default function OnboardingPage() {
  return (
    <div className="max-w-screen-md mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold">🚀 Onboarding</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Volg de 4 stappen om het dashboard volledig te activeren. Je voortgang wordt automatisch opgeslagen.
      </p>

      <CardWrapper>
        <OnboardingProgress />
      </CardWrapper>

      <CardWrapper>
        <h2 className="text-xl font-semibold mb-4">✅ Onboarding Stappen</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>📝 Stap 1: Setup aanmaken</li>
          <li>📈 Stap 2: Technische indicatoren toevoegen</li>
          <li>📊 Stap 3: Macrodata ophalen</li>
          <li>📄 Stap 4: Dashboard openen</li>
        </ul>
      </CardWrapper>
    </div>
  );
}
