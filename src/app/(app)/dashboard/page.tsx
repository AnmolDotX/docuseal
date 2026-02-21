import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_TYPE_SLUGS,
  formatDate,
} from "@/lib/utils";
import { PLAN_LIMITS, PLAN_PRICES } from "@/lib/plans";
import { FileText, Plus, ArrowRight, LogOut, Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const TOOL_LINKS = [
  { slug: "privacy-policy", label: "Privacy Policy", icon: "🔒" },
  { slug: "terms-of-service", label: "Terms of Service", icon: "📋" },
  { slug: "nda", label: "NDA", icon: "🤝" },
  { slug: "client-contract", label: "Client Contract", icon: "📝" },
  { slug: "freelancer-agreement", label: "Freelancer Agreement", icon: "💼" },
  { slug: "cookie-policy", label: "Cookie Policy", icon: "🍪" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [subscription, documents] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    prisma.document.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const plan = subscription?.plan ?? "FREE";
  const limits = PLAN_LIMITS[plan];

  // Count docs this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const usedThisMonth = documents.filter(
    (d) => d.createdAt >= monthStart,
  ).length;
  const limitDisplay = limits.docsPerMonth === -1 ? "∞" : limits.docsPerMonth;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-border flex flex-col z-40">
        <div className="p-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md gradient-primary flex items-center justify-center text-white font-bold text-xs">
              D
            </div>
            <span className="font-bold text-sm">DocuSeal</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 text-sm font-medium text-foreground bg-muted rounded-lg px-3 py-2"
          >
            <FileText className="w-4 h-4" /> Dashboard
          </Link>
          <Link
            href="/documents"
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-2 transition-colors"
          >
            <FileText className="w-4 h-4" /> All Documents
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg px-3 py-2 transition-colors"
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav>

        {/* Plan badge */}
        <div className="p-4 border-t border-border">
          <div className="bg-muted rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-foreground">
                {plan} Plan
              </span>
              <span className="text-xs text-muted-foreground">
                {usedThisMonth}/{limitDisplay} docs
              </span>
            </div>
            {limits.docsPerMonth !== -1 && (
              <div className="w-full bg-border rounded-full h-1.5">
                <div
                  className="gradient-primary h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (usedThisMonth / limits.docsPerMonth) * 100)}%`,
                  }}
                />
              </div>
            )}
            {plan === "FREE" && (
              <Link
                href="/settings/billing"
                className="mt-2 text-xs text-primary font-medium hover:underline block"
              >
                Upgrade for more →
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full gradient-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
              {session.user.name?.[0] ?? session.user.email?.[0] ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {session.user.name ?? "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="pl-60 p-8">
        <div className="max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Good{" "}
              {new Date().getHours() < 12
                ? "morning"
                : new Date().getHours() < 17
                  ? "afternoon"
                  : "evening"}
              , {session.user.name?.split(" ")[0] ?? "there"} 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              Generate a new legal document or continue editing an existing one.
            </p>
          </div>

          {/* Usage alert when near limit */}
          {plan === "FREE" && usedThisMonth >= 2 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {usedThisMonth >= limits.docsPerMonth
                    ? "You've reached your free limit for this month."
                    : `You've used ${usedThisMonth} of ${limits.docsPerMonth} free documents this month.`}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  Upgrade to Starter for 20 docs/mo at ₹{PLAN_PRICES.STARTER.monthly}/mo.
                </p>
              </div>
              <Link
                href="/settings/billing"
                className="text-xs font-semibold text-amber-800 dark:text-amber-200 whitespace-nowrap hover:underline flex items-center gap-1"
              >
                Upgrade <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Quick generate grid */}
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Generate New Document
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TOOL_LINKS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {tool.label}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Plus className="w-3 h-3" /> Generate free
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent documents */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Recent Documents
              </h2>
              <Link
                href="/documents"
                className="text-xs text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            {documents.length === 0 ? (
              <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center">
                <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-4">
                  No documents yet. Generate your first one!
                </p>
                <Link
                  href="/tools/privacy-policy"
                  className="inline-flex items-center gap-1.5 gradient-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Generate Privacy Policy
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/documents/${doc.id}`}
                    className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-4 hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {doc.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {DOCUMENT_TYPE_LABELS[doc.type]} ·{" "}
                          {formatDate(doc.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${doc.status === "FINAL" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}
                      >
                        {doc.status === "FINAL" ? "Final" : "Draft"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
