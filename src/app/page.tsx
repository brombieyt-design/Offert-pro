import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Snygga PDF:er",
    description: "Generera imponerande, profilstarka PDF-förslag som imponerar på kunder och speglar din professionalism.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Realtidsspårning",
    description: "Se direkt när kunder öppnar din offert. Få omedelbara notiser och engagemangsstatistik.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: "Återanvändbara mallar",
    description: "Bygg ett bibliotek av dina bästa offerter. Återanvänd och anpassa på sekunder, inte timmar.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    title: "E-signaturer",
    description: "Juridiskt bindande e-signaturer inbyggda direkt. Kunden signerar med ett klick – ingen utskrift eller skanning.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Automatiska påminnelser",
    description: "Låt aldrig en offert bli bortglömd. Automatiserade uppföljningspåminnelser kontaktar kunder vid rätt tidpunkt.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Statuspipeline",
    description: "Visualisera hela din säljpipeline. Följ varje offert från utkast till avslutat avtal med en blick.",
    color: "bg-rose-50 text-rose-600",
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
      "E-signaturer",
      "Automatiska påminnelser",
      "Mallbibliotek",
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
      "White-label PDF:er",
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
      "Zapier-integration",
    ],
    cta: "Kontakta sälj",
    highlighted: false,
  },
];

