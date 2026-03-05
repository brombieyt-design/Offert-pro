import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const pricingTiers = [
  {
    name: "Gratis",
    price: "0 kr",
    period: "/månad",
    description: "Prova Offert-pro utan några förpliktelser",
    features: [
      "5 offerter per månad",
      "1 användare",
      "Grundläggande PDF-export",
      "E-postleverans",
      "7 dagars offertgiltighet",
      "Grundläggande mallar",
      "Community-support",
    ],
    notIncluded: [
      "Anpassad profilering",
      "Realtidsspårning",
      "E-signaturer",
      "Automatiska påminnelser",
      "Analys",
    ],
    cta: "Kom igång gratis",
    ctaHref: "/dashboard",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "199 kr",
    period: "/månad",
    description: "För frilansare och soloföretagare redo att växa",
    features: [
      "25 offerter per månad",
      "1 användare",
      "Anpassad profilering och logotyp",
      "Realtidsspårning av öppningar",
      "E-signaturer",
      "Automatiska uppföljningspåminnelser",
      "Mallbibliotek (20+)",
      "E-postsupport (48 h)",
    ],
    notIncluded: [
      "Avancerad analys",
      "Anpassad domän",
      "API-åtkomst",
      "CRM-integrationer",
    ],
    cta: "Starta 14 dagars gratis provperiod",
    ctaHref: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "499 kr",
    period: "/månad",
    description: "För växande team som vill ha varje fördel",
    features: [
      "Obegränsat antal offerter",
      "3 användare",
      "Anpassad domän",
      "Avancerad analysdashboard",
      "Prioriterad support (4 h)",
      "API-åtkomst",
      "CRM-integrationer (HubSpot, Salesforce)",
      "White-label PDF:er",
      "Anpassad offertgiltighet",
      "Kundportal",
    ],
    notIncluded: [],
    cta: "Starta 14 dagars gratis provperiod",
    ctaHref: "/dashboard",
    highlighted: true,
    badge: "Mest populär",
  },
  {
    name: "Business",
    price: "999 kr",
    period: "/månad",
    description: "För byråer och team som behöver enterprise-funktioner",
    features: [
      "Obegränsat antal offerter",
      "10 användare",
      "Allt i Pro",
      "Teamsamarbete",
      "Rollbaserade behörigheter",
      "Anpassade godkännandeflöden",
      "Dedikerad kontaktperson",
      "SSO / SAML-inloggning",
      "Avancerad rapportering och export",
      "Zapier + Make-integration",
      "SLA-garanti",
    ],
    notIncluded: [],
    cta: "Kontakta sälj",
    ctaHref: "#contact",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "Kan jag byta plan när som helst?",
    answer: "Ja, absolut. Du kan uppgradera eller nedgradera din plan när som helst. Uppgraderingar träder i kraft omedelbart och du debiteras proportionellt för resterande faktureringsperiod. Nedgraderingar träder i kraft vid nästa faktureringscykel.",
  },
  {
    question: "Finns det en gratis provperiod?",
    answer: "Ja! Alla betalplaner inkluderar en 14 dagars gratis provperiod, inget kreditkort krävs. Du får full tillgång till alla funktioner i din valda plan under provperioden.",
  },
  {
    question: "Vad räknas som en 'offert'?",
    answer: "En offert är vilket förlagsdokument du än skapar och sparar. Utkast räknas mot din månadsgräns, men borttagna offerter gör det inte. Oanvända offerter förs inte vidare till nästa månad.",
  },
  {
    question: "Är e-signaturer juridiskt bindande?",
    answer: "Ja. Vår e-signaturfunktion följer eIDAS (EU), ESIGN Act (USA) och liknande regelverk världen över. Varje signerat dokument inkluderar ett granskningsspår med tidsstämplar och IP-adresser.",
  },
  {
    question: "Erbjuder ni rabatt för årsbetalning?",
    answer: "Ja! Byt till årsbetalning och spara 20% på valfri betalplan. Årsplaner faktureras i förväg för hela året.",
  },
  {
    question: "Vilka integrationer finns tillgängliga?",
    answer: "Offert-pro integrerar med HubSpot, Salesforce, QuickBooks, Xero, Slack, Gmail och mer. Pro- och Business-planer får även tillgång till Zapier och Make för anpassade automatiseringar.",
  },
  {
    question: "Är min data säker?",
    answer: "Absolut. Vi använder AES-256-kryptering i vila och TLS 1.3 i transit. Vår infrastruktur är hostad på AWS med SOC 2 Type II-efterlevnad. Vi delar aldrig din data med tredje part.",
  },
  {
    question: "Kan jag white-label offerter för mina kunder?",
    answer: "Pro- och Business-planer stöder fullständig white-labeling – din logotyp, varumärkesfärger, anpassad domän och ingen synlig Offert-pro-märkning för dina kunder.",
  },
];

