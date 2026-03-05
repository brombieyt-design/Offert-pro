"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/Badge";

type QuoteStatus = "draft" | "sent" | "opened" | "accepted" | "declined";

interface Quote {
  id: string;
  client: string;
  clientInitial: string;
  company: string;
  amount: string;
  amountRaw: number;
  status: QuoteStatus;
  date: string;
  expiry: string;
  email: string;
}

const allQuotes: Quote[] = [
  { id: "QT-001", client: "Sarah Chen", clientInitial: "S", company: "Acme Corp", amount: "$4,200", amountRaw: 4200, status: "accepted", date: "Mar 1, 2026", expiry: "Mar 31, 2026", email: "sarah@acmecorp.com" },
  { id: "QT-002", client: "Tom Watts", clientInitial: "T", company: "Pixel Studio", amount: "$2,800", amountRaw: 2800, status: "opened", date: "Mar 2, 2026", expiry: "Apr 1, 2026", email: "tom@pixelstudio.io" },
  { id: "QT-003", client: "Anna Lee", clientInitial: "A", company: "Summit IT", amount: "$8,500", amountRaw: 8500, status: "sent", date: "Mar 2, 2026", expiry: "Apr 2, 2026", email: "anna@summittech.com" },
  { id: "QT-004", client: "Mike Rossi", clientInitial: "M", company: "Nova Consulting", amount: "$1,950", amountRaw: 1950, status: "draft", date: "Mar 3, 2026", expiry: "Apr 3, 2026", email: "mike@novaconsult.co" },
  { id: "QT-005", client: "James Hill", clientInitial: "J", company: "Blue Ridge Construction", amount: "$12,400", amountRaw: 12400, status: "accepted", date: "Feb 28, 2026", expiry: "Mar 28, 2026", email: "james@blueridge.build" },
  { id: "QT-006", client: "Laura Kim", clientInitial: "L", company: "Evergreen Events", amount: "$3,100", amountRaw: 3100, status: "declined", date: "Feb 27, 2026", expiry: "Mar 27, 2026", email: "laura@evergreen.co" },
  { id: "QT-007", client: "David Park", clientInitial: "D", company: "Horizon Media", amount: "$6,750", amountRaw: 6750, status: "sent", date: "Feb 26, 2026", expiry: "Mar 26, 2026", email: "david@horizonmedia.com" },
  { id: "QT-008", client: "Emma Torres", clientInitial: "E", company: "Bright Digital", amount: "$2,200", amountRaw: 2200, status: "accepted", date: "Feb 25, 2026", expiry: "Mar 25, 2026", email: "emma@brightdigital.io" },
  { id: "QT-009", client: "Ryan Foster", clientInitial: "R", company: "PineCone Agency", amount: "$4,900", amountRaw: 4900, status: "opened", date: "Feb 24, 2026", expiry: "Mar 24, 2026", email: "ryan@pinecone.agency" },
  { id: "QT-010", client: "Jessica Lane", clientInitial: "J", company: "Alpine Builders", amount: "$15,000", amountRaw: 15000, status: "draft", date: "Feb 23, 2026", expiry: "Mar 23, 2026", email: "jess@alpinebuilders.com" },
  { id: "QT-011", client: "Carlos Vega", clientInitial: "C", company: "Vega Solutions", amount: "$3,600", amountRaw: 3600, status: "accepted", date: "Feb 22, 2026", expiry: "Mar 22, 2026", email: "carlos@vegasolutions.mx" },
  { id: "QT-012", client: "Nina Patel", clientInitial: "N", company: "Spark Creative", amount: "$1,200", amountRaw: 1200, status: "declined", date: "Feb 20, 2026", expiry: "Mar 20, 2026", email: "nina@sparkcreative.in" },
];

const clientColors: Record<string, string> = {
  S: "bg-blue-500", T: "bg-purple-500", A: "bg-indigo-500", M: "bg-teal-500",
  J: "bg-orange-500", L: "bg-emerald-500", D: "bg-rose-500", E: "bg-cyan-500",
  R: "bg-amber-500", C: "bg-lime-600", N: "bg-pink-500", B: "bg-violet-500",
};

const tabs = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Sent", value: "sent" },
  { label: "Opened", value: "opened" },
  { label: "Accepted", value: "accepted" },
  { label: "Declined", value: "declined" },
];

const ITEMS_PER_PAGE = 8;

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = allQuotes.filter((q) => {
    const matchesTab = activeTab === "all" || q.status === activeTab;
    const matchesSearch =
      search === "" ||
      q.client.toLowerCase().includes(search.toLowerCase()) ||
      q.company.toLowerCase().includes(search.toLowerCase()) ||
      q.id.toLowerCase().includes(search.toLowerCase());
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

  const tabCounts = tabs.map((tab) => ({
    ...tab,
    count: tab.value === "all" ? allQuotes.length : allQuotes.filter((q) => q.status === tab.value).length,
  }));

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
            <p className="text-sm text-gray-500 mt-0.5">{allQuotes.length} quotes total</p>
          </div>
          <Link
            href="/quotes/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Quote
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
          {/* Tabs */}
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

          {/* Search + sort */}
          <div className="px-4 py-3 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-0" style={{ minWidth: "180px" }}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Sök klient, företag eller ID..."
                value={search}
                onChange={handleSearch}
                className="form-input pl-9"
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">Filter</span>
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Quote</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Client</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Amount</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Sent</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3.5">Expiry</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3.5">Actions</th>
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
                        <p className="text-sm font-medium text-gray-500">No quotes found</p>
                        <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((quote) => (
                    <tr key={quote.id} className="table-row-hover group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-semibold text-indigo-600">{quote.id}</span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${clientColors[quote.clientInitial] || "bg-gray-400"} text-white text-sm font-semibold flex items-center justify-center shrink-0`}>
                            {quote.clientInitial}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{quote.client}</p>
                            <p className="text-xs text-gray-500">{quote.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm font-bold text-gray-900">{quote.amount}</span>
                      </td>
                      <td className="px-3 py-4">
                        <Badge variant={quote.status} dot>
                          {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-gray-500">{quote.date}</span>
                      </td>
                      <td className="px-3 py-4">
                        <span className="text-sm text-gray-500">{quote.expiry}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Preview">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Edit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Send">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100" title="Delete">
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
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} quotes
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
