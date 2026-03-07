"use client";

import React, { useEffect, useState } from "react";
import { type Invoice, getInvoice } from "@/lib/invoices";
import { loadSettings } from "@/lib/settings";

const SEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 2 }).format(n);

const fmtDate = (iso?: string) => {
  if (!iso) return "–";
  return new Date(iso).toLocaleDateString("sv-SE", { day: "numeric", month: "long", year: "numeric" });
};

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  orgNumber: string;
  bankgiro: string;
  plusgiro: string;
  swish: string;
  invoiceFooter: string;
}

export default function PublicInvoicePage({ params }: { params: { id: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
  const [company, setCompany] = useState<CompanyInfo>({
    name: "", email: "", phone: "", address: "", city: "", orgNumber: "",
    bankgiro: "", plusgiro: "", swish: "", invoiceFooter: "",
  });

  useEffect(() => {
    // Try URL-encoded data first (cross-browser sharing without backend)
    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get("d");
    if (encoded) {
      try {
        const json = decodeURIComponent(escape(atob(encoded)));
        const data = JSON.parse(json);
        if (data.invoice) {
          setInvoice(data.invoice);
          setCompany({ ...company, ...data.company });
          return;
        }
      } catch {
        // fallthrough
      }
    }
    // Fallback: localStorage
    const inv = getInvoice(params.id);
    setInvoice(inv ?? null);
    const s = loadSettings();
    setCompany({
      name: s.companyName || "Ditt Företag",
      email: s.email,
      phone: s.phone,
      address: s.address,
      city: s.city,
      orgNumber: s.orgNumber,
      bankgiro: s.bankgiro,
      plusgiro: s.plusgiro,
      swish: s.swish,
      invoiceFooter: s.invoiceFooter,
    });
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (invoice === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (invoice === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Fakturan hittades inte</h1>
          <p className="text-gray-500">Den här länken är inte längre giltig.</p>
        </div>
      </div>
    );
  }

  const isPaid = invoice.status === "paid";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 py-8 px-4 print:bg-white print:py-0">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4 print:shadow-none print:rounded-none">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">{company.name.charAt(0)}</span>
                </div>
                <h1 className="text-xl font-bold">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-400 text-sm">
                  {company.email && <span>{company.email}</span>}
                  {company.phone && <span>{company.phone}</span>}
                  {company.orgNumber && <span>Org.nr: {company.orgNumber}</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">FAKTURA</p>
                <p className="text-2xl font-bold">{invoice.invoiceNumber}</p>
                {isPaid && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-semibold rounded-full">BETALD</span>
                )}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="px-6 py-5 grid grid-cols-2 sm:grid-cols-3 gap-5 border-b border-gray-100">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Faktureras till</p>
              <p className="font-semibold text-gray-900">{invoice.clientName}</p>
              {invoice.clientCompany && <p className="text-sm text-gray-600">{invoice.clientCompany}</p>}
              {invoice.clientOrgNumber && <p className="text-sm text-gray-500">Org.nr: {invoice.clientOrgNumber}</p>}
              {invoice.clientAddress && <p className="text-sm text-gray-500">{invoice.clientAddress}{invoice.clientCity ? `, ${invoice.clientCity}` : ""}</p>}
            </div>
            <div>
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Fakturadatum</p>
                <p className="text-sm text-gray-700">{fmtDate(invoice.issuedAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Förfallodatum</p>
                <p className={`text-sm font-medium ${isPaid ? "text-emerald-600" : "text-gray-700"}`}>{fmtDate(invoice.dueAt)}</p>
              </div>
            </div>
            {invoice.clientReference && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Er referens</p>
                <p className="text-sm text-gray-700">{invoice.clientReference}</p>
              </div>
            )}
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
                {invoice.lineItems.map((li, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 text-sm text-gray-900">{li.description}</td>
                    <td className="py-3 text-sm text-gray-600 text-center">{li.qty}</td>
                    <td className="py-3 text-sm text-gray-600 text-right">{SEK(li.unitPrice)}</td>
                    <td className="py-3 text-sm font-medium text-gray-900 text-right">{SEK(li.qty * li.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-gray-100 ml-auto max-w-xs">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Netto</span>
                <span>{SEK(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Moms ({invoice.taxRate}%)</span>
                <span>{SEK(invoice.tax)}</span>
              </div>
              {invoice.rotDeduction > 0 && (
                <div className="flex justify-between text-sm text-emerald-600 mb-2">
                  <span>{invoice.rotType?.toUpperCase()}-avdrag</span>
                  <span>-{SEK(invoice.rotDeduction)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Att betala</span>
                <span>{SEK(invoice.customerPays)}</span>
              </div>
            </div>
          </div>

          {/* Betalningsinformation */}
          {(company.bankgiro || company.plusgiro || company.swish) && (
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Betalningsinformation</p>
              <div className="flex flex-wrap gap-6">
                {company.bankgiro && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Bankgiro</p>
                    <p className="text-sm font-semibold text-gray-900">{company.bankgiro}</p>
                  </div>
                )}
                {company.plusgiro && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Plusgiro</p>
                    <p className="text-sm font-semibold text-gray-900">{company.plusgiro}</p>
                  </div>
                )}
                {company.swish && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Swish</p>
                    <p className="text-sm font-semibold text-gray-900">{company.swish}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Märk betalningen</p>
                  <p className="text-sm font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          {company.invoiceFooter && (
            <div className="px-6 py-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">{company.invoiceFooter}</p>
            </div>
          )}
        </div>

        {/* Skriv ut */}
        <div className="mt-3 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skriv ut / Spara som PDF
          </button>
        </div>
      </div>
    </div>
  );
}
