// ---------------------------------------------------------------------------
// Quote/Invoice templates – stored in localStorage
// ---------------------------------------------------------------------------

export interface TemplateLineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: "quote" | "invoice" | "both";
  lineItems: TemplateLineItem[];
  message: string;
  createdAt: string;
}

const STORAGE_KEY = "offertpro_templates";

const SEED_TEMPLATES: Template[] = [
  {
    id: "tpl-1",
    name: "Webbprojekt – Grundpaket",
    description: "Design + frontendutveckling för en ny webbplats",
    type: "both",
    lineItems: [
      { description: "UX-design & prototyp", qty: 1, unitPrice: 25000 },
      { description: "Frontendutveckling", qty: 1, unitPrice: 40000 },
      { description: "CMS-integration", qty: 1, unitPrice: 15000 },
      { description: "Testning & lansering", qty: 1, unitPrice: 10000 },
    ],
    message:
      "Tack för att du valde oss för ditt webbprojekt! Vi ser fram emot ett bra samarbete.",
    createdAt: "2024-10-01T08:00:00.000Z",
  },
  {
    id: "tpl-2",
    name: "Konsultation – Månadsavtal",
    description: "Löpande IT-konsultation på timsbasis",
    type: "invoice",
    lineItems: [
      { description: "IT-konsultation", qty: 40, unitPrice: 1500 },
    ],
    message: "",
    createdAt: "2024-10-05T08:00:00.000Z",
  },
  {
    id: "tpl-3",
    name: "Digital Marknadsföring",
    description: "Social media, SEO och annonsering",
    type: "quote",
    lineItems: [
      { description: "Social media-hantering", qty: 1, unitPrice: 8000 },
      { description: "SEO-optimering", qty: 1, unitPrice: 6000 },
      { description: "Google Ads-hantering", qty: 1, unitPrice: 5000 },
    ],
    message:
      "Vi hjälper dig att nå fler kunder online med en skräddarsydd digital strategi.",
    createdAt: "2024-10-10T08:00:00.000Z",
  },
];

export function loadTemplates(): Template[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Template[];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TEMPLATES));
    return SEED_TEMPLATES;
  } catch {
    return [];
  }
}

export function saveTemplates(templates: Template[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function addTemplate(data: Omit<Template, "id" | "createdAt">): Template {
  const templates = loadTemplates();
  const newTemplate: Template = {
    ...data,
    id: `tpl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  saveTemplates([...templates, newTemplate]);
  return newTemplate;
}

export function updateTemplate(id: string, data: Partial<Template>): void {
  saveTemplates(loadTemplates().map((t) => (t.id === id ? { ...t, ...data } : t)));
}

export function deleteTemplate(id: string): void {
  saveTemplates(loadTemplates().filter((t) => t.id !== id));
}
