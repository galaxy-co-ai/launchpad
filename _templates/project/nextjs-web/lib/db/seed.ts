/**
 * Database Seed Script
 *
 * Populates the database with test users and subscriptions.
 * Run with: pnpm db:seed
 *
 * This script is idempotent - safe to run multiple times.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, subscriptions } from "./schema";

// Test user IDs (Clerk format)
const TEST_USERS = {
  admin: {
    clerkId: "user_test_admin_2xK9mN3pQ7rS",
    email: "admin@test.local",
    name: "Test Admin",
  },
  proPlan: {
    clerkId: "user_test_pro_4wL8nP2qR6sT",
    email: "pro@test.local",
    name: "Pro User",
  },
  freePlan: {
    clerkId: "user_test_free_7yM5oK8tU3vW",
    email: "free@test.local",
    name: "Free User",
  },
};

// Generate dates relative to now
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Seeding database...\n");

  // Clear existing data (for idempotency)
  console.log("Clearing existing data...");
  await db.delete(subscriptions);
  await db.delete(users);

  // Seed users
  console.log("Seeding users...");
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        clerkId: TEST_USERS.admin.clerkId,
        email: TEST_USERS.admin.email,
        name: TEST_USERS.admin.name,
        avatarUrl: null,
      },
      {
        clerkId: TEST_USERS.proPlan.clerkId,
        email: TEST_USERS.proPlan.email,
        name: TEST_USERS.proPlan.name,
        avatarUrl: null,
      },
      {
        clerkId: TEST_USERS.freePlan.clerkId,
        email: TEST_USERS.freePlan.email,
        name: TEST_USERS.freePlan.name,
        avatarUrl: null,
      },
    ])
    .returning();

  console.log(`  Inserted ${insertedUsers.length} users`);

  // Create a map of clerkId to user id
  const userIdMap = new Map(insertedUsers.map((u) => [u.clerkId, u.id]));

  // Seed subscriptions
  console.log("Seeding subscriptions...");
  const subscriptionsData = [
    // Admin - Enterprise, active
    {
      userId: userIdMap.get(TEST_USERS.admin.clerkId)!,
      stripeCustomerId: "cus_test_admin_enterprise",
      stripeSubscriptionId: "sub_test_admin_enterprise",
      status: "active",
      plan: "enterprise",
      currentPeriodEnd: daysFromNow(25),
      cancelAtPeriodEnd: false,
    },
    // Pro user - Pro plan, active
    {
      userId: userIdMap.get(TEST_USERS.proPlan.clerkId)!,
      stripeCustomerId: "cus_test_pro_user",
      stripeSubscriptionId: "sub_test_pro_monthly",
      status: "active",
      plan: "pro",
      currentPeriodEnd: daysFromNow(12),
      cancelAtPeriodEnd: false,
    },
    // Free user - Free plan (trialing pro)
    {
      userId: userIdMap.get(TEST_USERS.freePlan.clerkId)!,
      stripeCustomerId: "cus_test_free_user",
      stripeSubscriptionId: "sub_test_free_trial",
      status: "trialing",
      plan: "pro",
      currentPeriodEnd: daysFromNow(7), // 7 days left in trial
      cancelAtPeriodEnd: true, // Will cancel after trial
    },
  ];

  await db.insert(subscriptions).values(subscriptionsData);
  console.log(`  Inserted ${subscriptionsData.length} subscriptions`);

  console.log("\nSeeding complete!");
  console.log("\nTest Users:");
  console.log(`  Admin (Enterprise): ${TEST_USERS.admin.email}`);
  console.log(`    Clerk ID: ${TEST_USERS.admin.clerkId}`);
  console.log(`  Pro User: ${TEST_USERS.proPlan.email}`);
  console.log(`    Clerk ID: ${TEST_USERS.proPlan.clerkId}`);
  console.log(`  Free User (Trialing): ${TEST_USERS.freePlan.email}`);
  console.log(`    Clerk ID: ${TEST_USERS.freePlan.clerkId}`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
