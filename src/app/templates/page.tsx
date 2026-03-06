"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  type Template,
  type TemplateLineItem,
  loadTemplates,
  addTemplate,
  updateTemplate,
  deleteTemplate,
} from "@/lib/templates";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SEK = (n: number) =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(n);

const emptyForm = (): Omit<Template, "id" | "createdAt"> => ({
  name: "",
  description: "",
  type: "both",
  lineItems: [{ description: "", qty: 1, unitPrice: 0 }],
  message: "",
});

// ---------------------------------------------------------------------------
// Form panel
// ---------------------------------------------------------------------------

interface TemplateFormProps {
  initial?: Omit<Template, "id" | "createdAt">;
  title: string;
  onSave: (data: Omit<Template, "id" | "createdAt">) => void;
  onCancel: () => void;
}

function TemplateForm({ initial, title, onSave, onCancel }: TemplateFormProps) {
  const [form, setForm] = useState(initial ?? emptyForm());

  const setField = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const updateItem = (i: number, field: keyof TemplateLineItem, value: string | number) =>
    setForm((p) => ({
      ...p,
      lineItems: p.lineItems.map((li, idx) => (idx === i ? { ...li, [field]: value } : li)),
    }));

  const addItem = () =>
    setForm((p) => ({ ...p, lineItems: [...p.lineItems, { description: "", qty: 1, unitPrice: 0 }] }));

  const removeItem = (i: number) =>
    setForm((p) => ({ ...p, lineItems: p.lineItems.filter((_, idx) => idx !== i) }));

  const total = form.lineItems.reduce((s, li) => s + li.qty * li.unitPrice, 0);
  const valid = form.name.trim() !== "" && form.lineItems.some((li) => li.description.trim() !== "");

  const inputCls = "px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all";

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mallnamn *</label>
          <input value={form.name} onChange={setField("name")} placeholder="t.ex. Webbprojekt grundpaket" className={`${inputCls} w-full`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Beskrivning</label>
          <input value={form.description} onChange={setField("description")} placeholder="Kort beskrivning av mallen" className={`${inputCls} w-full`} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Används för</label>
          <select value={form.type} onChange={setField("type")} className={`${inputCls} w-full bg-white`}>
            <option value="both">Offerter &amp; Fakturor</option>
            <option value="quote">Bara offerter</option>
            <option value="invoice">Bara fakturor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Radartiklar *</label>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-0 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
              <div className="col-span-6">Beskrivning</div>
              <div className="col-span-2 text-center">Antal</div>
              <div className="col-span-3 text-right">À-pris</div>
              <div className="col-span-1" />
            </div>
            {form.lineItems.map((li, i) => (
              <div key={i} className="grid grid-cols-12 gap-0 border-b border-gray-100 last:border-0 items-center px-2 py-2">
                <div className="col-span-6 pr-2">
                  <input
                    value={li.description}
                    onChange={(e) => updateItem(i, "description", e.target.value)}
                    placeholder="Tjänst eller produkt"
                    className="w-full px-2 py-1.5 text-sm border border-transparent focus:border-indigo-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="col-span-2 px-1">
                  <input
                    type="number"
                    min={0}
                    value={li.qty}
                    onChange={(e) => updateItem(i, "qty", Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm text-center border border-transparent focus:border-indigo-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="col-span-3 px-1">
                  <input
                    type="number"
                    min={0}
                    value={li.unitPrice}
                    onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm text-right border border-transparent focus:border-indigo-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  {form.lineItems.length > 1 && (
                    <button onClick={() => removeItem(i)} className="p-1 text-gray-300 hover:text-red-500 transition-colors rounded">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="px-3 py-2 bg-gray-50 flex items-center justify-between">
              <button onClick={addItem} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                + Lägg till rad
              </button>
              <span className="text-xs font-semibold text-gray-700">Totalt: {SEK(total)}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Standardmeddelande</label>
          <textarea
            value={form.message}
            onChange={setField("message")}
            placeholder="Standardtext som visas i meddelandet till kunden..."
            rows={3}
            className={`${inputCls} w-full resize-none`}
          />
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
          Avbryt
        </button>
        <button onClick={() => onSave(form)} disabled={!valid} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors">
          Spara mall
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type PanelMode = "add" | "edit" | null;

const typeLabel: Record<Template["type"], string> = {
  both: "Offert & Faktura",
  quote: "Offert",
  invoice: "Faktura",
};

const typeBadge: Record<Template["type"], string> = {
  both: "bg-indigo-50 text-indigo-700",
  quote: "bg-blue-50 text-blue-700",
  invoice: "bg-emerald-50 text-emerald-700",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const reload = useCallback(() => setTemplates(loadTemplates()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleAdd = (data: Omit<Template, "id" | "createdAt">) => {
    addTemplate(data);
    reload();
    setPanelMode(null);
  };

  const handleEdit = (data: Omit<Template, "id" | "createdAt">) => {
    if (!editingId) return;
    updateTemplate(editingId, data);
    reload();
    setPanelMode(null);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteTemplate(id);
    reload();
    setConfirmDeleteId(null);
  };

  const editingTemplate = templates.find((t) => t.id === editingId);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mallar</h1>
            <p className="text-sm text-gray-500 mt-0.5">Spara återanvändbara radartiklar för offerter och fakturor</p>
          </div>
          <button
            onClick={() => setPanelMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ny mall
          </button>
        </div>

        {templates.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((t) => {
              const totalValue = t.lineItems.reduce((s, li) => s + li.qty * li.unitPrice, 0);
              return (
                <div key={t.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeBadge[t.type]}`}>
                        {typeLabel[t.type]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
                    {t.description && <p className="text-sm text-gray-500 mb-3">{t.description}</p>}
                    <div className="space-y-1 mb-3">
                      {t.lineItems.slice(0, 3).map((li, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-gray-600">
                          <span className="truncate flex-1">{li.description || "–"}</span>
                          <span className="ml-2 text-gray-400 shrink-0">{li.qty}× {SEK(li.unitPrice)}</span>
                        </div>
                      ))}
                      {t.lineItems.length > 3 && (
                        <p className="text-xs text-gray-400">+{t.lineItems.length - 3} fler rader</p>
                      )}
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400">{t.lineItems.length} rader</span>
                      <span className="text-sm font-bold text-gray-900">{SEK(totalValue)}</span>
                    </div>
                  </div>
                  <div className="px-5 pb-5 flex gap-2">
                    <button
                      onClick={() => { setEditingId(t.id); setPanelMode("edit"); }}
                      className="flex-1 py-2 text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(t.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Inga mallar ännu</p>
            <p className="text-gray-400 text-sm mt-1">Skapa en mall för att snabbt lägga till vanliga tjänster</p>
            <button onClick={() => setPanelMode("add")} className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
              Skapa mall
            </button>
          </div>
        )}
      </div>

      {panelMode && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => { setPanelMode(null); setEditingId(null); }} />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col">
            {panelMode === "add" && (
              <TemplateForm title="Ny mall" onSave={handleAdd} onCancel={() => setPanelMode(null)} />
            )}
            {panelMode === "edit" && editingTemplate && (
              <TemplateForm
                title="Redigera mall"
                initial={editingTemplate}
                onSave={handleEdit}
                onCancel={() => { setPanelMode(null); setEditingId(null); }}
              />
            )}
          </div>
        </>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Ta bort mallen?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              &quot;{templates.find((t) => t.id === confirmDeleteId)?.name}&quot; tas bort permanent.
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
