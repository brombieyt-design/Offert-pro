"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  type Client,
  loadClients,
  addClient,
  updateClient,
  deleteClient,
} from "@/lib/clients";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "from-indigo-400 to-indigo-600",
  "from-purple-400 to-purple-600",
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-rose-400 to-rose-600",
  "from-amber-400 to-amber-600",
];

function avatarColor(id: string) {
  const n = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  return AVATAR_COLORS[n];
}

const emptyForm = (): Omit<Client, "id" | "createdAt"> => ({
  name: "",
  email: "",
  phone: "",
  company: "",
  orgNumber: "",
  address: "",
  city: "",
  notes: "",
});

// ---------------------------------------------------------------------------
// Client form (used for both add and edit)
// ---------------------------------------------------------------------------

interface ClientFormProps {
  initial?: Omit<Client, "id" | "createdAt">;
  onSave: (data: Omit<Client, "id" | "createdAt">) => void;
  onCancel: () => void;
  title: string;
}

function ClientForm({ initial, onSave, onCancel, title }: ClientFormProps) {
  const [form, setForm] = useState(initial ?? emptyForm());
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const valid = form.name.trim() !== "" && form.email.trim() !== "";

  const fields: { label: string; key: keyof typeof form; type?: string; placeholder: string; col?: number }[] = [
    { label: "Namn *", key: "name", placeholder: "Anna Lindqvist" },
    { label: "E-post *", key: "email", type: "email", placeholder: "anna@foretag.se" },
    { label: "Telefon", key: "phone", type: "tel", placeholder: "+46 70 123 45 67" },
    { label: "Företag", key: "company", placeholder: "Företaget AB" },
    { label: "Organisationsnummer", key: "orgNumber", placeholder: "556123-4567" },
    { label: "Adress", key: "address", placeholder: "Storgatan 1", col: 2 },
    { label: "Stad", key: "city", placeholder: "Stockholm" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, key, type, placeholder, col }) => (
            <div key={key} className={col === 2 ? "sm:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                type={type ?? "text"}
                value={form[key] as string}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Anteckningar</label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Interna anteckningar om kunden..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-gray-100 flex gap-3 shrink-0">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Avbryt
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={!valid}
          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Spara kund
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type PanelMode = "add" | "edit" | null;

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const reload = useCallback(() => setClients(loadClients()), []);

  useEffect(() => {
    reload();
  }, [reload]);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      q === "" ||
      c.name.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const handleAdd = (data: Omit<Client, "id" | "createdAt">) => {
    addClient(data);
    reload();
    setPanelMode(null);
  };

  const handleEdit = (data: Omit<Client, "id" | "createdAt">) => {
    if (!editingId) return;
    updateClient(editingId, data);
    reload();
    setPanelMode(null);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
    reload();
    setConfirmDeleteId(null);
  };

  const editingClient = clients.find((c) => c.id === editingId);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Rubrik */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kunder</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {clients.length} kunder sparade · välj en kund i offerter och fakturor
            </p>
          </div>
          <button
            onClick={() => setPanelMode("add")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Ny kund
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Totalt kunder", value: clients.length, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Med företag", value: clients.filter((c) => c.company).length, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Med telefon", value: clients.filter((c) => c.phone).length, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Med adress", value: clients.filter((c) => c.address).length, color: "text-amber-600", bg: "bg-amber-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Sök */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Sök namn, företag, e-post eller stad..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Kundkort – grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col"
              >
                <div className="p-5">
                  {/* Avatar + namn */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor(client.id)} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {initials(client.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{client.name}</p>
                      {client.company && (
                        <p className="text-xs text-gray-500 truncate">{client.company}</p>
                      )}
                    </div>
                  </div>

                  {/* Kontaktinfo */}
                  <div className="space-y-1.5 mb-4">
                    {client.email && (
                      <a href={`mailto:${client.email}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 transition-colors">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{client.email}</span>
                      </a>
                    )}
                    {client.phone && (
                      <a href={`tel:${client.phone}`} className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 transition-colors">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{client.phone}</span>
                      </a>
                    )}
                    {(client.city || client.address) && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{[client.address, client.city].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                    {client.orgNumber && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Org: {client.orgNumber}</span>
                      </div>
                    )}
                  </div>

                  {client.notes && (
                    <div className="bg-gray-50 rounded-lg p-2.5 mb-4">
                      <p className="text-xs text-gray-500 line-clamp-2">{client.notes}</p>
                    </div>
                  )}
                </div>

                {/* Knappar */}
                <div className="px-5 pb-5 pt-0 flex gap-2 mt-auto">
                  <Link
                    href="/quotes/new"
                    className="flex-1 py-2 text-center text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                  >
                    + Offert
                  </Link>
                  <Link
                    href="/invoices/new"
                    className="flex-1 py-2 text-center text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    + Faktura
                  </Link>
                  <button
                    onClick={() => { setEditingId(client.id); setPanelMode("edit"); }}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    title="Redigera"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(client.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Ta bort"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              {search ? "Inga kunder hittades" : "Inga kunder ännu"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? "Prova en annan sökning" : "Klicka på \"Ny kund\" för att lägga till din första kund"}
            </p>
            {!search && (
              <button
                onClick={() => setPanelMode("add")}
                className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Lägg till kund
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sidopanel overlay */}
      {panelMode && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => { setPanelMode(null); setEditingId(null); }}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
            {panelMode === "add" && (
              <ClientForm
                title="Ny kund"
                onSave={handleAdd}
                onCancel={() => setPanelMode(null)}
              />
            )}
            {panelMode === "edit" && editingClient && (
              <ClientForm
                title="Redigera kund"
                initial={editingClient}
                onSave={handleEdit}
                onCancel={() => { setPanelMode(null); setEditingId(null); }}
              />
            )}
          </div>
        </>
      )}

      {/* Bekräfta radering */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Ta bort kund?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {clients.find((c) => c.id === confirmDeleteId)?.name} kommer att tas bort permanent.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Ta bort
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