const testimonials = [
  {
    quote: "Offert-pro minskade vår offertid från 2 timmar till 15 minuter. Vår avslutsfrekvens ökade med 40% under den första månaden.",
    author: "Marcus Thompson",
    role: "Ägare, Blue Ridge Construction",
    avatar: "MT",
    avatarBg: "bg-blue-500",
  },
  {
    quote: "Realtidsspårningen är en riktig game changer. Jag vet exakt när jag ska följa upp och det gör mig så mycket mer effektiv.",
    author: "Priya Sharma",
    role: "Grundare, Pixel Studio",
    avatar: "PS",
    avatarBg: "bg-purple-500",
  },
  {
    quote: "Snygga offerter, extremt enkelt att använda och mina kunder älskar e-signaturupplevelsen. Värt varje krona.",
    author: "James O'Brien",
    role: "Direktör, Evergreen Events Co.",
    avatar: "JO",
    avatarBg: "bg-emerald-500",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hjältesektion */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-emerald-200 rounded-full opacity-20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-6">
              <span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot" />
              Nu med AI-drivna offerttips
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
              Vinn fler affärer med{" "}
              <span className="gradient-text">snygga offerter</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Skapa professionella förslag på minuter. Spåra kundengagemang i realtid,
              samla in e-signaturer och vinn fler affärer – allt på ett ställe.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-0.5"
              >
                Kom igång gratis – inget kort krävs
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Se hur det fungerar
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Gratis för alltid · Inget kreditkort krävs · Kom igång på 2 minuter
            </p>
          </div>

          {/* Appförhandsvisning */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Webbläsarfält */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-500 text-center">
                    app.offert-pro.com/offerter
                  </div>
                </div>
              </div>

              <div className="flex h-80 sm:h-96">
                {/* Sidopanel – förhandsvisning */}
                <div className="w-48 bg-white border-r border-gray-100 flex-col p-3 shrink-0 hidden sm:flex">
                  <div className="flex items-center gap-2 px-2 py-2 mb-4">
                    <div className="w-6 h-6 bg-indigo-600 rounded-md" />
                    <span className="text-sm font-bold text-gray-900">Offert-pro</span>
                  </div>
                  {["Översikt", "Offerter", "Mallar", "Kunder", "Analys"].map((item, i) => (
                    <div key={item} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-0.5 ${i === 1 ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-500"}`}>
                      <div className={`w-3 h-3 rounded-sm ${i === 1 ? "bg-indigo-400" : "bg-gray-200"}`} />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Huvudinnehåll – förhandsvisning */}
                <div className="flex-1 bg-slate-50 p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-bold text-gray-900">Offerter</div>
                      <div className="text-xs text-gray-400">24 offerter totalt</div>
                    </div>
                    <div className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg">+ Ny offert</div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: "Totalt", value: "24", color: "text-gray-900" },
                      { label: "Öppna", value: "8", color: "text-blue-600" },
                      { label: "Accepterade", value: "14", color: "text-emerald-600" },
                      { label: "Värde", value: "42k", color: "text-indigo-600" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-lg p-2 border border-gray-100">
                        <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                    {[
                      { client: "Acme Corp", amount: "4 200 kr", status: "Accepterad", statusColor: "bg-emerald-100 text-emerald-700" },
                      { client: "Pixel Studio", amount: "2 800 kr", status: "Öppnad", statusColor: "bg-amber-100 text-amber-700" },
                      { client: "Summit IT", amount: "8 500 kr", status: "Skickad", statusColor: "bg-blue-100 text-blue-700" },
                      { client: "Nova Consulting", amount: "1 950 kr", status: "Utkast", statusColor: "bg-gray-100 text-gray-600" },
                    ].map((row) => (
                      <div key={row.client} className="flex items-center justify-between px-3 py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-xs flex items-center justify-center font-bold">
                            {row.client[0]}
                          </div>
                          <span className="text-xs font-medium text-gray-700">{row.client}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-900">{row.amount}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${row.statusColor}`}>{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Flytande notisbadgar */}
            <div className="absolute -left-6 top-1/3 hidden lg:block">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Offert accepterad!</p>
                  <p className="text-xs text-gray-500">Acme Corp · 4 200 kr</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 top-1/2 hidden lg:block">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Offert öppnad</p>
                  <p className="text-xs text-gray-500">2 min sedan · 3 visningar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social bevis */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"].map((color, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${color} flex items-center justify-center text-white text-xs font-bold`}>
                    {["A", "B", "C", "D", "E"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-gray-600">
                <span className="font-bold text-gray-900">500+</span> småföretag litar på Offert-pro
              </p>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-200" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm font-medium text-gray-600 ml-1">4,9/5 från 200+ recensioner</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-gray-200" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">24 M+ kr</span> i offerter avslutade denna månad
            </p>
          </div>
        </div>
      </section>

      {/* Funktionssektion */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full text-sm font-medium text-indigo-700 mb-4">
              Allt du behöver
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Vinn fler affärer, snabbare
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Varje funktion är utformad för att hjälpa dig avsluta affärer, bygga kundrelationer och växa din verksamhet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prissektion */}
      <section id="pricing" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-sm font-medium text-emerald-700 mb-4">
              Enkla priser
            </div>
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
                    ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-200 lg:scale-105 border-0"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-400 text-amber-900 text-xs font-bold rounded-full whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-base font-bold mb-1 ${tier.highlighted ? "text-indigo-100" : "text-gray-500"}`}>
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-4xl font-extrabold ${tier.highlighted ? "text-white" : "text-gray-900"}`}>
                      {tier.price}
                    </span>
                    <span className={`text-sm ${tier.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                      {tier.period}
                    </span>
                  </div>
                  <p className={`text-xs ${tier.highlighted ? "text-indigo-200" : "text-gray-500"}`}>
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <svg
                        className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlighted ? "text-emerald-300" : "text-emerald-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={`text-sm ${tier.highlighted ? "text-indigo-100" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`block w-full py-3 px-4 rounded-xl text-sm font-semibold text-center transition-all ${
                    tier.highlighted
                      ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Älskat av småföretagare
            </h2>
            <p className="text-lg text-gray-600">
              Verkliga berättelser från verkliga kunder som växte sin verksamhet med Offert-pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="p-6 rounded-2xl bg-slate-50 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-sm text-gray-700 leading-relaxed mb-5 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${testimonial.avatarBg} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA-sektion */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Redo att vinna fler affärer?
          </h2>
          <p className="text-lg text-indigo-200 mb-8 max-w-xl mx-auto">
            Gå med 500+ småföretag som redan använder Offert-pro för att vinna fler kunder och spara tid.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded-2xl transition-all shadow-lg"
            >
              Börja gratis idag
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-indigo-200 hover:text-white border border-indigo-400 rounded-2xl transition-colors"
            >
              Se priser
            </Link>
          </div>
          <p className="mt-4 text-sm text-indigo-300">Inget kreditkort krävs · Gratis plan för alltid</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-base font-bold text-white">Offert-pro</span>
              </div>
              <p className="text-sm leading-relaxed">
                Det enklaste sättet för småföretag att skapa, skicka och spåra snygga förslag.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Produkt</h4>
              <ul className="space-y-2 text-sm">
                {["Funktioner", "Priser", "Mallar", "Integrationer"].map((item) => (
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
            <p className="text-sm">© 2026 Offert-pro, Inc. Alla rättigheter förbehållna.</p>
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
