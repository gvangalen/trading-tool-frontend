"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { ShoppingCart } from "lucide-react";

export default function BotOrderPreview({
  order = null,
  loading = false,
  onMarkExecuted,
  onSkip,
}) {
  return (
    <CardWrapper
      title="Order Preview"
      icon={<ShoppingCart className="icon" />}
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && (
        <CardLoader text="Order laden…" />
      )}

      {/* ===================== */}
      {/* EMPTY STATE */}
      {/* ===================== */}
      {!loading && !order && (
        <p className="text-sm text-[var(--text-muted)]">
          Geen order gepland voor vandaag.
        </p>
      )}

      {/* ===================== */}
      {/* ORDER DETAILS */}
      {/* ===================== */}
      {!loading && order && (
        <>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-[var(--text-muted)]">Symbol</div>
              <div className="font-medium">
                {order.symbol || "—"}
              </div>
            </div>

            <div>
              <div className="text-[var(--text-muted)]">Side</div>
              <div className="font-medium">
                {(order.side || order.action || "—").toUpperCase()}
              </div>
            </div>

            <div>
              <div className="text-[var(--text-muted)]">Amount</div>
              <div className="font-medium">
                €{order.amount_eur ?? order.amount ?? 0}
              </div>
            </div>

            <div>
              <div className="text-[var(--text-muted)]">Status</div>
              <div className="font-medium">
                {order.status || "planned"}
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* ACTIONS */}
          {/* ===================== */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onMarkExecuted}
              className="btn-primary"
              disabled={!onMarkExecuted}
            >
              Mark executed
            </button>

            <button
              onClick={onSkip}
              className="btn-secondary"
              disabled={!onSkip}
            >
              Skip today
            </button>
          </div>
        </>
      )}
    </CardWrapper>
  );
}
