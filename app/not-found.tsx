"use client";

import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0b1220] to-[#020617] px-6">
      <div className="max-w-md text-center">
        
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <AlertTriangle size={28} />
          </div>
        </div>

        {/* Titel */}
        <h1 className="mb-3 text-3xl font-semibold tracking-tight text-white">
          404 – Page not found
        </h1>

        {/* Subtekst */}
        <p className="mb-8 text-sm leading-relaxed text-gray-400">
          The page you’re looking for doesn’t exist or has been moved.
          <br />
          Market data is fine — this route isn’t.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        {/* Footer hint */}
        <p className="mt-8 text-xs text-gray-500">
          Trade Layer · System route error
        </p>
      </div>
    </div>
  );
}
