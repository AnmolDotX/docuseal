"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export function PlanManager({
  isFree,
  subscriptionId,
  cancelAtPeriodEnd,
  status,
}: {
  isFree: boolean;
  subscriptionId: string | null;
  cancelAtPeriodEnd: boolean;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    if (
      !confirm(
        "Are you sure you want to cancel your plan? You will retain access until the end of your billing cycle."
      )
    )
      return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/billing/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelAtPeriodEnd: true }),
      });

      if (!res.ok) throw new Error("Failed to cancel subscription");
      router.refresh();
    } catch (err) {
      setError("Failed to cancel subscription. Please try again or contact support.");
    } finally {
      setLoading(false);
    }
  }

  if (isFree || status !== "ACTIVE") {
    return (
      <div className="pt-2 border-t border-border mt-6">
        <a
          href="#pricing"
          className="w-full inline-flex items-center justify-center gap-1.5 gradient-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          View Upgrade Options
        </a>
      </div>
    );
  }

  return (
    <div className="pt-2 border-t border-border mt-6">
      {error && (
        <div className="flex items-start gap-2 text-destructive text-sm mb-4 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {cancelAtPeriodEnd ? (
        <div className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          Your plan is set to cancel at the end of the current billing cycle.
        </div>
      ) : (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-1.5 text-destructive bg-destructive/10 hover:bg-destructive/20 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Cancel Subscription
        </button>
      )}
    </div>
  );
}
