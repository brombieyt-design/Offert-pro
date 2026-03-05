"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";

interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

interface ClientInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  notes: string;
}

const defaultClientInfo: ClientInfo = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  city: "",
  notes: "",
};

const defaultLineItems: LineItem[] = [
  { id: "1", description: "", qty: 1, unitPrice: 0 },
];

const steps = [
  { number: 1, label: "Kundinformation" },
  { number: 2, label: "Radartiklar" },
  { number: 3, label: "Förhandsvisning" },
  { number: 4, label: "Skicka" },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatSEK(amount: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function NewQuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientInfo, setClientInfo] = useState<ClientInfo>(defaultClientInfo);
  const [lineItems, setLineItems] = useState<LineItem[]>(defaultLineItems);
  const [taxRate, setTaxRate] = useState(25);
  const [quoteNumber] = useState(
    "QT-" + String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")
  );
  const [sendMethod, setSendMethod] = useState<"email" | "sms" | "link">(
    "email"
  );
  const [options, setOptions] = useState({
    enableSignature: true,
    autoReminder: true,
    notifyOnOpen: true,
  });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addLineItem = () => {
    setLineItems((items) => [
      ...items,
      { id: generateId(), description: "", qty: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return;
    setLineItems((items) => items.filter((item) => item.id !== id));
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        clientInfo.name.trim() &&
        clientInfo.email.trim() &&
        clientInfo.company.trim()
      );
    }
    if (currentStep === 2) {
      return lineItems.some(
        (item) => item.description.trim() && item.unitPrice > 0
      );
    }
    return true;
  };

  const handleSend = async () => {
    setSendError(null);
    setIsSending(true);

    try {
      const res = await fetch("/api/quotes/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: {
            number: quoteNumber,
            lineItems,
            subtotal,
            tax,
            taxRate,
            total,
          },
          recipient: {
            name: clientInfo.name,
            email: clientInfo.email,
            phone: clientInfo.phone,
            company: clientInfo.company,
            address: clientInfo.address,
            city: clientInfo.city,
          },
          sender: {
            name: "Jane Doe",
            email: "jane@example.com",
          },
          sendMethod,
          options,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSendError(data.error || "Något gick fel. Försök igen.");
        return;
      }

      if (sendMethod === "link" && data.link) {
        setShareLink(data.link);
      }

      setSent(true);
    } catch {
      setSendError("Nätverksfel – kontrollera din anslutning och försök igen.");
    } finally {
      setIsSending(false);
    }
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Sidhuvud */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ny offert</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Offert #{quoteNumber}
            </p>
          </div>
        </div>

        {/* Stegindikator */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() =>
                      step.number < currentStep &&
                      setCurrentStep(step.number)
                    }
                    disabled={step.number > currentStep}
                    className="focus:outline-none"
                  >
                    <div
                      className={`step-dot ${
                        step.number < currentStep
                          ? "bg-indigo-600 text-white"
                          : step.number === currentStep
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.number < currentStep ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                  </button>
                  <span
                    className={`text-xs font-medium hidden sm:block ${
                      step.number <= currentStep
                        ? "text-indigo-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`step-line flex-1 mx-2 ${
                      step.number < currentStep ? "completed" : ""
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Steg 1: Kundinformation ── */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Kundinformation
            </h2>
            <p className="text-sm text-gray-500 mb-6">Vem är offerten till?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Kundnamn <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="t.ex. Anna Svensson"
                  value={clientInfo.name}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, name: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  E-postadress <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="t.ex. anna@foretag.se"
                  value={clientInfo.email}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, email: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Telefonnummer
                  <span className="ml-1 text-xs text-gray-400 font-normal">
                    (för SMS-notis)
                  </span>
                </label>
                <input
                  type="tel"
                  placeholder="t.ex. +46 70 123 45 67"
                  value={clientInfo.phone}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, phone: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Företag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="t.ex. Acme AB"
                  value={clientInfo.company}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, company: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Stad / Region
                </label>
                <input
                  type="text"
                  placeholder="t.ex. Stockholm"
                  value={clientInfo.city}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, city: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Faktureringsadress
                </label>
                <input
                  type="text"
                  placeholder="t.ex. Kungsgatan 10, 111 43 Stockholm"
                  value={clientInfo.address}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, address: e.target.value })
                  }
                  className="form-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Anteckningar (valfritt)
                </label>
                <textarea
                  placeholder="Eventuella ytterligare anteckningar till kunden..."
                  value={clientInfo.notes}
                  onChange={(e) =>
                    setClientInfo({ ...clientInfo, notes: e.target.value })
                  }
                  rows={3}
                  className="form-input resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Steg 2: Radartiklar ── */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Radartiklar
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Lägg till produkter eller tjänster i offerten.
            </p>

            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 mb-4">
              <div className="min-w-[480px] border border-gray-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-0 bg-gray-50 border-b border-gray-200">
                  <div className="col-span-6 px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Beskrivning
                  </div>
                  <div className="col-span-2 px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    Ant.
                  </div>
                  <div className="col-span-2 px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Styckpris
                  </div>
                  <div className="col-span-1 px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Totalt
                  </div>
                  <div className="col-span-1 px-2 py-2.5" />
                </div>

                {lineItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-0 ${
                      index < lineItems.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="col-span-6 px-4 py-2.5">
                      <input
                        type="text"
                        placeholder="Beskriv tjänsten eller produkten..."
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="col-span-2 px-3 py-2.5 flex items-center justify-center">
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "qty",
                            parseFloat(e.target.value) || 1
                          )
                        }
                        className="w-full text-sm text-gray-900 text-center focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="col-span-2 px-3 py-2.5 flex items-center">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={item.unitPrice || ""}
                        placeholder="0"
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full text-sm text-gray-900 focus:outline-none bg-transparent placeholder:text-gray-400"
                      />
                      <span className="text-gray-400 text-xs ml-1 shrink-0">
                        kr
                      </span>
                    </div>
                    <div className="col-span-1 px-3 py-2.5 flex items-center justify-end">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatSEK(item.qty * item.unitPrice)}
                      </span>
                    </div>
                    <div className="col-span-1 px-2 py-2.5 flex items-center justify-center">
                      <button
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                        className="p-1 text-gray-300 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={addLineItem}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Lägg till rad
            </button>

            <div className="border-t border-gray-100 pt-4 space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delsumma</span>
                <span className="font-medium text-gray-900">
                  {formatSEK(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Moms</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) =>
                        setTaxRate(parseFloat(e.target.value) || 0)
                      }
                      className="w-10 text-xs border border-gray-200 rounded px-1 py-0.5 text-center focus:outline-none focus:border-indigo-400"
                    />
                    <span className="text-gray-400 text-xs">%</span>
                  </div>
                </div>
                <span className="font-medium text-gray-900">
                  {formatSEK(tax)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span className="text-gray-900">Totalt</span>
                <span className="text-indigo-600">{formatSEK(total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Steg 3: Förhandsvisning ── */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">
                Förhandsvisning av offert
              </h2>
              <span className="text-sm text-gray-500">
                Granska innan du skickar
              </span>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      Offert-pro
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Jane Doe</p>
                  <p className="text-sm text-gray-500">jane@example.com</p>
                  <p className="text-sm text-gray-500">Stockholm</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-extrabold text-gray-900 mb-1">
                    OFFERT
                  </div>
                  <div className="text-lg font-semibold text-indigo-600 mb-3">
                    {quoteNumber}
                  </div>
                  <div className="flex sm:justify-end gap-4 text-xs text-gray-500">
                    <div>
                      <p className="font-medium text-gray-600">
                        Utfärdandedatum
                      </p>
                      <p>4 mar 2026</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Giltig till</p>
                      <p>4 apr 2026</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Faktureras till
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {clientInfo.name || "—"}
                </p>
                <p className="text-sm text-gray-600">
                  {clientInfo.company || "—"}
                </p>
                {clientInfo.address && (
                  <p className="text-sm text-gray-600">{clientInfo.address}</p>
                )}
                {clientInfo.city && (
                  <p className="text-sm text-gray-600">{clientInfo.city}</p>
                )}
                <p className="text-sm text-gray-600">
                  {clientInfo.email || "—"}
                </p>
                {clientInfo.phone && (
                  <p className="text-sm text-gray-600">{clientInfo.phone}</p>
                )}
              </div>

              <div className="overflow-x-auto -mx-6 sm:-mx-10 px-6 sm:px-10 mb-8">
                <div className="min-w-[400px] border border-gray-100 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-12 bg-indigo-50 px-4 py-2.5">
                    <div className="col-span-6 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                      Beskrivning
                    </div>
                    <div className="col-span-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider text-center">
                      Ant.
                    </div>
                    <div className="col-span-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider text-right">
                      Styckpris
                    </div>
                    <div className="col-span-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider text-right">
                      Totalt
                    </div>
                  </div>
                  {lineItems
                    .filter((item) => item.description || item.unitPrice > 0)
                    .map((item, index, arr) => (
                      <div
                        key={item.id}
                        className={`grid grid-cols-12 px-4 py-3 ${
                          index < arr.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <div className="col-span-6 text-sm text-gray-800">
                          {item.description || (
                            <span className="text-gray-400 italic">
                              Ingen beskrivning
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 text-sm text-gray-700 text-center">
                          {item.qty}
                        </div>
                        <div className="col-span-2 text-sm text-gray-700 text-right">
                          {formatSEK(item.unitPrice)}
                        </div>
                        <div className="col-span-2 text-sm font-semibold text-gray-900 text-right">
                          {formatSEK(item.qty * item.unitPrice)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="max-w-xs ml-auto space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delsumma</span>
                  <span className="text-gray-900">{formatSEK(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Moms ({taxRate}%)</span>
                  <span className="text-gray-900">{formatSEK(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Att betala</span>
                  <span className="text-indigo-600">{formatSEK(total)}</span>
                </div>
              </div>

              {clientInfo.notes && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Anteckningar
                  </p>
                  <p className="text-sm text-gray-700">{clientInfo.notes}</p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-6 text-center">
                <p className="text-xs text-gray-400">
                  Denna offert är giltig i 30 dagar. Skapad av Offert-pro.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Steg 4: Skicka ── */}
        {currentStep === 4 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {sent ? (
              /* ── Framgångsskärm ── */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {sendMethod === "link"
                    ? "Länk skapad!"
                    : sendMethod === "sms"
                    ? "SMS skickat!"
                    : "E-post skickad!"}
                </h3>

                {sendMethod === "link" && shareLink ? (
                  <div className="max-w-md mx-auto mb-6">
                    <p className="text-gray-500 mb-4">
                      Kopiera länken nedan och dela med kunden.
                    </p>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                      <span className="text-sm text-gray-700 truncate flex-1">
                        {shareLink}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(shareLink)
                        }
                        className="shrink-0 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        Kopiera
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-6">
                    Din offert {quoteNumber} har skickats till{" "}
                    <span className="font-medium text-gray-700">
                      {sendMethod === "sms"
                        ? clientInfo.phone || "kunden"
                        : clientInfo.email || "kunden"}
                    </span>
                    . Du får ett meddelande när de öppnar den.
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="/quotes"
                    className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Visa alla offerter
                  </a>
                  <a
                    href="/quotes/new"
                    className="px-6 py-3 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Skapa en ny
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  Skicka offert
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Välj hur du vill leverera offerten till kunden.
                </p>

                {/* Sammanfattningskort */}
                <div className="bg-slate-50 rounded-xl p-4 border border-gray-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">
                        Skickas till
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {clientInfo.name || "Kund"} ·{" "}
                        {clientInfo.company || "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {clientInfo.email || "—"}
                        {clientInfo.phone && (
                          <span className="ml-2">· {clientInfo.phone}</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">
                        Offerttotal
                      </p>
                      <p className="text-xl font-extrabold text-indigo-600">
                        {formatSEK(total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leveransmetod */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Leveransmetod
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "email" as const,
                        label: "Skicka via e-post",
                        desc: "Leverera direkt till inkorgen",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        ),
                      },
                      {
                        id: "sms" as const,
                        label: "Skicka via SMS",
                        desc: "Notis direkt till telefonen",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        ),
                      },
                      {
                        id: "link" as const,
                        label: "Dela en länk",
                        desc: "Kopiera och dela via valfri kanal",
                        icon: (
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                        ),
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSendMethod(method.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          sendMethod === method.id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            sendMethod === method.id
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {method.icon}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              sendMethod === method.id
                                ? "text-indigo-700"
                                : "text-gray-900"
                            }`}
                          >
                            {method.label}
                          </p>
                          <p
                            className={`text-xs ${
                              sendMethod === method.id
                                ? "text-indigo-500"
                                : "text-gray-500"
                            }`}
                          >
                            {method.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* SMS warning if no phone */}
                  {sendMethod === "sms" && !clientInfo.phone && (
                    <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <svg
                        className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <p className="text-xs text-amber-700">
                        Inget telefonnummer angivet. Gå tillbaka till steg 1
                        och fyll i kundens telefonnummer.
                      </p>
                    </div>
                  )}
                </div>

                {/* Alternativ */}
                <div className="space-y-3 mb-6">
                  {[
                    {
                      key: "enableSignature" as const,
                      label: "Aktivera e-signatur",
                      desc: "Låt kunden signera digitalt",
                    },
                    {
                      key: "autoReminder" as const,
                      label: "Automatisk påminnelse efter 3 dagar",
                      desc: "Följ upp om inget svar",
                    },
                    {
                      key: "notifyOnOpen" as const,
                      label: "Meddela mig när den öppnas",
                      desc: "Realtidsspårning av öppning",
                    },
                  ].map((opt) => (
                    <label
                      key={opt.key}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={options[opt.key]}
                        onChange={() => toggleOption(opt.key)}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Error message */}
                {sendError && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <svg
                      className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <p className="text-sm text-red-700">{sendError}</p>
                  </div>
                )}

                {/* Send button */}
                <button
                  onClick={handleSend}
                  disabled={
                    isSending ||
                    (sendMethod === "sms" && !clientInfo.phone)
                  }
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-200"
                >
                  {isSending ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Skickar...
                    </>
                  ) : sendMethod === "email" ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Skicka offert till {clientInfo.email || "kunden"}
                    </>
                  ) : sendMethod === "sms" ? (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                      Skicka SMS till {clientInfo.phone || "kunden"}
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      Skapa delningslänk
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Navigeringsknappar */}
        {!sent && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Tillbaka
            </button>

            {currentStep < 4 && (
              <button
                onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
                disabled={!canProceed()}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {currentStep === 3 ? "Fortsätt till sändning" : "Nästa steg"}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
