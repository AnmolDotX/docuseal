"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface RazorpayButtonProps {
  plan: "STARTER" | "PRO" | "BUSINESS";
  interval?: "MONTHLY" | "YEARLY";
  label?: string;
  className?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayButton({
  plan,
  interval = "MONTHLY",
  label,
  className,
}: RazorpayButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    setLoading(true);

    try {
      // 1. Load Razorpay checkout script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setError("Failed to load payment gateway. Check your internet connection.");
        setLoading(false);
        return;
      }

      // 2. Create subscription on the server
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not start checkout.");
        setLoading(false);
        return;
      }

      // 3. Open Razorpay modal
      const rzp = new window.Razorpay({
        key: data.keyId,                       // RAZORPAY_KEY_ID
        subscription_id: data.subscriptionId , // created server-side
        name: "DocuSeal",
        description: `${plan} Plan — ${interval === "MONTHLY" ? "Monthly" : "Yearly"}`,
        image: "/logo.png",
        prefill: {
          name: data.name,
          email: data.email,
        },
        theme: { color: "#7c3aed" }, // matches DocuSeal purple
        modal: {
          confirm_close: true,
          ondismiss() {
            setLoading(false);
          },
        },
        handler(response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) {
          // Payment captured — webhook will activate the subscription
          // Redirect user to a thank-you / dashboard page
          console.log("[RAZORPAY] Payment success", response.razorpay_payment_id);
          router.push("/dashboard?upgraded=true");
        },
      });

      rzp.on("payment.failed", (resp: { error: { description: string } }) => {
        setError(resp.error?.description ?? "Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("[RAZORPAY_BUTTON]", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={loading}
        className={
          className ??
          "w-full gradient-primary text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        }
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Opening payment…
          </>
        ) : (
          label ?? `Start ${plan.charAt(0) + plan.slice(1).toLowerCase()} Plan`
        )}
      </button>
      {error && <p className="text-xs text-destructive mt-2 text-center">{error}</p>}
    </div>
  );
}