const compareFeatures = [
  { feature: "Offerter per månad", free: "5", starter: "25", pro: "Obegränsat", business: "Obegränsat" },
  { feature: "Användare", free: "1", starter: "1", pro: "3", business: "10" },
  { feature: "Anpassad profilering", free: false, starter: true, pro: true, business: true },
  { feature: "PDF-export", free: "Grundläggande", starter: "Profilsatt", pro: "White-label", business: "White-label" },
  { feature: "Realtidsspårning", free: false, starter: true, pro: true, business: true },
  { feature: "E-signaturer", free: false, starter: true, pro: true, business: true },
  { feature: "Automatiska påminnelser", free: false, starter: true, pro: true, business: true },
  { feature: "Analys", free: false, starter: "Grundläggande", pro: "Avancerad", business: "Avancerad" },
  { feature: "Anpassad domän", free: false, starter: false, pro: true, business: true },
  { feature: "API-åtkomst", free: false, starter: false, pro: true, business: true },
  { feature: "CRM-integrationer", free: false, starter: false, pro: true, business: true },
  { feature: "SSO / SAML", free: false, starter: false, pro: false, business: true },
  { feature: "Dedikerad support", free: false, starter: false, pro: false, business: true },
  { feature: "Support", free: "Community", starter: "E-post (48 h)", pro: "Prioriterad (4 h)", business: "Dedikerad" },
];

