"use client";

import { Loader2 } from "lucide-react";

export default function ReportGenerateOverlay({ text }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Ring */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-white/10" />
          <div className="absolute inset-0 rounded-full border-4 border-t-white animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-white">
            AI
          </div>
        </div>

        {/* Status */}
        <div className="text-center text-white space-y-1">
          <div className="text-lg font-medium">
            Rapport wordt gegenereerd
          </div>
          <div className="text-sm text-white/70">
            {text || "Analyse en synthese bezig…"}
          </div>
        </div>
      </div>
    </div>
  );
}
