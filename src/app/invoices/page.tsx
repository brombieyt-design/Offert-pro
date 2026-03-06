"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { type Invoice, type InvoiceStatus, loadInvoices, deleteInvoice, updateInvoice } from "@/lib/invoices";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

const fmtDate = (s?: string) => {
  if (!s) return "–";
  return new Date(s).toLocaleDateString("sv-SE", { year: "numeric", month: "short", day: "numeric" });
};

const statusConfig: Record<InvoiceStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft:   { label: "Utkast",        bg: "bg-gray-100",   text: "text-gray-600",    dot: "bg-gray-400" },
  sent:    { label: "Skickad",       bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
  paid:    { label: "Betald",        bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  overdue: { label: "Förfallen",     bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500" },
  partial: { label: "Delvis betald", bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
};

const statusLabel: Record<InvoiceStatus, string> = {
  draft: "Utkast",
  sent: "Skickad",
  paid: "Betald",
  overdue: "Förfallen",
  partial: "Delvis betald",
};

const tabs: { key: InvoiceStatus | "alla"; label: string }[] = [
  { key: "alla",    label: "Alla" },
  { key: "draft",   label: "Utkast" },
  { key: "sent",    label: "Skickad" },
  { key: "paid",    label: "Betald" },
  { key: "overdue", label: "Förfallen" },
  { key: "partial", label: "Delvis betald" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeTab, setActiveTab] = useState<InvoiceStatus | "alla">("alla");
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);

  const reload = useCallback(() => setInvoices(loadInvoices()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = invoices.filter((inv) => {
    const matchTab = activeTab === "alla" || inv.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.clientName.toLowerCase().includes(q) ||
      inv.clientCompany.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const totalPaid    = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter((i) => i.status === "sent").reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0);

  const tabCounts = Object.fromEntries(
    tabs.map(({ key }) => [key, key === "alla" ? invoices.length : invoices.filter((i) => i.status === key).length])
  );

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    reload();
    setConfirmDeleteId(null);
  };

  const handleMarkPaid = (id: string) => {
    updateInvoice(id, { status: "paid", paidAt: new Date().toISOString() });
    reload();
  };

  const handleStatusChange = (id: string, status: InvoiceStatus) => {
    updateInvoice(id, { status });
    reload();
    setStatusMenuId(null);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fakturor</h1>
            <p className="text-sm text-gray-500 mt-0.5">{invoices.length} fakturor totalt</p>
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
            <p className="text-2xl font-bold text-gray-900">{SEK(totalPaid)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{invoices.filter((i) => i.status === "paid").length} fakturor</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Väntande</p>
            <p className="text-2xl font-bold text-gray-900">{SEK(totalPending)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{invoices.filter((i) => i.status === "sent").length} fakturor</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Förfallna</p>
            <p className="text-2xl font-bold text-gray-900">{SEK(totalOverdue)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{invoices.filter((i) => i.status === "overdue").length} fakturor</p>
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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <p className="text-sm text-gray-500">Inga fakturor hittades</p>
                      <Link href="/invoices/new" className="text-sm text-indigo-600 hover:underline mt-1 inline-block">
                        Skapa din första faktura →
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => {
                    const s = statusConfig[inv.status];
                    const isOverdue = inv.status === "overdue";
                    return (
                      <tr key={inv.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 sm:px-6 py-4">
                          <span className="text-sm font-mono font-medium text-indigo-600">{inv.invoiceNumber}</span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-sm font-medium text-gray-900">{inv.clientName}</p>
                          <p className="text-xs text-gray-400">{inv.clientCompany}</p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="text-sm font-semibold text-gray-900">{SEK(inv.customerPays ?? inv.total)}</p>
                          {inv.rotDeduction > 0 && (
                            <p className="text-xs text-emerald-600">-{SEK(inv.rotDeduction)} ROT/RUT</p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center text-sm text-gray-500">{fmtDate(inv.issuedAt)}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`text-sm ${isOverdue ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                            {fmtDate(inv.dueAt)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="relative inline-block">
                            <button
                              onClick={() => setStatusMenuId(statusMenuId === inv.id ? null : inv.id)}
                              title="Klicka för att ändra status"
                            >
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                {s.label}
                              </span>
                            </button>
                            {statusMenuId === inv.id && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setStatusMenuId(null)} />
                                <div className="absolute z-20 top-8 left-0 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
                                  {(["draft","sent","paid","overdue","partial"] as InvoiceStatus[]).map((st) => (
                                    <button
                                      key={st}
                                      onClick={() => handleStatusChange(inv.id, st)}
                                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${inv.status === st ? "font-semibold text-indigo-600" : "text-gray-700"}`}
                                    >
                                      {statusLabel[st]}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-5 sm:px-6 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {inv.status !== "paid" && (
                              <button
                                onClick={() => handleMarkPaid(inv.id)}
                                title="Markera som betald"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => setConfirmDeleteId(inv.id)}
                              title="Ta bort"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Radera-dialog */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Ta bort faktura?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {invoices.find((i) => i.id === confirmDeleteId)?.invoiceNumber} tas bort permanent.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Avbryt</button>
              <button onClick={() => handleDelete(confirmDeleteId)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">Ta bort</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
