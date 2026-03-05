"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type InvoiceStatus = "utkast" | "skickad" | "betald" | "förfallen" | "delvis";

interface Invoice {
  id: string;
  number: string;
  client: string;
  company: string;
  amount: number;
  issued: string;
  due: string;
  status: InvoiceStatus;
  paid?: number;
}

const invoices: Invoice[] = [
  { id: "1", number: "FAK-2024-001", client: "Anna Lindqvist", company: "Byggmax AB", amount: 45000, issued: "2024-11-01", due: "2024-11-30", status: "betald" },
  { id: "2", number: "FAK-2024-002", client: "Erik Svensson", company: "Teknik Solutions", amount: 32500, issued: "2024-11-10", due: "2024-12-10", status: "betald" },
  { id: "3", number: "FAK-2024-003", client: "Maria Bergström", company: "Nordic Retail", amount: 18750, issued: "2024-11-20", due: "2024-12-20", status: "förfallen" },
  { id: "4", number: "FAK-2024-004", client: "Johan Karlsson", company: "Fastighets AB", amount: 67000, issued: "2024-12-01", due: "2024-12-31", status: "skickad" },
  { id: "5", number: "FAK-2024-005", client: "Sara Nilsson", company: "Media & Co", amount: 12000, issued: "2024-12-05", due: "2025-01-05", status: "delvis", paid: 6000 },
  { id: "6", number: "FAK-2024-006", client: "Peter Andersen", company: "Web Studio", amount: 28000, issued: "2024-12-10", due: "2025-01-10", status: "skickad" },
  { id: "7", number: "FAK-2025-001", client: "Lisa Holm", company: "Green Energy AB", amount: 54000, issued: "2025-01-05", due: "2025-02-05", status: "betald" },
  { id: "8", number: "FAK-2025-002", client: "Anders Persson", company: "LogiTrans", amount: 9800, issued: "2025-01-15", due: "2025-02-15", status: "skickad" },
  { id: "9", number: "FAK-2025-003", client: "Karin Johansson", company: "Restaurang Nord", amount: 22500, issued: "2025-02-01", due: "2025-03-01", status: "förfallen" },
  { id: "10", number: "FAK-2025-004", client: "Thomas Eriksson", company: "IT Konsult AB", amount: 41000, issued: "2025-02-10", due: "2025-03-10", status: "utkast" },
  { id: "11", number: "FAK-2025-005", client: "Emma Gustafsson", company: "Fashion House", amount: 15600, issued: "2025-02-20", due: "2025-03-20", status: "skickad" },
  { id: "12", number: "FAK-2025-006", client: "Mikael Larsson", company: "AutoService AB", amount: 8400, issued: "2025-03-01", due: "2025-04-01", status: "utkast" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSEK(n: number) {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
}

const statusConfig: Record<InvoiceStatus, { label: string; bg: string; text: string; dot: string }> = {
  utkast:  { label: "Utkast",       bg: "bg-gray-100",    text: "text-gray-600",   dot: "bg-gray-400"   },
  skickad: { label: "Skickad",      bg: "bg-blue-50",     text: "text-blue-700",   dot: "bg-blue-500"   },
  betald:  { label: "Betald",       bg: "bg-emerald-50",  text: "text-emerald-700",dot: "bg-emerald-500"},
  förfallen:{ label: "Förfallen",   bg: "bg-red-50",      text: "text-red-700",    dot: "bg-red-500"    },
  delvis:  { label: "Delvis betald",bg: "bg-amber-50",    text: "text-amber-700",  dot: "bg-amber-500"  },
};

const tabs: { key: InvoiceStatus | "alla"; label: string }[] = [
  { key: "alla",     label: "Alla" },
  { key: "utkast",   label: "Utkast" },
  { key: "skickad",  label: "Skickad" },
  { key: "betald",   label: "Betald" },
  { key: "förfallen",label: "Förfallen" },
  { key: "delvis",   label: "Delvis betald" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<InvoiceStatus | "alla">("alla");
  const [search, setSearch] = useState("");

  const filtered = invoices.filter((inv) => {
    const matchTab = activeTab === "alla" || inv.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      inv.number.toLowerCase().includes(q) ||
      inv.client.toLowerCase().includes(q) ||
      inv.company.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const totalPaid    = invoices.filter((i) => i.status === "betald").reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === "skickad").reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter((i) => i.status === "förfallen").reduce((s, i) => s + i.amount, 0);

  const tabCounts = Object.fromEntries(
    tabs.map(({ key }) => [key, key === "alla" ? invoices.length : invoices.filter((i) => i.status === key).length])
  );

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Rubrik */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fakturor</h1>
            <p className="text-sm text-gray-500 mt-0.5">Hantera och skicka fakturor till dina kunder</p>
          </div>
          <Link
            href="/invoices/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ny faktura
          </Link>
        </div>

        {/* Sammanfattningskort */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Betalda</p>
            <p className="text-2xl font-bold text-gray-900">{formatSEK(totalPaid)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{invoices.filter((i) => i.status === "betald").length} fakturor</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Väntande</p>
            <p className="text-2xl font-bold text-gray-900">{formatSEK(totalPending)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{invoices.filter((i) => i.status === "skickad").length} fakturor</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Förfallna</p>
            <p className="text-2xl font-bold text-gray-900">{formatSEK(totalOverdue)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{invoices.filter((i) => i.status === "förfallen").length} fakturor</p>
          </div>
        </div>

        {/* Filter & sök */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Flikar */}
          <div className="border-b border-gray-100 px-4 sm:px-6 overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === key
                      ? "border-indigo-600 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === key ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tabCounts[key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sök */}
          <div className="px-4 sm:px-6 py-3 border-b border-gray-50">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sök fakturanummer, kund eller företag..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Tabell */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 sm:px-6 py-3">Fakturanr</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Kund</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Belopp</th>
                  <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Utfärdad</th>
                  <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Förfaller</th>
                  <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 sm:px-6 py-3">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((inv) => {
                  const s = statusConfig[inv.status];
                  const isOverdue = inv.status === "förfallen";
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 sm:px-6 py-4">
                        <span className="text-sm font-mono font-medium text-indigo-600">{inv.number}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{inv.client}</p>
                        <p className="text-xs text-gray-400">{inv.company}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatSEK(inv.amount)}</p>
                        {inv.status === "delvis" && inv.paid && (
                          <p className="text-xs text-amber-600">Betalt: {formatSEK(inv.paid)}</p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-500">{formatDate(inv.issued)}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                          {formatDate(inv.due)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 sm:px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button title="Visa" className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button title="Skicka" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                          {inv.status !== "betald" && (
                            <button title="Markera som betald" className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          <button title="Ta bort" className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">Inga fakturor hittades</p>
                <p className="text-gray-400 text-sm mt-1">Prova en annan sökning eller skapa en ny faktura</p>
              </div>
            )}
          </div>

          {/* Sidfot */}
          {filtered.length > 0 && (
            <div className="px-5 sm:px-6 py-4 border-t border-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">Visar {filtered.length} av {invoices.length} fakturor</p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Föregående
                </button>
                <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  1
                </button>
                <button className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Nästa
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
