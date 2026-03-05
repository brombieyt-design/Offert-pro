"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  items: { description: string; qty: number; unitPrice: number }[];
  tags: string[];
  uses: number;
}

const templates: Template[] = [
  {
    id: "t1",
    name: "Konsulttjänster – timbaserad",
    category: "Konsult",
    description: "Perfekt för konsulter som fakturerar per timme. Inkluderar rådgivning, möten och rapportskrivning.",
    items: [
      { description: "Konsultation & rådgivning", qty: 10, unitPrice: 1200 },
      { description: "Möten & workshops", qty: 4, unitPrice: 950 },
      { description: "Rapportskrivning", qty: 5, unitPrice: 800 },
    ],
    tags: ["Timbaserad", "Flexibel"],
    uses: 312,
  },
  {
    id: "t2",
    name: "Webbdesign & utveckling",
    category: "IT & Webb",
    description: "Komplett paket för webbprojekt – design, front-end, back-end och lansering.",
    items: [
      { description: "UX/UI-design", qty: 1, unitPrice: 18000 },
      { description: "Front-end-utveckling", qty: 1, unitPrice: 24000 },
      { description: "Back-end & databas", qty: 1, unitPrice: 20000 },
      { description: "Testning & lansering", qty: 1, unitPrice: 8000 },
    ],
    tags: ["Fast pris", "Komplett"],
    uses: 248,
  },
  {
    id: "t3",
    name: "Byggentreprenad",
    category: "Bygg",
    description: "Standardoffert för bygg- och renoveringsuppdrag med material och arbetstid.",
    items: [
      { description: "Rivning & förberedelse", qty: 1, unitPrice: 12000 },
      { description: "Material (uppskattat)", qty: 1, unitPrice: 35000 },
      { description: "Arbetstid snickare (tim)", qty: 40, unitPrice: 650 },
      { description: "Städning & slutbesiktning", qty: 1, unitPrice: 4500 },
    ],
    tags: ["Material + arbete", "Bygg"],
    uses: 187,
  },
  {
    id: "t4",
    name: "Städtjänst – månadsavtal",
    category: "Städ & Service",
    description: "Återkommande städavtal för kontor eller bostad. Enkel att justera efter frekvens.",
    items: [
      { description: "Grundstädning (4 ggr/mån)", qty: 4, unitPrice: 850 },
      { description: "Fönsterputs (kvartal)", qty: 1, unitPrice: 1200 },
      { description: "Städmaterial", qty: 1, unitPrice: 400 },
    ],
    tags: ["Återkommande", "Månadsvis"],
    uses: 154,
  },
  {
    id: "t5",
    name: "Digital marknadsföring",
    category: "Marknadsföring",
    description: "Komplett marknadsföringspaket – strategi, content, annonsering och rapportering.",
    items: [
      { description: "Strategi & analys", qty: 1, unitPrice: 9500 },
      { description: "Innehållsproduktion (10 inlägg)", qty: 10, unitPrice: 1200 },
      { description: "Annonshantering (Meta/Google)", qty: 1, unitPrice: 5000 },
      { description: "Månadsrapport", qty: 1, unitPrice: 2500 },
    ],
    tags: ["Digital", "Månadspaket"],
    uses: 203,
  },
  {
    id: "t6",
    name: "IT-support & underhåll",
    category: "IT & Webb",
    description: "Löpande IT-stöd för företag – support, säkerhetskopiering och systemunderhåll.",
    items: [
      { description: "Helpdesk-support (timmar)", qty: 8, unitPrice: 950 },
      { description: "Serverunderhåll", qty: 1, unitPrice: 3500 },
      { description: "Säkerhetskopiering & backup", qty: 1, unitPrice: 1500 },
      { description: "Säkerhetsuppdateringar", qty: 1, unitPrice: 2000 },
    ],
    tags: ["Support", "Löpande"],
    uses: 176,
  },
  {
    id: "t7",
    name: "Juridisk rådgivning",
    category: "Juridik",
    description: "Timbaserad juridisk hjälp – avtalsgranskning, rådgivning och upprättande av dokument.",
    items: [
      { description: "Inledande konsultation", qty: 1, unitPrice: 2500 },
      { description: "Avtalsgranskning (tim)", qty: 3, unitPrice: 2200 },
      { description: "Dokumentupprättande", qty: 2, unitPrice: 3500 },
    ],
    tags: ["Timbaserad", "Juridik"],
    uses: 89,
  },
  {
    id: "t8",
    name: "Redovisning & bokföring",
    category: "Ekonomi",
    description: "Månadsvis redovisning för småföretag – bokföring, moms och årsredovisning.",
    items: [
      { description: "Löpande bokföring (mån)", qty: 1, unitPrice: 2800 },
      { description: "Momsredovisning (kvartal)", qty: 1, unitPrice: 1500 },
      { description: "Lönehantering (per anställd)", qty: 3, unitPrice: 600 },
      { description: "Årsredovisning", qty: 1, unitPrice: 8500 },
    ],
    tags: ["Månadsvis", "Ekonomi"],
    uses: 142,
  },
  {
    id: "t9",
    name: "Fotografi & video",
    category: "Kreativt",
    description: "Komplett paket för event, produkt- eller företagsfotografering med redigering.",
    items: [
      { description: "Fotografering (halvdag)", qty: 1, unitPrice: 6500 },
      { description: "Bildredigering (per bild)", qty: 30, unitPrice: 150 },
      { description: "Leverans & licens", qty: 1, unitPrice: 2000 },
    ],
    tags: ["Kreativt", "Event"],
    uses: 118,
  },
];

