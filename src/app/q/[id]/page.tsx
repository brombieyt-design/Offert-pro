"use client";

import React, { useEffect, useState } from "react";
import { type Quote, getQuote, updateQuote } from "@/lib/quotes";
import { loadSettings } from "@/lib/settings";

const SEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 2 }).format(n);

const fmtDate = (iso?: string) => {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });
};

export default function PublicQuotePage({ params }: { params: { id: string } }) {
  const [quote, setQuote] = useState<Quote | null | undefined>(undefined);
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [logo, setLogo] = useState("");
  const [action, setAction] = useState<"none" | "accepted" | "declined">("none");
  const [confirming, setConfirming] = useState<"accept" | "decline" | null>(null);

  useEffect(() => {
    const q = getQuote(params.id);
    setQuote(q ?? null);
    const s = loadSettings();
    setCompanyName(s.companyName || "Ditt Företag");
    setCompanyEmail(s.email);
    setCompanyPhone(s.phone);
    setLogo(s.logo);
  }, [params.id]);

  const handleAccept = () => {
    if (!quote) return;
    updateQuote(quote.id, { status: "accepted", acceptedAt: new Date().toISOString() });
    setAction("accepted");
    setConfirming(null);
  };

  const handleDecline = () => {
    if (!quote) return;
    updateQuote(quote.id, { status: "declined", declinedAt: new Date().toISOString() });
    setAction("declined");
    setConfirming(null);
  };

  // Loading
  if (quote === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not found
  if (quote === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Offerten hittades inte</h1>
          <p className="text-gray-500">Den här länken är inte längre giltig.</p>
        </div>
      </div>
    );
  }

  const isAlreadyActioned = quote.status === "accepted" || quote.status === "declined";
  const effectiveAction = action !== "none" ? action : (isAlreadyActioned ? quote.status as "accepted" | "declined" : "none");

  const expiryDate = new Date(quote.createdAt);
  expiryDate.setDate(expiryDate.getDate() + (quote.validDays || 30));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 print:shadow-none print:rounded-none">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                {logo ? (
                  <img src={logo} alt={companyName} className="h-10 object-contain brightness-0 invert mb-2" />
                ) : (
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-lg">{companyName.charAt(0)}</span>
                  </div>
                )}
                <h1 className="text-xl font-bold">{companyName}</h1>
                <div className="flex items-center gap-3 mt-1 text-indigo-200 text-sm">
                  {companyEmail && <span>{companyEmail}</span>}
                  {companyPhone && <span>{companyPhone}</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-indigo-200 text-sm">Offert</p>
                <p className="text-2xl font-bold">{quote.quoteNumber}</p>
              </div>
            </div>
          </div>

          {/* Till */}
          <div className="px-6 py-5 grid grid-cols-2 gap-6 border-b border-gray-100">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Till</p>
              <p className="font-semibold text-gray-900">{quote.clientName}</p>
              {quote.clientCompany && <p className="text-sm text-gray-600">{quote.clientCompany}</p>}
              {quote.clientEmail && <p className="text-sm text-gray-500">{quote.clientEmail}</p>}
              {quote.clientAddress && <p className="text-sm text-gray-500">{quote.clientAddress}{quote.clientCity ? `, ${quote.clientCity}` : ""}</p>}
            </div>
            <div className="text-right">
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Offertdatum</p>
                <p className="text-sm text-gray-700">{fmtDate(quote.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Giltig t.o.m.</p>
                <p className="text-sm text-gray-700">{fmtDate(expiryDate.toISOString())}</p>
              </div>
            </div>
          </div>

          {/* Radartiklar */}
          <div className="px-6 py-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2">Beskrivning</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 w-16">Antal</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 w-28">À-pris</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 w-28">Summa</th>
                </tr>
              </thead>
              <tbody>
                {quote.lineItems.map((li, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-sm text-gray-900">{li.description}</td>
                    <td className="py-3 text-sm text-gray-600 text-center">{li.qty}</td>
                    <td className="py-3 text-sm text-gray-600 text-right">{SEK(li.unitPrice)}</td>
                    <td className="py-3 text-sm font-medium text-gray-900 text-right">{SEK(li.qty * li.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaler */}
            <div className="mt-4 pt-4 border-t border-gray-100 ml-auto max-w-xs">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Netto</span>
                <span>{SEK(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Moms ({quote.taxRate}%)</span>
                <span>{SEK(quote.tax)}</span>
              </div>
              {quote.rotDeduction > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 mb-2">
                  <span>{quote.rotType?.toUpperCase()}-avdrag</span>
                  <span>-{SEK(quote.rotDeduction)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Totalt att betala</span>
                <span>{SEK(quote.customerPays)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Åtgärder / status */}
        {effectiveAction === "none" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 print:hidden">
            <h2 className="text-base font-semibold text-gray-900 mb-1">Vad vill du göra?</h2>
            <p className="text-sm text-gray-500 mb-5">
              Offerten är giltig t.o.m. {fmtDate(expiryDate.toISOString())}. Du kan acceptera eller avböja nedan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming("accept")}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Acceptera offert
              </button>
              <button
                onClick={() => setConfirming("decline")}
                className="flex-1 py-3 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition-colors"
              >
                Avböj
              </button>
            </div>
          </div>
        )}

        {effectiveAction === "accepted" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center print:hidden">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-emerald-800 mb-1">Offert accepterad!</h3>
            <p className="text-sm text-emerald-700">Tack! Vi återkommer till dig med nästa steg.</p>
          </div>
        )}

        {effectiveAction === "declined" && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center print:hidden">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-700 mb-1">Offerten avböjdes</h3>
            <p className="text-sm text-gray-500">Tack för ditt svar. Tveka inte att kontakta oss om du har frågor.</p>
          </div>
        )}

        {/* Skriv ut / PDF */}
        <div className="mt-3 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skriv ut / Spara som PDF
          </button>
        </div>
      </div>

      {/* Bekräftelsedialog */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            {confirming === "accept" ? (
              <>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 text-center mb-1">Acceptera offert?</h3>
                <p className="text-sm text-gray-500 text-center mb-6">Du bekräftar att du accepterar {quote.quoteNumber} på {SEK(quote.customerPays)}.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirming(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Avbryt</button>
                  <button onClick={handleAccept} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">Ja, acceptera</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-gray-900 text-center mb-1">Avböj offert?</h3>
                <p className="text-sm text-gray-500 text-center mb-6">Är du säker på att du vill avböja {quote.quoteNumber}?</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirming(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Avbryt</button>
                  <button onClick={handleDecline} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors">Avböj offert</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
