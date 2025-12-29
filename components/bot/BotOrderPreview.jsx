"use client";

import CardWrapper from "@/components/ui/CardWrapper";
import { ShoppingCart } from "lucide-react";

export default function BotOrderPreview({ order, onMarkExecuted, onSkip }) {
  if (!order) return null;

  return (
    <CardWrapper
      title="Order Preview"
      icon={<ShoppingCart className="icon" />}
    >
      <div className="grid md:grid-cols-4 gap-4 text-sm">
        <div>
          <div className="text-[var(--text-muted)]">Symbol</div>
          <div className="font-medium">{order.symbol}</div>
        </div>
        <div>
          <div className="text-[var(--text-muted)]">Side</div>
          <div className="font-medium">{order.action}</div>
        </div>
        <div>
          <div className="text-[var(--text-muted)]">Amount</div>
          <div className="font-medium">€{order.amount}</div>
        </div>
        <div>
          <div className="text-[var(--text-muted)]">Status</div>
          <div className="font-medium">{order.status}</div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onMarkExecuted} className="btn-primary">
          Mark executed
        </button>
        <button onClick={onSkip} className="btn-secondary">
          Skip today
        </button>
      </div>
    </CardWrapper>
  );
}
