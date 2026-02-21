"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { PLAN_PRICES } from "@/lib/plans";

// Hardcoded exchange rate for estimate display (1 USD = ~83 INR)
const USD_RATE = 83;

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  const getPrice = (planPrices: { monthly: number; yearly: number }) => {
    const inrAmount = isYearly ? planPrices.yearly : planPrices.monthly;
    if (currency === "INR") return `₹${inrAmount}`;
    return `$${Math.round(inrAmount / USD_RATE)}`;
  };

  const PRICING = [
    {
      name: "Free",
      priceDisplay: currency === "INR" ? "₹0" : "$0",
      description: "For individuals just getting started",
      features: [
        "3 documents per month",
        "3 document types (Privacy Policy, ToS, NDA)",
        "Watermarked PDF download",
        "Copy to clipboard",
      ],
      cta: "Get Started Free",
      href: "/signup",
      highlighted: false,
    },
    {
      name: "Starter",
      priceDisplay: getPrice(PLAN_PRICES.STARTER),
      description: "For freelancers and small businesses",
      features: [
        "20 documents per month",
        "All 8 document types",
        "AI-powered generation",
        "Clean PDF (no watermark)",
        "Custom company branding",
        "Shareable document links",
      ],
      cta: "Start 14-day Free Trial",
      href: "/signup?plan=starter",
      highlighted: true,
    },
    {
      name: "Pro",
      priceDisplay: getPrice(PLAN_PRICES.PRO),
      description: "For growing teams and agencies",
      features: [
        "Unlimited documents",
        "All 8 document types",
        "AI-powered generation",
        "Clean PDF (no watermark)",
        "Custom branding + 3 team seats",
        "Shareable links + e-signature",
      ],
      cta: "Start 14-day Free Trial",
      href: "/signup?plan=pro",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground mb-8">
            Start free. Upgrade when you need more.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Currency Toggle */}
            <div className="flex items-center p-1 bg-muted rounded-xl border border-border">
              <button
                onClick={() => setCurrency("INR")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  currency === "INR"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  currency === "USD"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="flex items-center p-1 bg-muted rounded-xl border border-border">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  !isYearly
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                  isYearly
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Save 25%
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 border ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10 bg-card"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-xl text-foreground mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {plan.description}
              </p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">
                  {plan.priceDisplay}
                </span>
                {plan.priceDisplay !== "₹0" && plan.priceDisplay !== "$0" && (
                  <span className="text-muted-foreground text-sm">
                    /month {isYearly && <span className="text-xs"> (billed annually)</span>}
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`block w-full text-center font-semibold py-3 rounded-xl transition-all ${
                  plan.highlighted
                    ? "gradient-primary text-white hover:opacity-90"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10 max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground mb-2">
            All paid plans include a 14-day free trial · No credit card required · Cancel anytime
          </p>
          <div className="bg-muted/50 rounded-lg p-4 text-xs text-muted-foreground text-left flex items-start gap-3 border border-border mt-6">
            <span className="text-xl">🌍</span>
            <p>
              <strong>International Payments:</strong> We process all global payments securely via Razorpay.
              Your card will automatically convert the final INR (₹) amount into your local currency at the current exchange rate during checkout. 
              The USD ($) prices shown above are estimates for your convenience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
