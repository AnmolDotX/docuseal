import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PlanManager } from "./PlanManager";
import { PLAN_LIMITS } from "@/lib/plans";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";
import { Shield } from "lucide-react";
import { PricingSection } from "@/components/PricingSection";

export const metadata: Metadata = {
  title: "Billing & Plans | DocuSeal",
};

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) return redirect("/login");

  // Fetch subscription, usage, and payments
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const currentUsage = await prisma.document.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: startOfMonth },
    },
  });

  const isFree = !subscription || subscription.plan === "FREE";
  const limit = PLAN_LIMITS[subscription?.plan ?? "FREE"].docsPerMonth;

  return (
    <div className="min-h-screen bg-background pl-60">
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Billing & Plans
            </h1>
            <p className="text-muted-foreground">
              Manage your subscription, usage, and payment methods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Current Plan
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground capitalize">
                    {subscription?.plan.toLowerCase() || "Free"} Plan
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {subscription?.status === "ACTIVE"
                      ? "Active Subscription"
                      : "Free Tier"}
                  </p>
                </div>
              </div>

              {subscription?.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground mb-6">
                  {subscription.cancelAtPeriodEnd
                    ? "Cancels on"
                    : "Renews on"}{" "}
                  <span className="font-medium text-foreground">
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </p>
              )}

              <PlanManager
                isFree={isFree}
                subscriptionId={subscription?.razorpaySubscriptionId || null}
                cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd || false}
                status={subscription?.status || "CANCELED"}
              />
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Usage This Month
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Documents Generated
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {currentUsage} / {limit === Infinity ? "∞" : limit}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${
                          limit === Infinity
                            ? 100
                            : Math.min((currentUsage / limit) * 100, 100)
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(isFree || subscription?.status !== "ACTIVE") && (
          <div id="pricing" className="mt-16 pt-8 -mx-4 sm:-mx-8 border-t border-border">
            <PricingSection isLoggedIn={true} />
          </div>
        )}
      </main>
    </div>
  );
}
