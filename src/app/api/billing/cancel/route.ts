import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

// Cancel a subscription (replaces Stripe billing portal cancel)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cancelAtPeriodEnd = true } = await req.json();

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription?.razorpaySubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    if (cancelAtPeriodEnd) {
      // Cancel at end of billing period (user keeps access until period ends)
      await razorpay.subscriptions.cancel(
        subscription.razorpaySubscriptionId,
        true // cancel_at_cycle_end = true
      );
      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: { cancelAtPeriodEnd: true },
      });
      return NextResponse.json({
        message: "Subscription will be cancelled at end of billing period.",
      });
    } else {
      // Immediate cancellation
      await razorpay.subscriptions.cancel(
        subscription.razorpaySubscriptionId,
        false
      );
      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
          plan: "FREE",
          status: "CANCELED",
          canceledAt: new Date(),
          razorpaySubscriptionId: null,
          razorpayPlanId: null,
        },
      });
      return NextResponse.json({
        message: "Subscription cancelled immediately.",
      });
    }
  } catch (error) {
    console.error("[CANCEL_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}

// Reactivate a subscription that was set to cancel at period end
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.subscription.update({
      where: { userId: session.user.id },
      data: { cancelAtPeriodEnd: false },
    });

    return NextResponse.json({ message: "Cancellation reversed." });
  } catch (error) {
    console.error("[REACTIVATE_ERROR]", error);
    return NextResponse.json({ error: "Failed to reactivate" }, { status: 500 });
  }
}