const categories = ["Alla", "Konsult", "IT & Webb", "Bygg", "Städ & Service", "Marknadsföring", "Juridik", "Ekonomi", "Kreativt"];

function formatSEK(amount: number) {
  return new Intl.NumberFormat("sv-SE", { style: "currency", currency: "SEK", maximumFractionDigits: 0 }).format(amount);
}

function categoryColor(cat: string) {
  const map: Record<string, string> = {
    Konsult: "bg-indigo-50 text-indigo-700",
    "IT & Webb": "bg-blue-50 text-blue-700",
    Bygg: "bg-orange-50 text-orange-700",
    "Städ & Service": "bg-emerald-50 text-emerald-700",
    Marknadsföring: "bg-pink-50 text-pink-700",
    Juridik: "bg-purple-50 text-purple-700",
    Ekonomi: "bg-amber-50 text-amber-700",
    Kreativt: "bg-rose-50 text-rose-700",
  };
  return map[cat] ?? "bg-gray-100 text-gray-700";
}

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("Alla");
  const [search, setSearch] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "Alla" || t.category === activeCategory;
    const matchSearch =
      search === "" ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const previewTemplate = templates.find((t) => t.id === previewId);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Rubrik */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mallar</h1>
            <p className="text-sm text-gray-500 mt-0.5">Välj en mall och anpassa den för din nästa offert</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Skapa mall
          </button>
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
            placeholder="Sök mallar..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        {/* Kategorifilter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mallgrid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => {
            const total = t.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
            return (
              <div key={t.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 flex flex-col">
                {/* Kortets huvud */}
                <div className="p-5 border-b border-gray-50">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColor(t.category)}`}>
                      {t.category}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {t.uses} användningar
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 leading-snug">{t.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{t.description}</p>
                </div>

                {/* Radposter-preview */}
                <div className="px-5 py-4 flex-1">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Ingår i mallen</p>
                  <ul className="space-y-1.5">
                    {t.items.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate max-w-[65%]">{item.description}</span>
                        <span className="text-gray-400 shrink-0">{item.qty} × {formatSEK(item.unitPrice)}</span>
                      </li>
                    ))}
                    {t.items.length > 3 && (
                      <li className="text-xs text-gray-400">+{t.items.length - 3} till...</li>
                    )}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Exkl. moms</span>
                    <span className="text-sm font-bold text-gray-900">{formatSEK(total)}</span>
                  </div>
                </div>

                {/* Taggar + knappar */}
                <div className="px-5 pb-5">
                  <div className="flex gap-1.5 flex-wrap mb-3">
                    {t.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewId(t.id)}
                      className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                    >
                      Förhandsgranska
                    </button>
                    <Link
                      href="/quotes/new"
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl text-center transition-colors"
                    >
                      Använd mall
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Inga mallar hittades</p>
            <p className="text-gray-400 text-sm mt-1">Prova en annan sökning eller kategori</p>
          </div>
        )}
      </div>

      {/* Förhandsgranskningsmodal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setPreviewId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColor(previewTemplate.category)} mb-2`}>
                    {previewTemplate.category}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900">{previewTemplate.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{previewTemplate.description}</p>
                </div>
                <button
                  onClick={() => setPreviewId(null)}
                  className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase pb-2">Beskrivning</th>
                    <th className="text-center text-xs font-semibold text-gray-400 uppercase pb-2">Ant.</th>
                    <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-2">Pris</th>
                    <th className="text-right text-xs font-semibold text-gray-400 uppercase pb-2">Totalt</th>
                  </tr>
                </thead>
                <tbody>
                  {previewTemplate.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-3 text-gray-700">{item.description}</td>
                      <td className="py-3 text-center text-gray-500">{item.qty}</td>
                      <td className="py-3 text-right text-gray-500">{formatSEK(item.unitPrice)}</td>
                      <td className="py-3 text-right font-semibold text-gray-900">{formatSEK(item.qty * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Delsumma (exkl. moms)</p>
                  <p className="text-xl font-bold text-indigo-600 mt-0.5">
                    {formatSEK(previewTemplate.items.reduce((s, i) => s + i.qty * i.unitPrice, 0))}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setPreviewId(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Stäng
                </button>
                <Link
                  href="/quotes/new"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl text-center transition-colors"
                >
                  Använd den här mallen
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
