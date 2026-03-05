import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try Offert-pro with no strings attached",
    features: [
      "5 quotes per month",
      "1 user",
      "Basic PDF export",
      "Email delivery",
      "7-day quote expiry",
      "Basic templates",
      "Community support",
    ],
    notIncluded: [
      "Custom branding",
      "Real-time tracking",
      "E-signatures",
      "Auto reminders",
      "Analytics",
    ],
    cta: "Get started free",
    ctaHref: "/dashboard",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$19",
    period: "/month",
    description: "For freelancers and solopreneurs ready to scale",
    features: [
      "25 quotes per month",
      "1 user",
      "Custom branding & logo",
      "Real-time open tracking",
      "E-signatures",
      "Auto follow-up reminders",
      "Templates library (20+)",
      "Email support (48h)",
    ],
    notIncluded: [
      "Advanced analytics",
      "Custom domain",
      "API access",
      "CRM integrations",
    ],
    cta: "Start 14-day free trial",
    ctaHref: "/dashboard",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams that want every edge",
    features: [
      "Unlimited quotes",
      "3 users",
      "Custom domain",
      "Advanced analytics dashboard",
      "Priority support (4h)",
      "API access",
      "CRM integrations (HubSpot, Salesforce)",
      "White-label PDFs",
      "Custom quote expiry",
      "Client portal",
    ],
    notIncluded: [],
    cta: "Start 14-day free trial",
    ctaHref: "/dashboard",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: "$99",
    period: "/month",
    description: "For agencies and teams that need enterprise features",
    features: [
      "Unlimited quotes",
      "10 users",
      "Everything in Pro",
      "Team collaboration",
      "Role-based permissions",
      "Custom approval workflows",
      "Dedicated account manager",
      "SSO / SAML login",
      "Advanced reporting & exports",
      "Zapier + Make integration",
      "SLA guarantee",
    ],
    notIncluded: [],
    cta: "Contact sales",
    ctaHref: "#contact",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "Can I change plans at any time?",
    answer: "Yes, absolutely. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately and you'll be prorated for the remaining billing period. Downgrades take effect at the next billing cycle.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All paid plans come with a 14-day free trial, no credit card required. You get full access to all features in your chosen plan during the trial.",
  },
  {
    question: "What counts as a 'quote'?",
    answer: "A quote is any proposal document you create and save. Drafts count toward your monthly limit, but deleted quotes do not. Unused quotes do not carry over to the next month.",
  },
  {
    question: "Are e-signatures legally binding?",
    answer: "Yes. Our e-signature feature complies with the ESIGN Act (USA), eIDAS (EU), and similar regulations worldwide. Each signed document includes an audit trail with timestamps and IP addresses.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! Switch to annual billing and save 20% on any paid plan. Annual plans are billed upfront for the full year.",
  },
  {
    question: "What integrations are available?",
    answer: "Offert-pro integrates with HubSpot, Salesforce, QuickBooks, Xero, Slack, Gmail, and more. Pro and Business plans also get Zapier and Make (Integromat) access for custom automations.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use AES-256 encryption at rest and TLS 1.3 in transit. Our infrastructure is hosted on AWS with SOC 2 Type II compliance. We never share your data with third parties.",
  },
  {
    question: "Can I white-label quotes for my clients?",
    answer: "Pro and Business plans support full white-labeling — your logo, brand colors, custom domain, and no Offert-pro branding visible to your clients.",
  },
];

const compareFeatures = [
  { feature: "Quotes per month", free: "5", starter: "25", pro: "Unlimited", business: "Unlimited" },
  { feature: "Users", free: "1", starter: "1", pro: "3", business: "10" },
  { feature: "Custom branding", free: false, starter: true, pro: true, business: true },
  { feature: "PDF export", free: "Basic", starter: "Branded", pro: "White-label", business: "White-label" },
  { feature: "Real-time tracking", free: false, starter: true, pro: true, business: true },
  { feature: "E-signatures", free: false, starter: true, pro: true, business: true },
  { feature: "Auto reminders", free: false, starter: true, pro: true, business: true },
  { feature: "Analytics", free: false, starter: "Basic", pro: "Advanced", business: "Advanced" },
  { feature: "Custom domain", free: false, starter: false, pro: true, business: true },
  { feature: "API access", free: false, starter: false, pro: true, business: true },
  { feature: "CRM integrations", free: false, starter: false, pro: true, business: true },
  { feature: "SSO / SAML", free: false, starter: false, pro: false, business: true },
  { feature: "Dedicated support", free: false, starter: false, pro: false, business: true },
  { feature: "Support", free: "Community", starter: "Email (48h)", pro: "Priority (4h)", business: "Dedicated" },
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

      {/* Hero */}
      <section className="pt-24 pb-16 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-6">
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Start free. Scale as you grow.
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            No hidden fees, no annual lock-in, no surprises. Pick the plan that fits today — upgrade when you&apos;re ready.
          </p>

          {/* Billing toggle (decorative) */}
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
            <span className="text-sm font-semibold text-gray-700">Monthly</span>
            <div className="relative w-12 h-6 bg-indigo-600 rounded-full cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
            <span className="text-sm font-semibold text-indigo-600">
              Annual
              <span className="ml-1.5 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 rounded-full font-semibold">Save 20%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing cards */}
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
            All plans include a 14-day free trial on paid tiers. No credit card required.
          </p>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Compare all features
            </h2>
            <p className="text-gray-500">A detailed look at what&apos;s included in each plan.</p>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="min-w-[560px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-5 border-b border-gray-100 bg-gray-50/50">
              <div className="col-span-1 px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Feature
              </div>
              {["Free", "Starter", "Pro", "Business"].map((plan) => (
                <div key={plan} className="px-4 py-4 text-center">
                  <span className={`text-sm font-bold ${plan === "Pro" ? "text-indigo-600" : "text-gray-900"}`}>
                    {plan}
                  </span>
                  {plan === "Pro" && (
                    <span className="block text-xs text-indigo-400 font-medium">Most Popular</span>
                  )}
                </div>
              ))}
            </div>

            {/* Table rows */}
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

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Frequently asked questions
            </h2>
            <p className="text-gray-500">
              Can&apos;t find your answer?{" "}
              <a href="mailto:hello@offert-pro.com" className="text-indigo-600 hover:underline">
                Email us
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

      {/* Testimonials strip */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Switched from a $150/month tool to Offert-pro Pro for $49. Better features, better results.",
                author: "Marcus T.",
                role: "Blue Ridge Construction",
                avatar: "MT",
                bg: "bg-blue-500",
              },
              {
                quote: "The free plan got me started. Upgraded to Starter the same week — totally worth it.",
                author: "Priya S.",
                role: "Pixel Studio",
                avatar: "PS",
                bg: "bg-purple-500",
              },
              {
                quote: "Business plan for my agency was a no-brainer. My whole team uses it daily.",
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
            Ready to get started?
          </h2>
          <p className="text-lg text-indigo-200 mb-8 max-w-xl mx-auto">
            Join 500+ businesses closing more deals with beautiful proposals. Start free today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-indigo-700 bg-white hover:bg-indigo-50 rounded-2xl transition-all shadow-lg"
            >
              Start for free — no card needed
            </Link>
            <a
              href="mailto:hello@offert-pro.com"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-indigo-200 hover:text-white border border-indigo-400 rounded-2xl transition-colors"
            >
              Talk to sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <p className="text-sm">© 2026 Offert-pro, Inc. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
