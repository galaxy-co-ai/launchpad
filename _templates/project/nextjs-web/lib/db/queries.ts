import { eq } from "drizzle-orm"
import { db } from "."
import { users, posts } from "./schema"

// User queries
export async function getUserByClerkId(clerkId: string) {
  return db.query.users.findFirst({
    where: eq(users.clerkId, clerkId),
  })
}

export async function createUser(data: {
  clerkId: string
  email: string
  name?: string
  imageUrl?: string
}) {
  const [user] = await db.insert(users).values(data).returning()
  return user
}

export async function updateUser(
  clerkId: string,
  data: Partial<{
    email: string
    name: string
    imageUrl: string
    stripeCustomerId: string
    stripeSubscriptionId: string
    stripePriceId: string
    stripeCurrentPeriodEnd: Date
  }>
) {
  const [user] = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning()
  return user
}

export async function deleteUser(clerkId: string) {
  await db.delete(users).where(eq(users.clerkId, clerkId))
}

// Post queries (example - delete if not needed)
export async function getPostsByUserId(userId: string) {
  return db.query.posts.findMany({
    where: eq(posts.userId, userId),
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  })
}

export async function createPost(data: {
  userId: string
  title: string
  content?: string
  published?: boolean
}) {
  const [post] = await db.insert(posts).values(data).returning()
  return post
}

// - getUserByClerkId
// - createUser
// - updateUser
// - deleteUser
// - getSubscription
// - updateSubscription
