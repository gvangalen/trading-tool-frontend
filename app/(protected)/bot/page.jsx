"use client";

import { useState } from "react";
import {
  Brain,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";

export default function BotPage() {
  // --------------------------------------------------
  // 🔧 MOCK DATA (later vervangen door API)
  // --------------------------------------------------
  const todayDecision = {
    date: "2025-12-29",
    action: "BUY", // BUY | HOLD | SELL | OBSERVE
    amount: 125,
    confidence: "High",
    reasons: [
      "Market score oversold (32)",
      "Smart DCA setup actief",
      "Macro neutraal",
      "RSI weekly < 40",
    ],
  };

  const scores = {
    macro: 55,
    market: 32,
    technical: 45,
    setup: 80,
  };

  const botRules = [
    { rule: "Market < 35", action: "BUY €150" },
    { rule: "Market 35–55", action: "BUY €125" },
    { rule: "Market 55–75", action: "BUY €100" },
    { rule: "Market > 75", action: "HOLD" },
    { rule: "Setup score < 40", action: "NO BUY" },
  ];

  const history = [
    {
      date: "2025-12-28",
      action: "BUY",
      amount: 100,
      confidence: "Medium",
      executed: true,
    },
    {
      date: "2025-12-27",
      action: "HOLD",
      amount: 0,
      confidence: "Low",
      executed: false,
    },
  ];

  const [botMode, setBotMode] = useState("manual"); // manual | semi | auto
  const [selectedBot, setSelectedBot] = useState("DCA Bot");

  // --------------------------------------------------
  // 🎨 Helpers
  // --------------------------------------------------
  const actionColor = {
    BUY: "text-green-600",
    HOLD: "text-yellow-600",
    SELL: "text-red-600",
    OBSERVE: "text-blue-600",
  };

  // --------------------------------------------------
  // 🧠 PAGE
  // --------------------------------------------------
  return (
    <div className="space-y-8">
      {/* ================================================= */}
      {/* 🧠 BOT DECISION TODAY */}
      {/* ================================================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Bot Decision Today</h2>
          </div>
          <span className="text-sm text-gray-500">{todayDecision.date}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Action */}
          <div>
            <p className="text-sm text-gray-500">Action</p>
            <p
              className={`text-3xl font-bold ${actionColor[todayDecision.action]}`}
            >
              {todayDecision.action}
            </p>
          </div>

          {/* Amount */}
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="text-3xl font-bold">
              €{todayDecision.amount}
            </p>
          </div>

          {/* Confidence */}
          <div>
            <p className="text-sm text-gray-500">Confidence</p>
            <p className="text-3xl font-bold">{todayDecision.confidence}</p>
          </div>
        </div>

        {/* Reasons */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-2">Why</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {todayDecision.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================================================= */}
      {/* 🤖 BOT SELECT + MODE */}
      {/* ================================================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bot select */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Bot</h3>
          <select
            value={selectedBot}
            onChange={(e) => setSelectedBot(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option>DCA Bot</option>
            <option>Swing Bot</option>
            <option disabled>Scalp Bot (coming soon)</option>
          </select>
        </div>

        {/* Mode */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Mode</h3>
          <div className="flex gap-4">
            {[
              { id: "manual", label: "Manual", icon: Pause },
              { id: "semi", label: "Semi-auto", icon: Play },
              { id: "auto", label: "Auto", icon: ArrowUpRight, disabled: true },
            ].map((m) => (
              <button
                key={m.id}
                disabled={m.disabled}
                onClick={() => setBotMode(m.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded border
                  ${
                    botMode === m.id
                      ? "bg-black text-white"
                      : "bg-white"
                  }
                  ${m.disabled ? "opacity-40 cursor-not-allowed" : ""}
                `}
              >
                <m.icon className="w-4 h-4" />
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* 📊 SCORES */}
      {/* ================================================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(scores).map(([k, v]) => (
            <div
              key={k}
              className="border rounded p-4 text-center"
            >
              <p className="text-sm text-gray-500 capitalize">{k}</p>
              <p className="text-2xl font-bold">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================= */}
      {/* 📐 BOT RULES */}
      {/* ================================================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">Bot Rules</h3>
        <ul className="space-y-2 text-sm">
          {botRules.map((r, i) => (
            <li
              key={i}
              className="flex justify-between border-b pb-2"
            >
              <span>{r.rule}</span>
              <span className="font-medium">{r.action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ================================================= */}
      {/* 🧾 ORDER PREVIEW */}
      {/* ================================================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">Order Preview</h3>

        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Symbol</p>
            <p className="font-medium">BTC</p>
          </div>
          <div>
            <p className="text-gray-500">Side</p>
            <p className="font-medium">{todayDecision.action}</p>
          </div>
          <div>
            <p className="text-gray-500">Amount</p>
            <p className="font-medium">€{todayDecision.amount}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">Planned</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 text-white">
            <CheckCircle className="w-4 h-4" />
            Mark Executed
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded bg-gray-200">
            <XCircle className="w-4 h-4" />
            Skip Today
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* 📜 BOT HISTORY */}
      {/* ================================================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold mb-4">Bot History</h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Date</th>
              <th>Action</th>
              <th>Amount</th>
              <th>Confidence</th>
              <th>Executed</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{h.date}</td>
                <td>{h.action}</td>
                <td>€{h.amount}</td>
                <td>{h.confidence}</td>
                <td>{h.executed ? "✔" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
