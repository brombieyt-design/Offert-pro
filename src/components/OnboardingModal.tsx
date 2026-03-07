"use client";

import React, { useState } from "react";
import { saveSettings } from "@/lib/settings";

interface Props {
  onComplete: (companyName: string) => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    saveSettings({ companyName: name.trim(), orgNumber: orgNumber.trim() });
    onComplete(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Icon */}
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Välkommen till Offert-pro</h2>
        <p className="text-sm text-gray-500 text-center mb-7">
          Fyll i ditt företagsnamn så ser det rätt ut på offerterna från dag ett.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Företagsnamn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.ex. Lindgrens Bygg AB"
              autoFocus
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Organisationsnummer <span className="text-gray-400 font-normal">(valfritt)</span>
            </label>
            <input
              type="text"
              value={orgNumber}
              onChange={(e) => setOrgNumber(e.target.value)}
              placeholder="556000-0000"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors mt-2"
          >
            Kom igång
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5">
          Du kan ändra detta när som helst under <span className="text-gray-600">Inställningar</span>.
        </p>
      </div>
    </div>
  );
}
