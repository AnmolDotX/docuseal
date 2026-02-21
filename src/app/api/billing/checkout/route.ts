import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { razorpay, RAZORPAY_PLAN_IDS } from "@/lib/razorpay";
import type { PlanName, BillingInterval } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, interval = "MONTHLY" } = await req.json() as {
      plan: PlanName;
      interval: BillingInterval;
    };

    const planIds = RAZORPAY_PLAN_IDS[plan];
    if (!planIds) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const planId = planIds[interval];

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for existing active Razorpay subscription
    const existingSub = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (
      existingSub?.razorpaySubscriptionId &&
      existingSub.status === "ACTIVE"
    ) {
      return NextResponse.json(
        { error: "Already on an active plan. Manage it from billing settings." },
        { status: 409 }
      );
    }

    // Create Razorpay subscription
    // total_count: 0 = infinite (recurring until cancelled)
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: interval === "YEARLY" ? 12 : 120, // 12 yearly or 10 years monthly
      quantity: 1,
      customer_notify: 1, // Razorpay emails the customer too
      addons: [],
      notes: {
        userId: session.user.id,
        userEmail: user.email,
        plan,
        interval,
      },
    });

    // Return key + subscription ID to the frontend — the frontend opens Razorpay modal
    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      name: user.name ?? user.email,
      email: user.email,
      plan,
      interval,
    });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
