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
  company: string;
  address: string;
  city: string;
  notes: string;
}

const defaultClientInfo: ClientInfo = {
  name: "",
  email: "",
  company: "",
  address: "",
  city: "",
  notes: "",
};

const defaultLineItems: LineItem[] = [
  { id: "1", description: "", qty: 1, unitPrice: 0 },
];

const steps = [
  { number: 1, label: "Client Info" },
  { number: 2, label: "Line Items" },
  { number: 3, label: "Preview" },
  { number: 4, label: "Send" },
];

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default function NewQuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientInfo, setClientInfo] = useState<ClientInfo>(defaultClientInfo);
  const [lineItems, setLineItems] = useState<LineItem[]>(defaultLineItems);
  const [taxRate, setTaxRate] = useState(10);
  const [quoteNumber] = useState("QT-" + String(Math.floor(Math.random() * 900) + 100).padStart(3, "0"));
  const [sendMethod, setSendMethod] = useState<"email" | "link">("email");
  const [sent, setSent] = useState(false);

  const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
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
      return clientInfo.name.trim() && clientInfo.email.trim() && clientInfo.company.trim();
    }
    if (currentStep === 2) {
      return lineItems.some((item) => item.description.trim() && item.unitPrice > 0);
    }
    return true;
  };

  const handleSend = () => {
    setSent(true);
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Quote</h1>
            <p className="text-sm text-gray-500 mt-0.5">Quote #{quoteNumber}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => step.number < currentStep && setCurrentStep(step.number)}
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
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                  </button>
                  <span className={`text-xs font-medium hidden sm:block ${
                    step.number <= currentStep ? "text-indigo-600" : "text-gray-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`step-line flex-1 mx-2 ${step.number < currentStep ? "completed" : ""}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step content */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Client Information</h2>
            <p className="text-sm text-gray-500 mb-6">Who is this quote for?</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Chen"
                  value={clientInfo.name}
                  onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. sarah@company.com"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={clientInfo.company}
                  onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City / Region</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={clientInfo.city}
                  onChange={(e) => setClientInfo({ ...clientInfo, city: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Billing Address</label>
                <input
                  type="text"
                  placeholder="e.g. 123 Main St, Suite 100"
                  value={clientInfo.address}
                  onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
                <textarea
                  placeholder="Any additional notes for the client..."
                  value={clientInfo.notes}
                  onChange={(e) => setClientInfo({ ...clientInfo, notes: e.target.value })}
                  rows={3}
                  className="form-input resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Line Items</h2>
            <p className="text-sm text-gray-500 mb-6">Add products or services to this quote.</p>

            {/* Line items table */}
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 mb-4">
            <div className="min-w-[480px] border border-gray-200 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-0 bg-gray-50 border-b border-gray-200">
                <div className="col-span-6 px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</div>
                <div className="col-span-2 px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Qty</div>
                <div className="col-span-2 px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</div>
                <div className="col-span-1 px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total</div>
                <div className="col-span-1 px-2 py-2.5" />
              </div>

              {lineItems.map((item, index) => (
                <div key={item.id} className={`grid grid-cols-12 gap-0 ${index < lineItems.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="col-span-6 px-4 py-2.5">
                    <input
                      type="text"
                      placeholder="Describe the service or product..."
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                      className="w-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none bg-transparent"
                    />
                  </div>
                  <div className="col-span-2 px-3 py-2.5 flex items-center justify-center">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateLineItem(item.id, "qty", parseFloat(e.target.value) || 1)}
                      className="w-full text-sm text-gray-900 text-center focus:outline-none bg-transparent"
                    />
                  </div>
                  <div className="col-span-2 px-3 py-2.5 flex items-center">
                    <span className="text-gray-400 text-sm mr-1">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice || ""}
                      placeholder="0.00"
                      onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="w-full text-sm text-gray-900 focus:outline-none bg-transparent placeholder:text-gray-400"
                    />
                  </div>
                  <div className="col-span-1 px-3 py-2.5 flex items-center justify-end">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.qty * item.unitPrice)}
                    </span>
                  </div>
                  <div className="col-span-1 px-2 py-2.5 flex items-center justify-center">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="p-1 text-gray-300 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add line item
            </button>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Tax</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={taxRate}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-10 text-xs border border-gray-200 rounded px-1 py-0.5 text-center focus:outline-none focus:border-indigo-400"
                    />
                    <span className="text-gray-400 text-xs">%</span>
                  </div>
                </div>
                <span className="font-medium text-gray-900">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-indigo-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900">Quote Preview</h2>
              <span className="text-sm text-gray-500">Review before sending</span>
            </div>

            {/* Quote document */}
            <div className="p-6 sm:p-10">
              {/* Quote header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Offert-pro</span>
                  </div>
                  <p className="text-sm text-gray-500">Jane Doe</p>
                  <p className="text-sm text-gray-500">jane@example.com</p>
                  <p className="text-sm text-gray-500">San Francisco, CA</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-2xl font-extrabold text-gray-900 mb-1">QUOTE</div>
                  <div className="text-lg font-semibold text-indigo-600 mb-3">{quoteNumber}</div>
                  <div className="text-sm text-gray-500">
                    <div className="flex sm:justify-end gap-4 text-xs">
                      <div>
                        <p className="font-medium text-gray-600">Issue Date</p>
                        <p>Mar 4, 2026</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Valid Until</p>
                        <p>Apr 4, 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bill to */}
              <div className="mb-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bill To</p>
                <p className="text-base font-semibold text-gray-900">{clientInfo.name || "—"}</p>
                <p className="text-sm text-gray-600">{clientInfo.company || "—"}</p>
                {clientInfo.address && <p className="text-sm text-gray-600">{clientInfo.address}</p>}
                {clientInfo.city && <p className="text-sm text-gray-600">{clientInfo.city}</p>}
                <p className="text-sm text-gray-600">{clientInfo.email || "—"}</p>
              </div>

              {/* Line items */}
              <div className="overflow-x-auto -mx-6 sm:-mx-10 px-6 sm:px-10 mb-8">
              <div className="min-w-[400px] border border-gray-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 bg-indigo-50 px-4 py-2.5">
                  <div className="col-span-6 text-xs font-semibold text-indigo-700 uppercase tracking-wider">Description</div>
                  <div className="col-span-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider text-center">Qty</div>
                  <div className="col-span-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider text-right">Unit Price</div>
                  <div className="col-span-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider text-right">Total</div>
                </div>
                {lineItems
                  .filter((item) => item.description || item.unitPrice > 0)
                  .map((item, index, arr) => (
                    <div
                      key={item.id}
                      className={`grid grid-cols-12 px-4 py-3 ${index < arr.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <div className="col-span-6 text-sm text-gray-800">{item.description || <span className="text-gray-400 italic">No description</span>}</div>
                      <div className="col-span-2 text-sm text-gray-700 text-center">{item.qty}</div>
                      <div className="col-span-2 text-sm text-gray-700 text-right">{formatCurrency(item.unitPrice)}</div>
                      <div className="col-span-2 text-sm font-semibold text-gray-900 text-right">{formatCurrency(item.qty * item.unitPrice)}</div>
                    </div>
                  ))}
              </div>
              </div>

              {/* Totals */}
              <div className="max-w-xs ml-auto space-y-2 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax ({taxRate}%)</span>
                  <span className="text-gray-900">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total Due</span>
                  <span className="text-indigo-600">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Notes */}
              {clientInfo.notes && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{clientInfo.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-gray-100 pt-6 text-center">
                <p className="text-xs text-gray-400">
                  This quote is valid for 30 days. Generated by Offert-pro.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Quote Sent!</h3>
                <p className="text-gray-500 mb-6">
                  Your quote {quoteNumber} has been sent to{" "}
                  <span className="font-medium text-gray-700">{clientInfo.email || "the client"}</span>.
                  You&apos;ll be notified when they open it.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href="/quotes"
                    className="px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    View All Quotes
                  </a>
                  <a
                    href="/quotes/new"
                    className="px-6 py-3 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    Create Another
                  </a>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Send Quote</h2>
                <p className="text-sm text-gray-500 mb-6">Choose how to deliver this quote to your client.</p>

                {/* Summary card */}
                <div className="bg-slate-50 rounded-xl p-4 border border-gray-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Sending to</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {clientInfo.name || "Client"} · {clientInfo.company || "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{clientInfo.email || "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Quote total</p>
                      <p className="text-xl font-extrabold text-indigo-600">{formatCurrency(total)}</p>
                    </div>
                  </div>
                </div>

                {/* Send method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Delivery method</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: "email" as const,
                        label: "Send via Email",
                        desc: "Deliver directly to client inbox",
                        icon: (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        ),
                      },
                      {
                        id: "link" as const,
                        label: "Share a Link",
                        desc: "Copy and share a unique quote URL",
                        icon: (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        ),
                      },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSendMethod(method.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          sendMethod === method.id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          sendMethod === method.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"
                        }`}>
                          {method.icon}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${sendMethod === method.id ? "text-indigo-700" : "text-gray-900"}`}>
                            {method.label}
                          </p>
                          <p className={`text-xs ${sendMethod === method.id ? "text-indigo-500" : "text-gray-500"}`}>
                            {method.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {[
                    { label: "Enable e-signature", desc: "Let client sign digitally", defaultChecked: true },
                    { label: "Auto-reminder after 3 days", desc: "Follow up if no response", defaultChecked: true },
                    { label: "Notify me when opened", desc: "Real-time open tracking", defaultChecked: true },
                  ].map((opt) => (
                    <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={opt.defaultChecked}
                        className="w-4 h-4 accent-indigo-600 rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleSend}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white text-base font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {sendMethod === "email" ? `Send Quote to ${clientInfo.email || "Client"}` : "Copy Share Link"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        {!sent && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            {currentStep < 4 && (
              <button
                onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
                disabled={!canProceed()}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {currentStep === 3 ? "Continue to Send" : "Next Step"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
