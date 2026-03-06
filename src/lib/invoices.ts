// ---------------------------------------------------------------------------
// Invoice data model + localStorage persistence
// ---------------------------------------------------------------------------

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "partial";

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  // Client
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  clientOrgNumber: string;
  clientAddress: string;
  clientCity: string;
  clientReference: string;
  // Line items
  lineItems: InvoiceLineItem[];
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
  // Payment
  paymentTermDays: number;
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  // Meta
  sourceQuoteId?: string;
  createdAt: string;
  sentAt?: string;
}

const STORAGE_KEY = "offertpro_invoices";

const today = new Date();
const fmtDate = (d: Date) => d.toISOString().split("T")[0];
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return fmtDate(d);
};
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return fmtDate(d);
};

const SEED_INVOICES: Invoice[] = [
  {
    id: "si-1",
    invoiceNumber: "FAK-2024-001",
    status: "paid",
    clientName: "Anna Lindqvist",
    clientEmail: "anna@byggmax.se",
    clientPhone: "+46 70 123 45 67",
    clientCompany: "Byggmax AB",
    clientOrgNumber: "556123-4567",
    clientAddress: "Industrivägen 12",
    clientCity: "Stockholm",
    clientReference: "Proj-2024-webbshop",
    lineItems: [
      { description: "Webbdesign & UX", qty: 1, unitPrice: 45000 },
      { description: "Frontendutveckling", qty: 1, unitPrice: 55000 },
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
    paymentTermDays: 30,
    issuedAt: daysAgo(45),
    dueAt: daysAgo(15),
    paidAt: daysAgo(10),
    createdAt: new Date(today.getTime() - 45 * 86400000).toISOString(),
    sentAt: new Date(today.getTime() - 44 * 86400000).toISOString(),
  },
  {
    id: "si-2",
    invoiceNumber: "FAK-2024-002",
    status: "sent",
    clientName: "Erik Svensson",
    clientEmail: "erik@tekniksolutions.se",
    clientPhone: "+46 73 234 56 78",
    clientCompany: "Teknik Solutions",
    clientOrgNumber: "556234-5678",
    clientAddress: "Teknikgatan 5",
    clientCity: "Göteborg",
    clientReference: "",
    lineItems: [
      { description: "IT-konsultation (40h)", qty: 40, unitPrice: 1500 },
    ],
    taxRate: 25,
    subtotal: 60000,
    tax: 15000,
    total: 75000,
    rotEnabled: false,
    rotType: "rot",
    laborAmount: 0,
    personnummer: "",
    rotDeduction: 0,
    customerPays: 75000,
    paymentTermDays: 30,
    issuedAt: daysAgo(20),
    dueAt: daysFromNow(10),
    createdAt: new Date(today.getTime() - 20 * 86400000).toISOString(),
    sentAt: new Date(today.getTime() - 19 * 86400000).toISOString(),
  },
  {
    id: "si-3",
    invoiceNumber: "FAK-2024-003",
    status: "overdue",
    clientName: "Maria Bergström",
    clientEmail: "maria@nordicretail.se",
    clientPhone: "+46 76 345 67 89",
    clientCompany: "Nordic Retail",
    clientOrgNumber: "556345-6789",
    clientAddress: "Köpmansgatan 8",
    clientCity: "Malmö",
    clientReference: "E-handel Q4",
    lineItems: [
      { description: "E-handelslösning", qty: 1, unitPrice: 75000 },
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
    paymentTermDays: 14,
    issuedAt: daysAgo(40),
    dueAt: daysAgo(26),
    createdAt: new Date(today.getTime() - 40 * 86400000).toISOString(),
    sentAt: new Date(today.getTime() - 39 * 86400000).toISOString(),
  },
  {
    id: "si-4",
    invoiceNumber: "FAK-2024-004",
    status: "draft",
    clientName: "Johan Karlsson",
    clientEmail: "johan@fastighetsab.se",
    clientPhone: "+46 70 456 78 90",
    clientCompany: "Fastighets AB",
    clientOrgNumber: "556456-7890",
    clientAddress: "Fastighetsvägen 3",
    clientCity: "Uppsala",
    clientReference: "",
    lineItems: [
      { description: "Fastighetssystem – modul 1", qty: 1, unitPrice: 80000 },
      { description: "Utbildning (5 dagar)", qty: 5, unitPrice: 5000 },
    ],
    taxRate: 25,
    subtotal: 105000,
    tax: 26250,
    total: 131250,
    rotEnabled: false,
    rotType: "rot",
    laborAmount: 0,
    personnummer: "",
    rotDeduction: 0,
    customerPays: 131250,
    paymentTermDays: 30,
    issuedAt: fmtDate(today),
    dueAt: daysFromNow(30),
    createdAt: new Date().toISOString(),
  },
  {
    id: "si-5",
    invoiceNumber: "FAK-2024-005",
    status: "partial",
    clientName: "Sara Nilsson",
    clientEmail: "sara@mediaandco.se",
    clientPhone: "+46 72 567 89 01",
    clientCompany: "Media & Co",
    clientOrgNumber: "556567-8901",
    clientAddress: "Mediegatan 22",
    clientCity: "Stockholm",
    clientReference: "Kampanj nov",
    lineItems: [
      { description: "Digital marknadsföring (3 mån)", qty: 3, unitPrice: 15000 },
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
    paymentTermDays: 20,
    issuedAt: daysAgo(30),
    dueAt: daysAgo(10),
    createdAt: new Date(today.getTime() - 30 * 86400000).toISOString(),
    sentAt: new Date(today.getTime() - 29 * 86400000).toISOString(),
  },
];

export function loadInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Invoice[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INVOICES));
    return SEED_INVOICES;
  } catch {
    return [];
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
}

export function addInvoice(data: Omit<Invoice, "id" | "createdAt">): Invoice {
  const invoices = loadInvoices();
  const newInvoice: Invoice = {
    ...data,
    id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  saveInvoices([newInvoice, ...invoices]);
  return newInvoice;
}

export function updateInvoice(id: string, data: Partial<Invoice>): void {
  saveInvoices(loadInvoices().map((inv) => (inv.id === id ? { ...inv, ...data } : inv)));
}

export function deleteInvoice(id: string): void {
  saveInvoices(loadInvoices().filter((inv) => inv.id !== id));
}

export function getInvoice(id: string): Invoice | undefined {
  return loadInvoices().find((inv) => inv.id === id);
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const invoices = loadInvoices().filter((inv) => inv.invoiceNumber.includes(String(year)));
  const next = invoices.length + 1;
  return `FAK-${year}-${String(next).padStart(3, "0")}`;
}
