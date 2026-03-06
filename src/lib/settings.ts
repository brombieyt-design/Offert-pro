// ---------------------------------------------------------------------------
// Company settings – stored in localStorage
// ---------------------------------------------------------------------------

export interface CompanySettings {
  companyName: string;
  orgNumber: string;
  vatNumber: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  website: string;
  bankgiro: string;
  plusgiro: string;
  swish: string;
  logo: string; // base64 data URL or empty string
  invoiceFooter: string;
  defaultTaxRate: number;
  defaultPaymentTermDays: number;
  defaultValidDays: number;
}

const STORAGE_KEY = "offertpro_settings";

const DEFAULT_SETTINGS: CompanySettings = {
  companyName: "",
  orgNumber: "",
  vatNumber: "",
  address: "",
  city: "",
  email: "",
  phone: "",
  website: "",
  bankgiro: "",
  plusgiro: "",
  swish: "",
  logo: "",
  invoiceFooter: "Tack för ditt förtroende!",
  defaultTaxRate: 25,
  defaultPaymentTermDays: 30,
  defaultValidDays: 30,
};

export function loadSettings(): CompanySettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<CompanySettings>): void {
  if (typeof window === "undefined") return;
  const current = loadSettings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...settings }));
}
