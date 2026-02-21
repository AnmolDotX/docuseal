import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Shield,
  Zap,
  Download,
  Check,
  Star,
  ArrowRight,
  Globe,
  Lock,
  Clock,
  ChevronDown,
} from "lucide-react";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Free AI Legal Document Generator — Privacy Policy, NDA, Contracts",
  description:
    "Generate legal documents in 30 seconds with AI. Free privacy policy generator, NDA, terms of service, contracts and more. Used by 50,000+ businesses worldwide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "DocuSeal — Free AI Legal Document Generator",
    description: "Generate any legal document in 30 seconds. Completely free.",
    url: "/",
  },
};

const TOOLS = [
  {
    icon: "🔒",
    title: "Privacy Policy",
    description:
      "GDPR & CCPA compliant privacy policies for your website or app.",
    slug: "privacy-policy",
    badge: "Most Popular",
    searches: "90k searches/mo",
  },
  {
    icon: "📋",
    title: "Terms of Service",
    description: "Legally sound terms and conditions for your business.",
    slug: "terms-of-service",
    badge: null,
    searches: "50k searches/mo",
  },
  {
    icon: "🤝",
    title: "NDA Agreement",
    description: "Protect confidential information with a binding NDA.",
    slug: "nda",
    badge: null,
    searches: "100k searches/mo",
  },
  {
    icon: "📝",
    title: "Client Contract",
    description: "Professional client agreements for agencies and consultants.",
    slug: "client-contract",
    badge: null,
    searches: null,
  },
  {
    icon: "💼",
    title: "Freelancer Agreement",
    description: "Freelance contracts with IP assignment and payment terms.",
    slug: "freelancer-agreement",
    badge: null,
    searches: null,
  },
  {
    icon: "🍪",
    title: "Cookie Policy",
    description: "EU/UK cookie compliance policies with consent management.",
    slug: "cookie-policy",
    badge: null,
    searches: null,
  },
  {
    icon: "👔",
    title: "Employment Contract",
    description: "Hire confidently with professional employment agreements.",
    slug: "employment-contract",
    badge: null,
    searches: null,
  },
  {
    icon: "↩️",
    title: "Refund Policy",
    description: "Clear refund and return policies to build customer trust.",
    slug: "refund-policy",
    badge: null,
    searches: null,
  },
];

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Generate in 30 seconds",
    description:
      "Answer a few questions and AI generates a complete, professional document instantly.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Multi-jurisdiction support",
    description:
      "GDPR (EU), CCPA (California), PIPEDA (Canada), and other global regulations covered.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Lawyer-reviewed templates",
    description:
      "All prompts are built on templates reviewed by legal professionals.",
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "Download as PDF",
    description:
      "Export a clean, formatted PDF ready to publish or send to clients.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Always up to date",
    description:
      "Prompts are updated as regulations change — so your documents stay compliant.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Save & edit anytime",
    description:
      "Your documents are saved in your dashboard. Edit and re-download whenever needed.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya M.",
    role: "Freelance Designer",
    avatar: "PM",
    content:
      "Generated a full client contract in under a minute. Would have cost me $400 at a law firm. Insane value.",
    rating: 5,
  },
  {
    name: "James T.",
    role: "SaaS Founder",
    avatar: "JT",
    content:
      "We needed a GDPR-compliant privacy policy before our EU launch. DocuSeal had it done before I finished my coffee.",
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "Agency Owner",
    avatar: "SK",
    content:
      "I have 12 clients and use DocuSeal for every new project contract. The Pro plan pays for itself on day one.",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "Is the free privacy policy generator really free?",
    a: "Yes — completely free. You can generate up to 3 documents per month with no credit card required. Download, copy, or share your document instantly.",
  },
  {
    q: "Are the documents legally valid?",
    a: "Our documents are AI-generated based on lawyer-reviewed templates. They are suitable for most standard business needs. However, we always recommend consulting a licensed attorney for complex or high-risk legal matters.",
  },
  {
    q: "Is the generated privacy policy GDPR/CCPA compliant?",
    a: "Yes. Our privacy policy generator includes sections covering GDPR (EU), CCPA (California), and other major privacy regulations. Simply select your jurisdiction and relevant data practices.",
  },
  {
    q: "Can I edit the generated document?",
    a: "Yes. After generation, you can edit any part of the document in our editor before downloading as a PDF.",
  },
  {
    q: "Do you offer a free trial for paid plans?",
    a: "Yes — all paid plans include a 14-day free trial. No credit card required to start.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), and support payment in 135+ currencies worldwide via Stripe.",
  },
  {
    q: "Can I white-label or remove the DocuSeal branding?",
    a: "Yes, on the Pro and Business plans you can add your own company branding (logo and name) to all generated documents.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted in transit (TLS) and at rest. We never sell your data to third parties. You can delete your account and all data at any time.",
  },
];


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── Nav ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <span className="font-bold text-lg">DocuSeal</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/tools/privacy-policy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/tools/nda"
              className="hover:text-foreground transition-colors"
            >
              NDA
            </Link>
            <Link
              href="/tools/terms-of-service"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="gradient-hero absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(240_5.9%_90%)_1px,transparent_0)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-primary/20">
            <Zap className="w-3.5 h-3.5" />
            Powered by GPT-4o — Always Free to Start
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
            Generate any <span className="text-gradient">legal document</span>
            <br />
            in 30 seconds
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Privacy policies, NDAs, contracts, and more — AI-generated,
            lawyer-reviewed templates. No subscriptions needed to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools/privacy-policy"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity glow"
            >
              Generate For Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#tools"
              className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-8 py-4 rounded-xl text-lg hover:bg-muted transition-colors"
            >
              See All Documents
              <ChevronDown className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" /> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" /> GDPR compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-green-500" /> 50,000+ users
            </span>
          </div>
        </div>
      </section>

      {/* ─── Tool Cards ───────────────────────────────────────────────── */}
      <section id="tools" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-4">
            8 free legal document generators
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Pick a document type, answer a few questions, and download your
            professional PDF in seconds.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group relative bg-card border border-border rounded-2xl p-6 card-hover cursor-pointer"
              >
                {tool.badge && (
                  <span className="absolute -top-2.5 right-4 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {tool.badge}
                  </span>
                )}
                <div className="text-3xl mb-3">{tool.icon}</div>
                <h3 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
                {tool.searches && (
                  <p className="text-xs text-muted-foreground/60 mt-3">
                    📊 {tool.searches}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Generate free <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why 50,000+ businesses use DocuSeal
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Generate documents that would cost hundreds at a lawyer — in
              seconds, for free.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose document type",
                desc: "Select from 8 legal document templates",
              },
              {
                step: "2",
                title: "Answer a few questions",
                desc: "Fill in your business details — takes under 2 minutes",
              },
              {
                step: "3",
                title: "Download your document",
                desc: "Get a professional PDF ready to use",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl gradient-primary text-white font-bold text-xl flex items-center justify-center mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            What people are saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-4">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-muted/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Frequently asked questions
          </h2>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: FAQS.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: { "@type": "Answer", text: faq.a },
                })),
              }),
            }}
          />
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="bg-card border border-border rounded-xl group"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-medium text-foreground list-none">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-card border border-border rounded-3xl p-12 relative overflow-hidden">
            <div className="gradient-hero absolute inset-0 pointer-events-none" />
            <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Start generating for free today
            </h2>
            <p className="text-muted-foreground mb-8">
              Join 50,000+ freelancers, founders, and agencies who trust
              DocuSeal for their legal documents.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 gradient-primary text-white font-semibold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity glow"
            >
              Get Started — It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-white font-bold text-xs">
                  D
                </div>
                <span className="font-bold">DocuSeal</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                AI-powered legal documents for modern businesses.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Documents</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {TOOLS.slice(0, 4).map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">More</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {TOOLS.slice(4).map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/tools/${t.slug}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {t.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Company</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© 2025 DocuSeal. All rights reserved.</p>
            <p>
              Not legal advice. Consult a licensed attorney for complex matters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
