import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { createUser, updateUser, deleteUser } from "@/lib/db/queries"
import { env } from "@/lib/env"

export async function POST(req: Request) {
  // Get webhook secret from environment
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET is not set")
  }

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If missing headers, error
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create Svix instance
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Invalid signature", { status: 400 })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    await createUser({
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim() || undefined,
      imageUrl: image_url || undefined,
    })
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    await updateUser(id, {
      email: email_addresses[0].email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim() || undefined,
      imageUrl: image_url || undefined,
    })
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data

    if (id) {
      await deleteUser(id)
    }
  }

  return new Response("Webhook processed", { status: 200 })
}

// - Verify Svix signature
// - Handle user.created, user.updated, user.deleted
// - Sync to database
