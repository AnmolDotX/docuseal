import { NextResponse } from "next/server";

// Stripe billing portal has been replaced by Razorpay.
// Subscription management is handled at /settings/billing via the cancel API.
export async function POST() {
  return NextResponse.json(
    { error: "Use /api/billing/cancel to manage your subscription." },
    { status: 410 }
  );
}
