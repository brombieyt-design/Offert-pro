"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/Badge";
import { type Quote, type QuoteStatus, loadQuotes, deleteQuote, updateQuote } from "@/lib/quotes";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso?: string) => {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("sv-SE", { day: "numeric", month: "short", year: "numeric" });
};

const expiryDate = (createdAt: string, validDays: number) => {
  const d = new Date(createdAt);
  d.setDate(d.getDate() + validDays);
  return fmtDate(d.toISOString());
};

const AVATAR_COLORS = [
  "bg-indigo-500", "bg-purple-500", "bg-blue-500", "bg-emerald-500",
  "bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-cyan-500",
];
const avatarColor = (str: string) => AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];

const tabs = [
  { label: "Alla", value: "all" },
  { label: "Utkast", value: "draft" },
  { label: "Skickad", value: "sent" },
  { label: "Öppnad", value: "opened" },
  { label: "Accepterad", value: "accepted" },
  { label: "Avvisad", value: "declined" },
];

const statusLabel: Record<QuoteStatus, string> = {
  draft: "Utkast",
  sent: "Skickad",
  opened: "Öppnad",
  accepted: "Accepterad",
  declined: "Avvisad",
};

const ITEMS_PER_PAGE = 8;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function QuotesPage() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [statusMenuId, setStatusMenuId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const reload = useCallback(() => setQuotes(loadQuotes()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = quotes.filter((q) => {
    const matchesTab = activeTab === "all" || q.status === activeTab;
    const matchesSearch =
      search === "" ||
      q.clientName.toLowerCase().includes(search.toLowerCase()) ||
      q.clientCompany.toLowerCase().includes(search.toLowerCase()) ||
      q.quoteNumber.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    deleteQuote(id);
    reload();
    setConfirmDeleteId(null);
  };

  const handleStatusChange = (id: string, status: QuoteStatus) => {
    const now = new Date().toISOString();
    const extra: Partial<Quote> = { status };
    if (status === "sent") extra.sentAt = now;
    if (status === "opened") extra.openedAt = now;
    if (status === "accepted") extra.acceptedAt = now;
    if (status === "declinced") extra.declinedAt = now;
    updateQuote(id, extra);
    reload();
    setStatusMenuId(null);
  };

  const handleCopyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/q/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConvertToInvoice = (q: Quote) => {
    // Store quote data in sessionStorage so invoice wizard can pre-fill
    sessionStorage.setItem("prefill_invoice", JSON.stringify({
      clientName: q.clientName,
      clientEmail: q.clientEmail,
      clientPhone: q.clientPhone,
      clientCompany: q.clientCompany,
      clientAddress: q.clientAddress,
      clientCity: q.clientCity,
      lineItems: q.lineItems,
      taxRate: q.taxRate,
      sourceQuoteId: q.id,
    }));
    router.push("/invoices/new");
  };

  const tabCounts = tabs.map((tab) => ({
    ...tab,
    count: tab.value === "all" ? quotes.length : quotes.filter((q) => q.status === tab.value).length,
  }));

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Offerter</h1>
            <p className="text-sm text-gray-500 mt-0.5">{quotes.length} offerter totalt</p>
          </div>
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

        {/* Filter */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-1 px-4 pt-4 border-b border-gray-100 overflow-x-auto">
            {tabCounts.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap -mb-px ${
                  activeTab === tab.value
                    ? "text-indigo-600 border-indigo-600 bg-indigo-50/50"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                  activeTab === tab.value ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="px-4 py-3 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-0" style={{ minWidth: "180px" }}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Sök klient, företag eller nummer..."
                value={search}
                onChange={handleSearch}
                className="form-input pl-9 w-full"
              />
            </div>
          </div>
        </div>

        {/* Tabell */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Offert</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Kund</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Belopp</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Skapad</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Giltig t.o.m.</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Åtgärder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-500">Inga offerter hittades</p>
                        <Link href="/quotes/new" className="text-sm text-indigo-600 hover:underline">
                          Skapa din första offert →
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((q) => (
                    <tr key={q.id} className="table-row-hover group relative">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-semibold text-indigo-600">{q.quoteNumber}</span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${avatarColor(q.clientName)} text-white text-sm font-semibold flex items-center justify-center shrink-0`}>
                            {q.clientName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{q.clientName}</p>
                            <p className="text-xs text-gray-500">{q.clientCompany || q.clientEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm font-bold text-gray-900">{SEK(q.total)}</span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setStatusMenuId(statusMenuId === q.id ? null : q.id)}
                            className="group/badge"
                            title="Klicka för att ändra status"
                          >
                            <Badge variant={q.status} dot>{statusLabel[q.status]}</Badge>
                          </button>
                          {statusMenuId === q.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setStatusMenuId(null)} />
                              <div className="absolute z-20 top-8 left-0 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
                                {(["draft","sent","opened","accepted","declined"] as QuoteStatus[]).map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => handleStatusChange(q.id, s)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${q.status === s ? "font-semibold text-indigo-600" : "text-gray-700"}`}
                                  >
                                    {statusLabel[s]}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-gray-500">{fmtDate(q.createdAt)}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-gray-500">{expiryDate(q.createdAt, q.validDays || 30)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Visa/dela */}
                          <a
                            href={`/q/${q.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Visa offert"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </a>
                          {/* Kopiera länk */}
                          <button
                            onClick={() => handleCopyLink(q.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title={copiedId === q.id ? "Kopierad!" : "Kopiera länk"}
                          >
                            {copiedId === q.id ? (
                              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                          {/* Konvertera till faktura (om accepterad) */}
                          {q.status === "accepted" && !q.invoiceId && (
                            <button
                              onClick={() => handleConvertToInvoice(q)}
                              className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Skapa faktura från offert"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          )}
                          {/* Ta bort */}
                          <button
                            onClick={() => setConfirmDeleteId(q.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Ta bort"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Visar {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} av {filtered.length} offerter
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          )}
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
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Ta bort offert?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {quotes.find((q) => q.id === confirmDeleteId)?.quoteNumber} kommer att tas bort permanent.
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
