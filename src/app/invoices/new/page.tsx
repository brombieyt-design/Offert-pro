"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  orgNumber: string;
  address: string;
  city: string;
  reference: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSEK(n: number) {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);
}

function generateInvoiceNumber() {
  const y = new Date().getFullYear();
  const n = Math.floor(Math.random() * 900) + 100;
  return `FAK-${y}-${n}`;
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const PAYMENT_TERMS = [
  { label: "10 dagar netto", days: 10 },
  { label: "20 dagar netto", days: 20 },
  { label: "30 dagar netto", days: 30 },
  { label: "45 dagar netto", days: 45 },
  { label: "60 dagar netto", days: 60 },
  { label: "Förfaller omedelbart", days: 0 },
];

// ---------------------------------------------------------------------------
// Step indicators
// ---------------------------------------------------------------------------

const STEPS = ["Kundinfo", "Radposter", "Förhandsgranska", "Skicka"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  done
                    ? "bg-indigo-600 text-white"
                    : active
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${active ? "text-gray-900" : done ? "text-indigo-600" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="step-line" style={{ background: i < current ? "#4F46E5" : undefined }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NewInvoicePage() {
  const [step, setStep] = useState(0);
  const [invoiceNumber] = useState(generateInvoiceNumber);
  const [issueDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentTermDays, setPaymentTermDays] = useState(30);
  const [taxRate, setTaxRate] = useState(25);
  const [sendMethod, setSendMethod] = useState<"email" | "sms" | "link">("email");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const [client, setClient] = useState<ClientInfo>({
    name: "", email: "", phone: "", company: "",
    orgNumber: "", address: "", city: "", reference: "",
  });

  const [items, setItems] = useState<LineItem[]>([
    { description: "", qty: 1, unitPrice: 0 },
  ]);

  const dueDate = addDays(paymentTermDays);
  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + tax;

  // ------- handlers -------

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addItem = () => setItems((prev) => [...prev, { description: "", qty: 1, unitPrice: 0 }]);
  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx));

  const handleSend = async () => {
    setSendError(null);
    setIsSending(true);
    try {
      const res = await fetch("/api/quotes/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: { number: invoiceNumber, lineItems: items, subtotal, tax, taxRate, total },
          recipient: {
            name: client.name, email: client.email, phone: client.phone,
            company: client.company, address: client.address, city: client.city,
          },
          sender: { name: "Jane Doe", email: "jane@example.com" },
          sendMethod,
          options: { enableSignature: false, autoReminder: true, notifyOnOpen: true },
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSendError(data.error ?? "Något gick fel."); return; }
      if (sendMethod === "link" && data.link) setShareLink(data.link);
      setSent(true);
    } catch {
      setSendError("Nätverksfel – kontrollera din anslutning och försök igen.");
    } finally {
      setIsSending(false);
    }
  };

  // ------- steps -------

  const step1Valid = client.name.trim() !== "" && client.email.trim() !== "";
  const step2Valid = items.some((i) => i.description.trim() !== "" && i.unitPrice > 0);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Rubrik */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ny faktura</h1>
          <p className="text-sm text-gray-500 mt-0.5">{invoiceNumber}</p>
        </div>

        {/* Stegindikator */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6">
          <StepBar current={step} />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Steg 1 – Kundinfo                                                   */}
        {/* ------------------------------------------------------------------ */}
        {step === 0 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Kundinformation</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Kontaktperson *", key: "name", type: "text", placeholder: "Anna Lindqvist", col: 1 },
                { label: "E-postadress *", key: "email", type: "email", placeholder: "anna@foretag.se", col: 1 },
                { label: "Telefonnummer", key: "phone", type: "tel", placeholder: "+46 70 123 45 67", col: 1 },
                { label: "Företagsnamn", key: "company", type: "text", placeholder: "Företaget AB", col: 1 },
                { label: "Organisationsnummer", key: "orgNumber", type: "text", placeholder: "556123-4567", col: 1 },
                { label: "Er referens", key: "reference", type: "text", placeholder: "t.ex. projektnummer", col: 1 },
                { label: "Adress", key: "address", type: "text", placeholder: "Storgatan 1", col: 2 },
                { label: "Stad", key: "city", type: "text", placeholder: "Stockholm", col: 1 },
              ].map(({ label, key, type, placeholder, col }) => (
                <div key={key} className={col === 2 ? "sm:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={client[key as keyof ClientInfo]}
                    onChange={(e) => setClient((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Betalningsvillkor */}
            <div className="mt-6 pt-6 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Betalningsvillkor</label>
                <select
                  value={paymentTermDays}
                  onChange={(e) => setPaymentTermDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 bg-white"
                >
                  {PAYMENT_TERMS.map((pt) => (
                    <option key={pt.days} value={pt.days}>{pt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Förfallodatum</label>
                <input
                  type="text"
                  readOnly
                  value={dueDate}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(1)}
                disabled={!step1Valid}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Fortsätt →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Steg 2 – Radposter                                                  */}
        {/* ------------------------------------------------------------------ */}
        {step === 1 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">Fakturarader</h2>

            {/* Momssats */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-indigo-50 rounded-xl">
              <span className="text-sm text-indigo-700 font-medium">Momssats:</span>
              {[0, 6, 12, 25].map((r) => (
                <button
                  key={r}
                  onClick={() => setTaxRate(r)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors ${
                    taxRate === r ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-100"
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>

            {/* Header */}
            <div className="hidden sm:grid grid-cols-12 gap-3 mb-2 px-1">
              <div className="col-span-6 text-xs font-semibold text-gray-400 uppercase tracking-wide">Beskrivning</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Antal</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">à-pris (kr)</div>
              <div className="col-span-2 text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Summa</div>
            </div>

            <div className="space-y-3 mb-4">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
                  <div className="col-span-12 sm:col-span-6">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(idx, "description", e.target.value)}
                      placeholder="Tjänst eller produkt..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateItem(idx, "qty", Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl text-center focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice || ""}
                      onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                      placeholder="0"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl text-right focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2">
                    <span className="text-sm font-semibold text-gray-900 text-right flex-1">
                      {formatSEK(item.qty * item.unitPrice)}
                    </span>
                    {items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Lägg till rad
            </button>

            {/* Summering */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex justify-end">
                <div className="w-64 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delsumma (exkl. moms)</span>
                    <span className="font-medium">{formatSEK(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Moms ({taxRate}%)</span>
                    <span className="font-medium">{formatSEK(tax)}</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Att betala</span>
                    <span className="font-bold text-indigo-600 text-lg">{formatSEK(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep(0)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                ← Tillbaka
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!step2Valid}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Fortsätt →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Steg 3 – Förhandsgranska                                            */}
        {/* ------------------------------------------------------------------ */}
        {step === 2 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Fakturaförhandsvisning */}
            <div className="p-5 sm:p-8">
              {/* Fakturahuvud */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-lg font-bold text-gray-900">Offert-pro</span>
                  </div>
                  <p className="text-sm text-gray-500">Jane Doe</p>
                  <p className="text-sm text-gray-500">jane@example.com</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-gray-900 mb-1">FAKTURA</p>
                  <p className="text-sm font-mono font-medium text-indigo-600">{invoiceNumber}</p>
                </div>
              </div>

              {/* Datum + kund */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Utfärdad</p>
                  <p className="text-gray-900">{issueDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Förfaller</p>
                  <p className="text-gray-900">{dueDate}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Faktureras till</p>
                  <p className="font-semibold text-gray-900">{client.name || "—"}</p>
                  {client.company && <p className="text-gray-500">{client.company}</p>}
                  {client.orgNumber && <p className="text-gray-400 text-xs">Org: {client.orgNumber}</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Betalningsvillkor</p>
                  <p className="text-gray-900">{PAYMENT_TERMS.find((p) => p.days === paymentTermDays)?.label}</p>
                  {client.reference && <p className="text-gray-400 text-xs mt-0.5">Ref: {client.reference}</p>}
                </div>
              </div>

              {/* Radposter */}
              <div className="overflow-x-auto -mx-5 sm:-mx-8 mb-8">
                <table className="w-full min-w-[480px] px-5 sm:px-8">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide py-3 pl-5 sm:pl-8 pr-4">Beskrivning</th>
                      <th className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wide py-3 px-4">Antal</th>
                      <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide py-3 px-4">à-pris</th>
                      <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide py-3 pl-4 pr-5 sm:pr-8">Summa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.filter((i) => i.description || i.unitPrice > 0).map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 pl-5 sm:pl-8 pr-4 text-sm text-gray-700">{item.description || "—"}</td>
                        <td className="py-3 px-4 text-sm text-gray-500 text-center">{item.qty}</td>
                        <td className="py-3 px-4 text-sm text-gray-500 text-right">{formatSEK(item.unitPrice)}</td>
                        <td className="py-3 pl-4 pr-5 sm:pr-8 text-sm font-semibold text-gray-900 text-right">{formatSEK(item.qty * item.unitPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totalsummor */}
              <div className="flex justify-end mb-6">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delsumma</span><span>{formatSEK(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Moms ({taxRate}%)</span><span>{formatSEK(tax)}</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t-2 border-gray-200">
                    <span className="font-bold text-gray-900">Att betala</span>
                    <span className="font-bold text-indigo-600 text-lg">{formatSEK(total)}</span>
                  </div>
                </div>
              </div>

              {/* Betalningsinformation */}
              <div className="bg-indigo-50 rounded-xl p-4 text-sm">
                <p className="font-semibold text-indigo-800 mb-2">Betalningsinformation</p>
                <div className="grid grid-cols-2 gap-2 text-indigo-700">
                  <div><span className="text-indigo-400 text-xs block">Bankgiro</span>123-4567</div>
                  <div><span className="text-indigo-400 text-xs block">OCR/Referens</span>{invoiceNumber}</div>
                </div>
              </div>
            </div>

            <div className="px-5 sm:px-8 pb-6 flex justify-between gap-3 border-t border-gray-50 pt-5">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                ← Redigera
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Godkänn & Skicka →
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Steg 4 – Skicka                                                     */}
        {/* ------------------------------------------------------------------ */}
        {step === 3 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
            {sent ? (
              /* Lyckad skickning */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {sendMethod === "link" ? "Länk skapad!" : "Faktura skickad!"}
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  {sendMethod === "email"
                    ? `Faktura ${invoiceNumber} har skickats till ${client.email}`
                    : sendMethod === "sms"
                    ? `Faktura ${invoiceNumber} har skickats via SMS till ${client.phone}`
                    : "Dela länken nedan med din kund"}
                </p>
                {shareLink && (
                  <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-6 max-w-sm mx-auto">
                    <span className="text-sm text-indigo-700 truncate flex-1">{shareLink}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(shareLink)}
                      className="shrink-0 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Kopiera
                    </button>
                  </div>
                )}
                <div className="flex justify-center gap-3">
                  <a href="/invoices" className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    Alla fakturor
                  </a>
                  <a href="/invoices/new" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
                    Ny faktura
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-base font-semibold text-gray-900 mb-5">Skicka faktura</h2>

                {/* Sammanfattning */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 flex flex-wrap gap-4 text-sm">
                  <div><span className="text-gray-400 block text-xs mb-0.5">Faktura</span><span className="font-mono font-medium text-indigo-600">{invoiceNumber}</span></div>
                  <div><span className="text-gray-400 block text-xs mb-0.5">Mottagare</span><span className="font-medium text-gray-900">{client.name || "—"}</span></div>
                  <div><span className="text-gray-400 block text-xs mb-0.5">Belopp</span><span className="font-bold text-gray-900">{formatSEK(total)}</span></div>
                  <div><span className="text-gray-400 block text-xs mb-0.5">Förfaller</span><span className="font-medium text-gray-900">{dueDate}</span></div>
                </div>

                {/* Leveransmetod */}
                <p className="text-sm font-semibold text-gray-700 mb-3">Leveransmetod</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {([
                    { key: "email", label: "E-post", sub: client.email || "Ange e-post i steg 1", icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )},
                    { key: "sms", label: "SMS", sub: client.phone || "Ange telefon i steg 1", icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )},
                    { key: "link", label: "Delningslänk", sub: "Kopiera och dela manuellt", icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    )},
                  ] as const).map(({ key, label, sub, icon }) => (
                    <button
                      key={key}
                      onClick={() => setSendMethod(key)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        sendMethod === key
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${sendMethod === key ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                        {icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{label}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[140px]">{sub}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Alternativ */}
                <div className="border border-gray-100 rounded-xl p-4 mb-6 space-y-3">
                  {[
                    { label: "Skicka automatisk påminnelse 3 dagar före förfall", id: "reminder" },
                    { label: "Meddela mig när fakturan öppnas", id: "notify" },
                  ].map(({ label, id }) => (
                    <label key={id} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>

                {/* Fel */}
                {sendError && (
                  <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4">
                    <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-red-700">{sendError}</p>
                  </div>
                )}

                <div className="flex justify-between gap-3">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                    ← Tillbaka
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isSending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    {isSending ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Skickar...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Skicka faktura
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
