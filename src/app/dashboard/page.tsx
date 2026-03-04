import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

type QuoteStatus = "draft" | "sent" | "opened" | "accepted" | "declined";

const recentQuotes = [
  {
    id: "QT-001",
    client: "Acme Corp",
    clientInitial: "A",
    amount: "$4,200",
    status: "accepted" as QuoteStatus,
    date: "Mar 1, 2026",
    email: "sarah@acmecorp.com",
  },
  {
    id: "QT-002",
    client: "Pixel Studio",
    clientInitial: "P",
    amount: "$2,800",
    status: "opened" as QuoteStatus,
    date: "Mar 2, 2026",
    email: "tom@pixelstudio.io",
  },
  {
    id: "QT-003",
    client: "Summit IT",
    clientInitial: "S",
    amount: "$8,500",
    status: "sent" as QuoteStatus,
    date: "Mar 2, 2026",
    email: "it@summittech.com",
  },
  {
    id: "QT-004",
    client: "Nova Consulting",
    clientInitial: "N",
    amount: "$1,950",
    status: "draft" as QuoteStatus,
    date: "Mar 3, 2026",
    email: "hello@novaconsult.co",
  },
  {
    id: "QT-005",
    client: "Blue Ridge Construction",
    clientInitial: "B",
    amount: "$12,400",
    status: "accepted" as QuoteStatus,
    date: "Feb 28, 2026",
    email: "ops@blueridge.build",
  },
  {
    id: "QT-006",
    client: "Evergreen Events",
    clientInitial: "E",
    amount: "$3,100",
    status: "declined" as QuoteStatus,
    date: "Feb 27, 2026",
    email: "events@evergreen.co",
  },
];

const activityFeed = [
  {
    type: "accepted",
    message: "Acme Corp accepted quote QT-001",
    time: "2 hours ago",
    icon: (
      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    iconBg: "bg-emerald-100",
  },
  {
    type: "opened",
    message: "Pixel Studio opened QT-002 (3 views)",
    time: "4 hours ago",
    icon: (
      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    iconBg: "bg-amber-100",
  },
  {
    type: "sent",
    message: "Quote QT-003 sent to Summit IT",
    time: "5 hours ago",
    icon: (
      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    iconBg: "bg-blue-100",
  },
  {
    type: "reminder",
    message: "Auto-reminder sent to Summit IT",
    time: "Yesterday",
    icon: (
      <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    iconBg: "bg-indigo-100",
  },
  {
    type: "accepted",
    message: "Blue Ridge Construction accepted QT-005",
    time: "Feb 28",
    icon: (
      <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    iconBg: "bg-emerald-100",
  },
  {
    type: "declined",
    message: "Evergreen Events declined QT-006",
    time: "Feb 27",
    icon: (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    iconBg: "bg-red-100",
  },
];

const clientAvatarColors: Record<string, string> = {
  A: "bg-blue-500",
  P: "bg-purple-500",
  S: "bg-indigo-500",
  N: "bg-teal-500",
  B: "bg-orange-500",
  E: "bg-emerald-500",
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome back, Jane! Here&apos;s what&apos;s happening with your quotes.
            </p>
          </div>
          <Link
            href="/quotes/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Quote
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Quotes"
            value="24"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            change={{ value: "+12%", positive: true }}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
          />
          <StatCard
            title="Open Quotes"
            value="8"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            change={{ value: "+3", positive: true }}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatCard
            title="Accepted"
            value="14"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            change={{ value: "58% rate", positive: true }}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />
          <StatCard
            title="Total Value"
            value="$42,800"
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            change={{ value: "+$8,200", positive: true }}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent quotes table */}
          <div className="xl:col-span-2">
            <Card padding="none">
              <CardHeader className="px-6 pt-5 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Quotes</CardTitle>
                  <Link
                    href="/quotes"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
                  >
                    View all
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </CardHeader>

              <div className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Client</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Amount</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Status</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Date</th>
                        <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentQuotes.map((quote) => (
                        <tr key={quote.id} className="table-row-hover group">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${clientAvatarColors[quote.clientInitial] || "bg-gray-400"} text-white text-sm font-semibold flex items-center justify-center shrink-0`}>
                                {quote.clientInitial}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{quote.client}</p>
                                <p className="text-xs text-gray-500">{quote.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3.5">
                            <span className="text-sm font-semibold text-gray-900">{quote.amount}</span>
                          </td>
                          <td className="px-3 py-3.5">
                            <Badge variant={quote.status} dot>
                              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-3 py-3.5">
                            <span className="text-sm text-gray-500">{quote.date}</span>
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity feed */}
          <div className="xl:col-span-1">
            <Card padding="none" className="h-full">
              <CardHeader className="px-6 pt-5 pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Activity Feed</CardTitle>
                  <span className="text-xs text-gray-400">Last 7 days</span>
                </div>
              </CardHeader>

              <div className="px-6 py-4 space-y-4 mt-2">
                {activityFeed.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full ${activity.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 leading-snug">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Quote Value</p>
              <p className="text-lg font-bold text-gray-900">$3,057</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg. Time to Close</p>
              <p className="text-lg font-bold text-gray-900">4.2 days</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-lg font-bold text-gray-900">58.3%</p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
