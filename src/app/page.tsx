import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const steps = [
  {
    number: "01",
    title: "Skapa offerten",
    description: "Fyll i kund och radartiklar. Välj ROT/RUT om det gäller. Klar på 2 minuter.",
  },
  {
    number: "02",
    title: "Skicka länken",
    description: "Kunden öppnar offerten direkt i webbläsaren — ingen app, inget konto krävs.",
  },
  {
    number: "03",
    title: "Kunden accepterar",
    description: "Med ett klick. Konvertera sedan till faktura direkt från offertvyn.",
  },
];

const differentiators = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Kunden godkänner online",
    description: "Ingen PDF-bilaga i mailen. Kunden accepterar eller avböjer direkt via en länk — du ser det i realtid.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "ROT/RUT-avdrag inbyggt",
    description: "Beräknar automatiskt vad kunden faktiskt betalar efter avdraget. Konkurrenterna tar extra betalt för det.",
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Ingen installation",
    description: "Fungerar i webbläsaren. Dina offerter och fakturor sparas lokalt — inget konto behövs för att komma igång.",
    color: "text-amber-600 bg-amber-50",
  },
];

const pricingTiers = [
  {
    name: "Gratis",
    price: "0 kr",
    period: "/månad",
    description: "Perfekt för att komma igång",
    features: [
      "5 offerter per månad",
      "1 användare",
      "Grundläggande PDF-export",
      "E-postleverans",
      "7 dagars offertgiltighet",
    ],
    cta: "Kom igång gratis",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "199 kr",
    period: "/månad",
    description: "För frilansare och soloföretagare",
    features: [
      "25 offerter per månad",
      "1 användare",
      "Anpassad profilering",
      "Realtidsspårning",
      "Mallbibliotek",
      "Automatiska påminnelser",
    ],
    cta: "Starta gratis provperiod",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "499 kr",
    period: "/månad",
    description: "För växande småföretag",
    features: [
      "Obegränsat antal offerter",
      "3 användare",
      "Avancerad analys",
      "Anpassad domän",
      "Prioriterad support",
      "API-åtkomst",
      "CRM-integrationer",
    ],
    cta: "Starta gratis provperiod",
    highlighted: true,
    badge: "Mest populär",
  },
  {
    name: "Business",
    price: "999 kr",
    period: "/månad",
    description: "För team och byråer",
    features: [
      "Obegränsat antal offerter",
      "10 användare",
      "Teamsamarbete",
      "Anpassade arbetsflöden",
      "Dedikerad support",
      "SSO / SAML",
      "Avancerad rapportering",
    ],
    cta: "Kontakta sälj",
    highlighted: false,
  },
];

const testimonials = [
  {
    quote: "Förut skickade jag Word-dokument som PDF. Nu skickar jag en länk och kunden accepterar direkt. Jag fick betalt tre dagar snabbare redan första månaden.",
    author: "Erik Lindgren",
    role: "Snickeri Lindgren AB, Göteborg",
    initials: "EL",
    color: "bg-blue-600",
  },
  {
    quote: "Att kunden kan säga ja direkt i webbläsaren utan att skriva ut något gör hela skillnaden. Mina kunder förstår offerten och tvekar inte lika länge.",
    author: "Anna Söderberg",
    role: "Söderbergs Städ & Service, Malmö",
    initials: "AS",
    color: "bg-emerald-600",
  },
  {
    quote: "Jag körde Word-mallar i tio år. Det här är inte ens samma sak. Att konvertera en accepterad offert till faktura med ett klick sparar mig en timme i veckan.",
    author: "Johan Bergqvist",
    role: "JB Konsult, Stockholm",
    initials: "JB",
    color: "bg-violet-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero — mörk */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-400 mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Byggt för svenska småföretag
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Sluta skicka PDF:er
            <br />
            <span className="text-indigo-400">från Word.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professionella offerter och fakturor — på 2 minuter, utan krångel. Kunden accepterar online, du fakturerar med ett klick.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              Prova gratis
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-300 hover:text-white border border-white/20 hover:border-white/40 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Se hur det fungerar
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Inget kreditkort krävs · Fungerar i webbläsaren · GDPR-säkert
          </p>
        </div>
      </section>

      {/* Så fungerar det */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Så fungerar det</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Tre steg från offert till betalning
            </h2>
          </div>

          <div className="relative">
            {/* Linje mellan stegen */}
            <div className="hidden lg:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gray-200" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6">
              {steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-5 relative z-10">
                    <span className="text-2xl font-extrabold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {differentiators.map((d) => (
              <div key={d.title} className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-xl ${d.color} flex items-center justify-center mb-4`}>
                  {d.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{d.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{d.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prissektion */}
      <section id="pricing" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest mb-3">Priser</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Börja gratis, väx i din takt
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Inga dolda avgifter. Inga årskontrakt. Avsluta när du vill.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  tier.highlighted
                    ? "bg-gray-900 text-white shadow-2xl shadow-gray-900/20 lg:scale-105 border-0"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-base font-bold mb-1 ${tier.highlighted ? "text-gray-400" : "text-gray-500"}`}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-extrabold ${tier.highlighted ? "text-white" : "text-gray-900"}`}>
                      {tier.price}
                    </span>
                    <span className={`text-sm ${tier.highlighted ? "text-gray-400" : "text-gray-500"}`}>
                      {tier.period}
                    </span>
                  </div>
                  <p className={`text-xs ${tier.highlighted ? "text-gray-400" : "text-gray-500"}`}>
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlighted ? "text-indigo-400" : "text-emerald-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${tier.highlighted ? "text-gray-300" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all ${
                    tier.highlighted
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Omdömen */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Vad säger användarna?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <blockquote className="text-sm text-gray-700 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${t.color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                    {t.initials}
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

      {/* CTA-sektion */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Redo att testa?
          </h2>
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
            Kom igång direkt i webbläsaren. Ingen registrering, inget kreditkort.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5"
            >
              Prova gratis nu
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-400 hover:text-white border border-white/20 hover:border-white/40 rounded-2xl transition-colors"
            >
              Se priser
            </Link>
          </div>
          <p className="mt-5 text-sm text-gray-600">Inget kreditkort krävs · GDPR-säkert</p>
        </div>
      </section>

      {/* Sidfot */}
      <footer id="about" className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-base font-bold text-white">Offert-pro</span>
              </div>
              <p className="text-sm leading-relaxed">
                Det enklaste sättet för svenska småföretag att skapa, skicka och följa upp offerter.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Produkt</h4>
              <ul className="space-y-2 text-sm">
                {["Funktioner", "Priser", "Mallar", "ROT/RUT"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Företag</h4>
              <ul className="space-y-2 text-sm">
                {["Om oss", "Blogg", "Karriär", "Press"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                {["Hjälpcenter", "Kontakta oss", "Integritetspolicy", "Användarvillkor"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 Offert-pro. Alla rättigheter förbehållna.</p>
            <div className="flex items-center gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <Link key={social} href="#" className="text-sm hover:text-white transition-colors">
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
