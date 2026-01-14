"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import CardLoader from "@/components/ui/CardLoader";
import { ShoppingCart, AlertTriangle } from "lucide-react";

export default function BotOrderPreview({
  order = null,
  loading = false,
  onExecute,
  onSkip,
}) {
  const isReady = order?.status === "ready";

  const statusClass = {
    ready: "text-green-600",
    filled: "text-green-700",
    cancelled: "text-gray-500",
    skipped: "text-gray-500",
    failed: "text-red-600",
  };

  return (
    <CardWrapper
      title="Order Preview"
      icon={<ShoppingCart className="icon" />}
    >
      {/* ===================== */}
      {/* LOADING */}
      {/* ===================== */}
      {loading && <CardLoader text="Order laden…" />}

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
          {/* ⚠️ PAPER NOTICE */}
          <div className="flex items-center gap-2 mb-4 text-xs text-orange-600">
            <AlertTriangle size={14} />
            <span>
              Dit is een <b>paper order</b>. Er wordt niets live verhandeld.
            </span>
          </div>

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
                {(order.side || "—").toUpperCase()}
              </div>
            </div>

            <div>
              <div className="text-[var(--text-muted)]">Amount</div>
              <div className="font-medium">
                €{order.quote_amount_eur ?? 0}
              </div>
            </div>

            <div>
              <div className="text-[var(--text-muted)]">Status</div>
              <div
                className={`font-medium ${
                  statusClass[order.status] || ""
                }`}
              >
                {order.status || "planned"}
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* ACTIONS */}
          {/* ===================== */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onExecute}
              className="btn-primary"
              disabled={!isReady || !onExecute}
            >
              Execute
            </button>

            <button
              onClick={onSkip}
              className="btn-secondary"
              disabled={!isReady || !onSkip}
            >
              Skip today
            </button>
          </div>

          {!isReady && (
            <p className="text-xs text-[var(--text-muted)] mt-3">
              Deze order kan niet meer worden uitgevoerd.
            </p>
          )}
        </>
      )}
    </CardWrapper>
  );
}
