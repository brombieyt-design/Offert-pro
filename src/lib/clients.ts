// ---------------------------------------------------------------------------
// Client data model + localStorage persistence
// ---------------------------------------------------------------------------

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  orgNumber: string;
  address: string;
  city: string;
  notes: string;
  createdAt: string;
}

const STORAGE_KEY = "offertpro_clients";

const SEED_CLIENTS: Client[] = [
  {
    id: "seed-1",
    name: "Anna Lindqvist",
    email: "anna@byggmax.se",
    phone: "+46 70 123 45 67",
    company: "Byggmax AB",
    orgNumber: "556123-4567",
    address: "Industrivägen 12",
    city: "Stockholm",
    notes: "Föredrar offert som PDF. Snabb betalare.",
    createdAt: "2024-09-01T08:00:00.000Z",
  },
  {
    id: "seed-2",
    name: "Erik Svensson",
    email: "erik@tekniksolutions.se",
    phone: "+46 73 234 56 78",
    company: "Teknik Solutions",
    orgNumber: "556234-5678",
    address: "Teknikgatan 5",
    city: "Göteborg",
    notes: "",
    createdAt: "2024-09-15T08:00:00.000Z",
  },
  {
    id: "seed-3",
    name: "Maria Bergström",
    email: "maria@nordicretail.se",
    phone: "+46 76 345 67 89",
    company: "Nordic Retail",
    orgNumber: "556345-6789",
    address: "Köpmansgatan 8",
    city: "Malmö",
    notes: "Kontakta alltid per e-post i första hand.",
    createdAt: "2024-10-01T08:00:00.000Z",
  },
  {
    id: "seed-4",
    name: "Johan Karlsson",
    email: "johan@fastighetsab.se",
    phone: "+46 70 456 78 90",
    company: "Fastighets AB",
    orgNumber: "556456-7890",
    address: "Fastighetsvägen 3",
    city: "Uppsala",
    notes: "",
    createdAt: "2024-10-20T08:00:00.000Z",
  },
  {
    id: "seed-5",
    name: "Sara Nilsson",
    email: "sara@mediaandco.se",
    phone: "+46 72 567 89 01",
    company: "Media & Co",
    orgNumber: "556567-8901",
    address: "Mediegatan 22",
    city: "Stockholm",
    notes: "Jobbar med ROT-projekt.",
    createdAt: "2024-11-05T08:00:00.000Z",
  },
];

export function loadClients(): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Client[];
    // First visit – seed with demo clients
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CLIENTS));
    return SEED_CLIENTS;
  } catch {
    return [];
  }
}

export function saveClients(clients: Client[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function addClient(data: Omit<Client, "id" | "createdAt">): Client {
  const clients = loadClients();
  const newClient: Client = {
    ...data,
    id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  saveClients([...clients, newClient]);
  return newClient;
}

export function updateClient(id: string, data: Partial<Omit<Client, "id" | "createdAt">>): void {
  saveClients(loadClients().map((c) => (c.id === id ? { ...c, ...data } : c)));
}

export function deleteClient(id: string): void {
  saveClients(loadClients().filter((c) => c.id !== id));
}