function CheckIcon({ className = "w-4 h-4 text-emerald-500" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4 text-gray-300" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <CheckIcon />;
  if (value === false) return <XIcon />;
  return <span className="text-sm text-gray-700">{value}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hjälte */}
      <section className="pt-24 pb-16 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-6">
            Enkla, transparenta priser
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Börja gratis. Väx i din takt.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Inga dolda avgifter, ingen årslock, inga överraskningar. Välj planen som passar idag – uppgradera när du är redo.
          </p>

          {/* Faktureringsväxlare (dekorativ) */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-sm font-semibold text-gray-700">Månadsvis</span>
            <div className="relative w-12 h-6 bg-indigo-600 rounded-full cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-sm font-semibold text-indigo-600">
              Årsvis
              <span className="ml-1.5 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full font-semibold">Spara 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Priskort */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  tier.highlighted
                    ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 lg:scale-105 border-0"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={`text-base font-bold mb-1 ${tier.highlighted ? "text-indigo-100" : "text-gray-500"}`}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-extrabold ${tier.highlighted ? "text-white" : "text-gray-900"}`}>
                      {tier.price}
                    </span>
                    <span className={`text-sm ${tier.highlighted ? "text-indigo-200" : "text-gray-400"}`}>
                      {tier.period}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${tier.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                    {tier.description}
                  </p>
                </div>

                <Link
                  href={tier.ctaHref}
                  className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all mb-6 ${
                    tier.highlighted
                      ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-100"
                  }`}
                >
                  {tier.cta}
                </Link>

                <ul className="space-y-2.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlighted ? "text-emerald-300" : "text-emerald-500"}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${tier.highlighted ? "text-indigo-100" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                  {tier.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 opacity-40">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlighted ? "text-indigo-300" : "text-gray-400"}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className={`text-sm line-through ${tier.highlighted ? "text-indigo-200" : "text-gray-400"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Alla betalplaner inkluderar en 14 dagars gratis provperiod. Inget kreditkort krävs.
          </p>
        </div>
      </section>

      {/* Funktionsjämförelsetabell */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Jämför alla funktioner
            </h2>
            <p className="text-gray-500">En detaljerad genomgång av vad som ingår i varje plan.</p>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="min-w-[560px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Tabellhuvud */}
            <div className="grid grid-cols-5 border-b border-gray-100 bg-gray-50/50">
              <div className="col-span-1 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Funktion
              </div>
              {["Gratis", "Starter", "Pro", "Business"].map((plan) => (
                <div key={plan} className="px-4 py-4 text-center">
                  <span className={`text-sm font-bold ${plan === "Pro" ? "text-indigo-600" : "text-gray-900"}`}>
                    {plan}
                  </span>
                  {plan === "Pro" && (
                    <span className="block text-xs text-indigo-400 font-medium">Mest populär</span>
                  )}
                </div>
              ))}
            </div>

            {/* Tabellrader */}
            {compareFeatures.map((row, index) => (
              <div
                key={row.feature}
                className={`grid grid-cols-5 ${index < compareFeatures.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}
              >
                <div className="col-span-1 px-6 py-3.5">
                  <span className="text-sm font-medium text-gray-700">{row.feature}</span>
                </div>
                {[row.free, row.starter, row.pro, row.business].map((val, i) => (
                  <div key={i} className="px-4 py-3.5 flex items-center justify-center">
                    <CellValue value={val} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* FAQ-sektion */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Vanliga frågor
            </h2>
            <p className="text-gray-500">
              Hittar du inte ditt svar?{" "}
              <a href="mailto:hej@offert-pro.se" className="text-indigo-600 hover:underline">
                Kontakta oss
              </a>
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none list-none">
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-gray-400 shrink-0 transition-transform group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Omdömesremsa */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Bytte från ett verktyg för 1 500 kr/mån till Offert-pro Pro för 499 kr. Bättre funktioner, bättre resultat.",
                author: "Marcus T.",
                role: "Blue Ridge Construction",
                avatar: "MT",
                bg: "bg-blue-500",
              },
              {
                quote: "Gratisplanen kom igång mig. Uppgraderade till Starter samma vecka – helt värt det.",
                author: "Priya S.",
                role: "Pixel Studio",
                avatar: "PS",
                bg: "bg-purple-500",
              },
              {
                quote: "Business-planen för min byrå var självklar. Hela mitt team använder det dagligen.",
                author: "Rachel M.",
                role: "Spark Creative Agency",
                avatar: "RM",
                bg: "bg-rose-500",
              },
            ].map((t) => (
              <div key={t.author} className="bg-slate-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${t.bg} text-white text-xs font-bold flex items-center justify-center`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Redo att komma igång?
          </h2>
          <p className="text-lg text-indigo-200 mb-8 max-w-xl mx-auto">
            Gå med 500+ företag som avslutar fler affärer med snygga offerter. Börja gratis idag.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded-2xl transition-all shadow-lg"
            >
              Kom igång gratis – inget kort krävs
            </Link>
            <a
              href="mailto:hej@offert-pro.se"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-indigo-200 hover:text-white border border-indigo-400 rounded-2xl transition-colors"
            >
              Prata med sälj
            </a>
          </div>
        </div>
      </section>

      {/* Sidfot */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-bold text-white">Offert-pro</span>
            </div>
            <p className="text-sm">© 2026 Offert-pro, Inc. Alla rättigheter förbehållna.</p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:text-white transition-colors">Hem</Link>
              <Link href="#" className="hover:text-white transition-colors">Integritetspolicy</Link>
              <Link href="#" className="hover:text-white transition-colors">Användarvillkor</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
