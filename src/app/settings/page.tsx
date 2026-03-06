"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { type CompanySettings, loadSettings, saveSettings } from "@/lib/settings";

type Tab = "company" | "invoice" | "defaults";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("company");
  const [settings, setSettings] = useState<CompanySettings>(loadSettings());
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const set = (key: keyof CompanySettings) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setSettings((prev) => ({ ...prev, [key]: e.target.value }));

  const setNum = (key: keyof CompanySettings) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setSettings((prev) => ({ ...prev, [key]: Number(e.target.value) }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setSettings((prev) => ({ ...prev, logo: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "company",
      label: "Företagsprofil",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      key: "invoice",
      label: "Betalning",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      key: "defaults",
      label: "Standardvärden",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inställningar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Din information visas på offerter och fakturor</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Sidomeny */}
          <div className="sm:w-52 shrink-0">
            <nav className="bg-white border border-gray-100 rounded-2xl shadow-sm p-2 flex sm:flex-col gap-1">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-colors ${
                    activeTab === t.key
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Innehåll */}
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

            {/* Företagsprofil */}
            {activeTab === "company" && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Företagsprofil</h2>

                  {/* Logotyp */}
                  <div className="mb-5">
                    <label className={labelCls}>Logotyp</label>
                    <div className="flex items-center gap-4">
                      {settings.logo ? (
                        <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain border border-gray-200 rounded-xl bg-gray-50 p-1" />
                      ) : (
                        <div className="w-16 h-16 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50">
                          <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <button
                          onClick={() => fileRef.current?.click()}
                          className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                        >
                          {settings.logo ? "Byt logotyp" : "Ladda upp logotyp"}
                        </button>
                        {settings.logo && (
                          <button
                            onClick={() => setSettings((p) => ({ ...p, logo: "" }))}
                            className="ml-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 border border-red-100 rounded-lg transition-colors"
                          >
                            Ta bort
                          </button>
                        )}
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG · Max 2MB</p>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Företagsnamn *</label>
                      <input value={settings.companyName} onChange={set("companyName")} placeholder="Ditt Företag AB" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Organisationsnummer</label>
                      <input value={settings.orgNumber} onChange={set("orgNumber")} placeholder="556123-4567" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>VAT-nummer (momsreg.nr)</label>
                      <input value={settings.vatNumber} onChange={set("vatNumber")} placeholder="SE556123456701" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>E-post</label>
                      <input type="email" value={settings.email} onChange={set("email")} placeholder="info@dittforetag.se" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Telefon</label>
                      <input type="tel" value={settings.phone} onChange={set("phone")} placeholder="+46 70 123 45 67" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Webbplats</label>
                      <input value={settings.website} onChange={set("website")} placeholder="www.dittforetag.se" className={inputCls} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Adress</label>
                      <input value={settings.address} onChange={set("address")} placeholder="Storgatan 1" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Stad</label>
                      <input value={settings.city} onChange={set("city")} placeholder="Stockholm" className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Betalning */}
            {activeTab === "invoice" && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-4">Betalningsinformation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Bankgiro</label>
                    <input value={settings.bankgiro} onChange={set("bankgiro")} placeholder="1234-5678" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Plusgiro</label>
                    <input value={settings.plusgiro} onChange={set("plusgiro")} placeholder="12 34 56-7" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Swish</label>
                    <input value={settings.swish} onChange={set("swish")} placeholder="123 456 78 90" className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Sidfot på faktura</label>
                    <textarea
                      value={settings.invoiceFooter}
                      onChange={set("invoiceFooter")}
                      placeholder="Tack för ditt förtroende! Vänligen ange fakturanummer vid betalning."
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Standardvärden */}
            {activeTab === "defaults" && (
              <div>
                <h2 className="text-base font-semibold text-gray-900 mb-4">Standardvärden</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Standardmoms (%)</label>
                    <select value={settings.defaultTaxRate} onChange={setNum("defaultTaxRate")} className={inputCls + " bg-white"}>
                      <option value={0}>0% (momsfri)</option>
                      <option value={6}>6%</option>
                      <option value={12}>12%</option>
                      <option value={25}>25%</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Standard betalningsvillkor</label>
                    <select value={settings.defaultPaymentTermDays} onChange={setNum("defaultPaymentTermDays")} className={inputCls + " bg-white"}>
                      <option value={0}>Omgående</option>
                      <option value={10}>10 dagar</option>
                      <option value={20}>20 dagar</option>
                      <option value={30}>30 dagar</option>
                      <option value={45}>45 dagar</option>
                      <option value={60}>60 dagar</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Offertens giltighetstid (dagar)</label>
                    <select value={settings.defaultValidDays} onChange={setNum("defaultValidDays")} className={inputCls + " bg-white"}>
                      <option value={7}>7 dagar</option>
                      <option value={14}>14 dagar</option>
                      <option value={30}>30 dagar</option>
                      <option value={60}>60 dagar</option>
                      <option value={90}>90 dagar</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Spara */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Spara inställningar
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Sparat!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
