"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { loadQuotes, type Quote, type QuoteStatus } from "@/lib/quotes";
import { loadInvoices } from "@/lib/invoices";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("sv-SE", { day: "numeric", month: "short" });

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-purple-500", "bg-blue-500", "bg-emerald-500",
  "bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-cyan-500",
];
const avatarColor = (str: string) => AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const statusLabel: Record<QuoteStatus, string> = {
  draft: "Utkast", sent: "Skickad", opened: "Öppnad", accepted: "Accepterad", declined: "Avvisad",
};

type ActivityItem = {
  type: QuoteStatus;
  message: string;
  time: string;
  iconBg: string;
  iconColor: string;
};

function buildActivity(quotes: Quote[]): ActivityItem[] {
  const events: { ts: number; item: ActivityItem }[] = [];
  for (const q of quotes) {
    const push = (ts: string, type: QuoteStatus, msg: string, iconBg: string, iconColor: string) => {
      events.push({ ts: new Date(ts).getTime(), item: { type, message: msg, time: fmtDate(ts), iconBg, iconColor } });
    };
    if (q.acceptedAt) push(q.acceptedAt, "accepted", `${q.clientCompany || q.clientName} accepterade ${q.quoteNumber}`, "bg-emerald-100", "text-emerald-600");
    if (q.declinedAt) push(q.declinedAt, "declined", `${q.clientCompany || q.clientName} avböjde ${q.quoteNumber}`, "bg-red-100", "text-red-600");
    if (q.openedAt) push(q.openedAt, "opened", `${q.clientCompany || q.clientName} öppnade ${q.quoteNumber}`, "bg-amber-100", "text-amber-600");
    if (q.sentAt) push(q.sentAt, "sent", `${q.quoteNumber} skickades till ${q.clientCompany || q.clientName}`, "bg-blue-100", "text-blue-600");
    push(q.createdAt, "draft", `${q.quoteNumber} skapades (${q.clientCompany || q.clientName})`, "bg-gray-100", "text-gray-600");
  }
  return events
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 8)
    .map((e) => e.item);
}

const ActivityIcon = ({ type, color }: { type: QuoteStatus; color: string }) => {
  const cls = `w-4 h-4 ${color}`;
  if (type === "accepted") return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
  if (type === "declined") return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
  if (type === "opened") return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
  if (type === "sent") return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
  return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoiceTotals, setInvoiceTotals] = useState({ paid: 0, pending: 0 });

  useEffect(() => {
    const qs = loadQuotes();
    setQuotes(qs);
    const invs = loadInvoices();
    setInvoiceTotals({
      paid: invs.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0),
      pending: invs.filter((i) => i.status === "sent").reduce((s, i) => s + i.total, 0),
    });
  }, []);

  const total = quotes.length;
  const open = quotes.filter((q) => q.status === "sent" || q.status === "opened").length;
  const accepted = quotes.filter((q) => q.status === "accepted").length;
  const totalValue = quotes.reduce((s, q) => s + q.total, 0);
  const winRate = total > 0 ? Math.round((accepted / total) * 100) : 0;
  const avgValue = total > 0 ? totalValue / total : 0;
  const recentQuotes = [...quotes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const activity = buildActivity(quotes);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Översikt</h1>
            <p className="text-sm text-gray-500 mt-0.5">Välkommen! Här är vad som händer med dina offerter.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors shrink-0"
            >
              Ny faktura
            </Link>
            <Link
              href="/quotes/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Ny offert
            </Link>
          </div>
        </div>

        {/* Statistikrad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Totalt offerter"
            value={String(total)}
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <StatCard
            title="Öppna offerter"
            value={String(open)}
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Accepterade"
            value={accepted > 0 ? `${accepted} (${winRate}%)` : "0"}
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Totalt offertvärde"
            value={SEK(totalValue)}
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        {/* Faktura-snabbkort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Betalda fakturor</p>
              <p className="text-lg font-bold text-gray-900">{SEK(invoiceTotals.paid)}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Väntande fakturor</p>
              <p className="text-lg font-bold text-gray-900">{SEK(invoiceTotals.pending)}</p>
            </div>
          </div>
        </div>

        {/* Huvud-grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Senaste offerter */}
          <div className="xl:col-span-2">
            <Card padding="none">
              <CardHeader className="px-6 pt-5 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Senaste offerter</CardTitle>
                  <Link href="/quotes" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
                    Visa alla
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </CardHeader>
              <div className="mt-4">
                {recentQuotes.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <p className="text-sm text-gray-500">Inga offerter ännu.</p>
                    <Link href="/quotes/new" className="text-sm text-indigo-600 hover:underline mt-1 inline-block">Skapa din första offert →</Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Kund</th>
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Belopp</th>
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Status</th>
                          <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Datum</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {recentQuotes.map((q) => (
                          <tr key={q.id} className="table-row-hover">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${avatarColor(q.clientName)} text-white text-sm font-semibold flex items-center justify-center shrink-0`}>
                                  {q.clientName.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{q.clientName}</p>
                                  <p className="text-xs text-gray-500">{q.quoteNumber}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3.5">
                              <span className="text-sm font-semibold text-gray-900">{SEK(q.total)}</span>
                            </td>
                            <td className="px-3 py-3.5">
                              <Badge variant={q.status} dot>{statusLabel[q.status]}</Badge>
                            </td>
                            <td className="px-3 py-3.5">
                              <span className="text-sm text-gray-500">{fmtDate(q.createdAt)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Aktivitetsflöde */}
          <div className="xl:col-span-1">
            <Card padding="none" className="h-full">
              <CardHeader className="px-6 pt-5 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Aktivitetsflöde</CardTitle>
                </div>
              </CardHeader>
              <div className="px-6 py-4 space-y-4 mt-2">
                {activity.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">Ingen aktivitet ännu</p>
                ) : (
                  activity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full ${a.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <ActivityIcon type={a.type} color={a.iconColor} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 leading-snug">{a.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Snabbstatistik */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Genomsnittligt offertvärde</p>
              <p className="text-lg font-bold text-gray-900">{SEK(avgValue)}</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Vinstfrekvens</p>
              <p className="text-lg font-bold text-gray-900">{winRate}%</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Unika kunder (offerter)</p>
              <p className="text-lg font-bold text-gray-900">{new Set(quotes.map((q) => q.clientEmail)).size}</p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
