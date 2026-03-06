// ---------------------------------------------------------------------------
// Quote data model + localStorage persistence
// ---------------------------------------------------------------------------

export type QuoteStatus = "draft" | "sent" | "opened" | "accepted" | "declined";

export interface QuoteLineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  status: QuoteStatus;
  // Client
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientAddress: string;
  clientCity: string;
  clientNotes: string;
  // Line items
  lineItems: QuoteLineItem[];
  // Financials
  taxRate: number;
  subtotal: number;
  tax: number;
  total: number;
  // ROT/RUT
  rotEnabled: boolean;
  rotType: "rot" | "rut";
  laborAmount: number;
  personnummer: string;
  rotDeduction: number;
  customerPays: number;
  // Meta
  validDays: number;
  message: string;
  sendMethod: "email" | "sms" | "link";
  createdAt: string;
  sentAt?: string;
  openedAt?: string;
  acceptedAt?: string;
  declinedAt?: string;
  // Link to converted invoice
  invoiceId?: string;
}

const STORAGE_KEY = "offertpro_quotes";

const SEED_QUOTES: Quote[] = [
  {
    id: "sq-1",
    quoteNumber: "QT-2024-001",
    status: "accepted",
    clientName: "Anna Lindqvist",
    clientEmail: "anna@byggmax.se",
    clientPhone: "+46 70 123 45 67",
    clientCompany: "Byggmax AB",
    clientAddress: "Industrivägen 12",
    clientCity: "Stockholm",
    clientNotes: "",
    lineItems: [
      { id: "li-1", description: "Webbdesign & UX", qty: 1, unitPrice: 45000 },
      { id: "li-2", description: "Frontendutveckling", qty: 1, unitPrice: 55000 },
    ],
    taxRate: 25,
    subtotal: 100000,
    tax: 25000,
    total: 125000,
    rotEnabled: false,
    rotType: "rot",
    laborAmount: 0,
    personnummer: "",
    rotDeduction: 0,
    customerPays: 125000,
    validDays: 30,
    message: "Tack för din förfrågan! Se bifogad offert.",
    sendMethod: "email",
    createdAt: "2024-11-01T10:00:00.000Z",
    sentAt: "2024-11-01T10:05:00.000Z",
    acceptedAt: "2024-11-05T14:30:00.000Z",
  },
  {
    id: "sq-2",
    quoteNumber: "QT-2024-002",
    status: "sent",
    clientName: "Erik Svensson",
    clientEmail: "erik@tekniksolutions.se",
    clientPhone: "+46 73 234 56 78",
    clientCompany: "Teknik Solutions",
    clientAddress: "Teknikgatan 5",
    clientCity: "Göteborg",
    clientNotes: "",
    lineItems: [
      { id: "li-3", description: "IT-konsultation", qty: 40, unitPrice: 1500 },
      { id: "li-4", description: "Systemintegration", qty: 1, unitPrice: 25000 },
    ],
    taxRate: 25,
    subtotal: 85000,
    tax: 21250,
    total: 106250,
    rotEnabled: false,
    rotType: "rot",
    laborAmount: 0,
    personnummer: "",
    rotDeduction: 0,
    customerPays: 106250,
    validDays: 14,
    message: "",
    sendMethod: "email",
    createdAt: "2024-11-10T09:00:00.000Z",
    sentAt: "2024-11-10T09:15:00.000Z",
  },
  {
    id: "sq-3",
    quoteNumber: "QT-2024-003",
    status: "opened",
    clientName: "Maria Bergström",
    clientEmail: "maria@nordicretail.se",
    clientPhone: "+46 76 345 67 89",
    clientCompany: "Nordic Retail",
    clientAddress: "Köpmansgatan 8",
    clientCity: "Malmö",
    clientNotes: "",
    lineItems: [
      { id: "li-5", description: "E-handelslösning", qty: 1, unitPrice: 75000 },
    ],
    taxRate: 25,
    subtotal: 75000,
    tax: 18750,
    total: 93750,
    rotEnabled: false,
    rotType: "rot",
    laborAmount: 0,
    personnummer: "",
    rotDeduction: 0,
    customerPays: 93750,
    validDays: 30,
    message: "",
    sendMethod: "email",
    createdAt: "2024-11-15T11:00:00.000Z",
    sentAt: "2024-11-15T11:30:00.000Z",
    openedAt: "2024-11-16T08:45:00.000Z",
  },
  {
    id: "sq-4",
    quoteNumber: "QT-2024-004",
    status: "draft",
    clientName: "Johan Karlsson",
    clientEmail: "johan@fastighetsab.se",
    clientPhone: "+46 70 456 78 90",
    clientCompany: "Fastighets AB",
    clientAddress: "Fastighetsvägen 3",
    clientCity: "Uppsala",
    clientNotes: "",
    lineItems: [
      { id: "li-6", description: "Fastighetssystem", qty: 1, unitPrice: 120000 },
      { id: "li-7", description: "Utbildning", qty: 5, unitPrice: 5000 },
    ],
    taxRate: 25,
    subtotal: 145000,
    tax: 36250,
    total: 181250,
    rotEnabled: false,
    rotType: "rot",
    laborAmount: 0,
    personnummer: "",
    rotDeduction: 0,
    customerPays: 181250,
    validDays: 30,
    message: "",
    sendMethod: "email",
    createdAt: "2024-11-20T13:00:00.000Z",
  },
  {
    id: "sq-5",
    quoteNumber: "QT-2024-005",
    status: "declined",
    clientName: "Sara Nilsson",
    clientEmail: "sara@mediaandco.se",
    clientPhone: "+46 72 567 89 01",
    clientCompany: "Media & Co",
    clientAddress: "Mediegatan 22",
    clientCity: "Stockholm",
    clientNotes: "",
    lineItems: [
      { id: "li-8", description: "Digital marknadsföring", qty: 3, unitPrice: 15000 },
    ],
    taxRate: 25,
    subtotal: 45000,
    tax: 11250,
    total: 56250,
    rotEnabled: false,
    rotType: "rot",
    laborAmount: 0,
    personnummer: "",
    rotDeduction: 0,
    customerPays: 56250,
    validDays: 14,
    message: "",
    sendMethod: "email",
    createdAt: "2024-10-20T10:00:00.000Z",
    sentAt: "2024-10-20T10:30:00.000Z",
    declinedAt: "2024-10-25T16:00:00.000Z",
  },
];

export function loadQuotes(): Quote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Quote[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_QUOTES));
    return SEED_QUOTES;
  } catch {
    return [];
  }
}

export function saveQuotes(quotes: Quote[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

export function addQuote(data: Omit<Quote, "id" | "createdAt">): Quote {
  const quotes = loadQuotes();
  const newQuote: Quote = {
    ...data,
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  saveQuotes([newQuote, ...quotes]);
  return newQuote;
}

export function updateQuote(id: string, data: Partial<Quote>): void {
  saveQuotes(loadQuotes().map((q) => (q.id === id ? { ...q, ...data } : q)));
}

export function deleteQuote(id: string): void {
  saveQuotes(loadQuotes().filter((q) => q.id !== id));
}

export function getQuote(id: string): Quote | undefined {
  return loadQuotes().find((q) => q.id === id);
}

export function generateQuoteNumber(): string {
  const year = new Date().getFullYear();
  const quotes = loadQuotes().filter((q) => q.quoteNumber.includes(String(year)));
  const next = quotes.length + 1;
  return `QT-${year}-${String(next).padStart(3, "0")}`;
}
