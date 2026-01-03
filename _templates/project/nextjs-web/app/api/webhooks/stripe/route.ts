import { headers } from "next/headers"
import Stripe from "stripe"
import { env } from "@/lib/env"
import { updateUser } from "@/lib/db/queries"

const stripe = new Stripe(env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature")

  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response("Missing signature or webhook secret", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const clerkId = session.metadata?.clerkId

      if (!clerkId) {
        return new Response("Missing clerkId in metadata", { status: 400 })
      }

      // Update user with subscription details
      await updateUser(clerkId, {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
      })

      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      const clerkId = subscription.metadata?.clerkId

      if (!clerkId) {
        return new Response("Missing clerkId in metadata", { status: 400 })
      }

      await updateUser(clerkId, {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })

      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const clerkId = subscription.metadata?.clerkId

      if (!clerkId) {
        return new Response("Missing clerkId in metadata", { status: 400 })
      }

      // Clear subscription details
      await updateUser(clerkId, {
        stripeSubscriptionId: undefined,
        stripePriceId: undefined,
        stripeCurrentPeriodEnd: undefined,
      })

      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return new Response("Webhook processed", { status: 200 })
}

// - Verify Stripe signature
// - Handle checkout.session.completed
// - Handle subscription events
// - Update user subscription status
