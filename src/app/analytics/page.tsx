"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const monthlyData = [
  { month: "Apr", revenue: 28000, quotes: 7, accepted: 4 },
  { month: "Maj", revenue: 35000, quotes: 9, accepted: 6 },
  { month: "Jun", revenue: 31000, quotes: 8, accepted: 5 },
  { month: "Jul", revenue: 22000, quotes: 5, accepted: 3 },
  { month: "Aug", revenue: 45000, quotes: 11, accepted: 8 },
  { month: "Sep", revenue: 38000, quotes: 10, accepted: 7 },
  { month: "Okt", revenue: 52000, quotes: 13, accepted: 10 },
  { month: "Nov", revenue: 48000, quotes: 12, accepted: 9 },
  { month: "Dec", revenue: 41000, quotes: 10, accepted: 7 },
  { month: "Jan", revenue: 55000, quotes: 14, accepted: 11 },
  { month: "Feb", revenue: 67000, quotes: 16, accepted: 13 },
  { month: "Mar", revenue: 58000, quotes: 15, accepted: 12 },
];

const topClients = [
  { name: "Byggmax AB", company: "Byggmax AB", total: 124500, quotes: 8, rate: 88 },
  { name: "Teknik Solutions", company: "Teknik Solutions", total: 98200, quotes: 6, rate: 83 },
  { name: "Nordic Retail", company: "Nordic Retail", total: 87600, quotes: 7, rate: 71 },
  { name: "Fastighets AB Sthlm", company: "Fastighets AB Sthlm", total: 76300, quotes: 5, rate: 80 },
  { name: "Media & Co", company: "Media & Co", total: 54100, quotes: 4, rate: 75 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSEK(n: number) {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);
}

function formatSEKShort(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(0) + " k";
  return n.toString();
}

// ---------------------------------------------------------------------------
// SVG Line Chart
// ---------------------------------------------------------------------------

function LineChart({ data }: { data: { month: string; revenue: number }[] }) {
  const W = 560;
  const H = 180;
  const PAD = { top: 16, right: 24, bottom: 32, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => d.revenue));
  const minVal = 0;

  const xOf = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
  const yOf = (v: number) => PAD.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const points = data.map((d, i) => ({ x: xOf(i), y: yOf(d.revenue) }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath =
    `M ${points[0].x} ${PAD.top + innerH} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x} ${PAD.top + innerH} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minVal + t * maxVal);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y-axis gridlines */}
      {yTicks.map((v, i) => (
        <g key={i}>
          <line
            x1={PAD.left} y1={yOf(v)} x2={PAD.left + innerW} y2={yOf(v)}
            stroke="#F1F5F9" strokeWidth={1}
          />
          <text x={PAD.left - 8} y={yOf(v) + 4} textAnchor="end" fontSize={10} fill="#94A3B8">
            {formatSEKShort(v)}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path d={linePath} fill="none" stroke="#6366F1" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#6366F1" stroke="#fff" strokeWidth={2} />
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize={10} fill="#94A3B8">
          {d.month}
        </text>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SVG Bar Chart (quotes per month)
// ---------------------------------------------------------------------------

function BarChart({ data }: { data: { month: string; quotes: number; accepted: number }[] }) {
  const W = 560;
  const H = 140;
  const PAD = { top: 12, right: 16, bottom: 28, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => d.quotes));
  const barW = (innerW / data.length) * 0.5;
  const gap = (innerW / data.length) * 0.5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      {data.map((d, i) => {
        const x = PAD.left + i * (barW + gap) + gap / 2;
        const totalH = (d.quotes / maxVal) * innerH;
        const acceptedH = (d.accepted / maxVal) * innerH;

        return (
          <g key={i}>
            {/* Total bar (background) */}
            <rect
              x={x} y={PAD.top + innerH - totalH}
              width={barW} height={totalH}
              rx={3} fill="#EEF2FF"
            />
            {/* Accepted bar (foreground) */}
            <rect
              x={x} y={PAD.top + innerH - acceptedH}
              width={barW} height={acceptedH}
              rx={3} fill="#6366F1"
            />
            {/* X label */}
            <text
              x={x + barW / 2} y={H - 8}
              textAnchor="middle" fontSize={9} fill="#94A3B8"
            >
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Donut Chart (status breakdown)
// ---------------------------------------------------------------------------

function DonutChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  const R = 52;
  const stroke = 18;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * R;

  let offset = 0;
  const arcs = slices.map((sl) => {
    const pct = sl.value / total;
    const dash = pct * circumference;
    const arc = { ...sl, dash, offset, pct };
    offset += dash;
    return arc;
  });

  return (
    <svg viewBox="0 0 140 140" className="w-36 h-36 shrink-0">
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={arc.color}
          strokeWidth={stroke}
          strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
          strokeDashoffset={-arc.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={18} fontWeight="700" fill="#0F172A">
        {total}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill="#94A3B8">
        offerter
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("12m");

  const periodData = {
    "3m": monthlyData.slice(-3),
    "6m": monthlyData.slice(-6),
    "12m": monthlyData,
  }[period] ?? monthlyData;

  const totalRevenue = periodData.reduce((s, d) => s + d.revenue, 0);
  const totalQuotes = periodData.reduce((s, d) => s + d.quotes, 0);
  const totalAccepted = periodData.reduce((s, d) => s + d.accepted, 0);
  const winRate = Math.round((totalAccepted / totalQuotes) * 100);
  const avgQuote = Math.round(totalRevenue / totalAccepted);

  const donutSlices = [
    { label: "Accepterade", value: totalAccepted, color: "#10B981" },
    { label: "Avböjda", value: Math.round(totalQuotes * 0.15), color: "#EF4444" },
    { label: "Öppnade", value: Math.round(totalQuotes * 0.12), color: "#F59E0B" },
    { label: "Skickade", value: Math.round(totalQuotes * 0.08), color: "#3B82F6" },
    { label: "Utkast", value: totalQuotes - totalAccepted - Math.round(totalQuotes * 0.35), color: "#E2E8F0" },
  ];

  const kpis = [
    {
      label: "Total intäkt",
      value: formatSEK(totalRevenue),
      change: "+18%",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Genomsnittlig offert",
      value: formatSEK(avgQuote),
      change: "+8%",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bg: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Vinstfrekvens",
      value: `${winRate}%`,
      change: "+4%",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      bg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Skickade offerter",
      value: totalQuotes.toString(),
      change: "+23%",
      up: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      bg: "bg-blue-50 text-blue-600",
    },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Rubrik */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analys</h1>
            <p className="text-sm text-gray-500 mt-0.5">Spåra dina offerters prestanda och intäkter</p>
          </div>
          {/* Periodsväljare */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(["3m", "6m", "12m"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p === "3m" ? "3 mån" : p === "6m" ? "6 mån" : "12 mån"}
              </button>
            ))}
          </div>
        </div>

        {/* KPI-kort */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                  {kpi.icon}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kpi.up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 leading-none mb-1">{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Intäktsgraf */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Intäktsutveckling</h2>
              <p className="text-xs text-gray-400 mt-0.5">Accepterade offerter per månad</p>
            </div>
            <span className="text-sm font-bold text-indigo-600">{formatSEK(totalRevenue)}</span>
          </div>
          <LineChart data={periodData} />
        </div>

        {/* Två kolumner: bar chart + donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Offertvolym */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-gray-900">Offertvolym</h2>
            </div>
            <p className="text-xs text-gray-400 mb-4">Skickade vs accepterade per månad</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 inline-block" />
                Accepterade
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-100 inline-block" />
                Skickade
              </span>
            </div>
            <BarChart data={periodData} />
          </div>

          {/* Statusfördelning */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Statusfördelning</h2>
            <p className="text-xs text-gray-400 mb-5">Alla offerter denna period</p>
            <div className="flex items-center gap-6">
              <DonutChart slices={donutSlices} />
              <div className="flex-1 space-y-2.5">
                {donutSlices.map((sl, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sl.color }} />
                      {sl.label}
                    </span>
                    <span className="font-semibold text-gray-900">{sl.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Topp-kunder */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="p-5 sm:p-6 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900">Topp-kunder</h2>
            <p className="text-xs text-gray-400 mt-0.5">Kunder med högst total offertvärde</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 sm:px-6 py-3">Kund</th>
                  <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Offerter</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Vinstfrekvens</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 sm:px-6 py-3">Totalt värde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topClients.map((client, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {client.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{client.company}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-500">{client.quotes}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${client.rate}%` }} />
                        </div>
                        <span className="text-sm text-gray-700 font-medium w-8 text-right">{client.rate}%</span>
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {formatSEK(client.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Konverteringstratt */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Konverteringstratt</h2>
          <p className="text-xs text-gray-400 mb-6">Hur offerter rör sig genom processen</p>
          <div className="space-y-3">
            {[
              { label: "Skapade", value: totalQuotes, pct: 100, color: "bg-gray-200" },
              { label: "Skickade", value: Math.round(totalQuotes * 0.9), pct: 90, color: "bg-blue-400" },
              { label: "Öppnade", value: Math.round(totalQuotes * 0.72), pct: 72, color: "bg-amber-400" },
              { label: "Accepterade", value: totalAccepted, pct: winRate, color: "bg-emerald-500" },
            ].map((stage, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 shrink-0 text-sm text-gray-600">{stage.label}</div>
                <div className="flex-1 bg-gray-50 rounded-full h-7 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.color} transition-all duration-700 flex items-center justify-end pr-3`}
                    style={{ width: `${stage.pct}%` }}
                  >
                    <span className="text-xs font-semibold text-white">{stage.pct}%</span>
                  </div>
                </div>
                <div className="w-10 shrink-0 text-right text-sm font-semibold text-gray-900">{stage.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
