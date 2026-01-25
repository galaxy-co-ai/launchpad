/**
 * Database Seed Script
 *
 * Populates the database with test data for development.
 * Run with: pnpm db:seed
 *
 * This script is idempotent - safe to run multiple times.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { items, apiKeys, usageEvents } from "./schema";
import crypto from "crypto";

// Test user IDs (Clerk format)
const TEST_USERS = {
  admin: "user_test_admin_2xK9mN3pQ7rS",
  user1: "user_test_user1_4wL8nP2qR6sT",
};

// Hash function for API keys
function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

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
  await db.delete(usageEvents);
  await db.delete(apiKeys);
  await db.delete(items);

  // Seed items
  console.log("Seeding items...");
  const itemsData = [
    // Admin's items
    {
      userId: TEST_USERS.admin,
      name: "Project Alpha",
      data: { type: "project", status: "active", priority: "high" },
    },
    {
      userId: TEST_USERS.admin,
      name: "API Documentation",
      data: { type: "document", format: "markdown", version: "1.0" },
    },
    {
      userId: TEST_USERS.admin,
      name: "Integration Config",
      data: { services: ["stripe", "clerk", "neon"], enabled: true },
    },
    // User1's items
    {
      userId: TEST_USERS.user1,
      name: "My First Item",
      data: { type: "note", content: "Hello world!" },
    },
    {
      userId: TEST_USERS.user1,
      name: "Settings",
      data: { theme: "dark", notifications: true, language: "en" },
    },
    {
      userId: TEST_USERS.user1,
      name: "Bookmarks",
      data: { urls: ["https://example.com", "https://docs.example.com"] },
    },
    {
      userId: TEST_USERS.user1,
      name: "Draft Post",
      data: { title: "Getting Started", draft: true, tags: ["intro", "guide"] },
    },
    {
      userId: TEST_USERS.user1,
      name: "Analytics Config",
      data: { trackPageViews: true, trackEvents: true, anonymize: false },
    },
  ];

  await db.insert(items).values(itemsData);
  console.log(`  Inserted ${itemsData.length} items`);

  // Seed API keys
  console.log("Seeding API keys...");
  const apiKeysData = [
    // Admin's keys
    {
      userId: TEST_USERS.admin,
      name: "Production Key",
      keyHash: hashKey("sk_live_admin_production_key_12345"),
      lastUsedAt: daysAgo(1),
      expiresAt: daysFromNow(365),
    },
    {
      userId: TEST_USERS.admin,
      name: "Development Key",
      keyHash: hashKey("sk_test_admin_development_key_67890"),
      lastUsedAt: daysAgo(0),
      expiresAt: null, // Never expires
    },
    // User1's keys
    {
      userId: TEST_USERS.user1,
      name: "My API Key",
      keyHash: hashKey("sk_test_user1_api_key_abcdef"),
      lastUsedAt: daysAgo(7),
      expiresAt: daysFromNow(30),
    },
    {
      userId: TEST_USERS.user1,
      name: "Expired Key",
      keyHash: hashKey("sk_test_user1_expired_key_xyz123"),
      lastUsedAt: daysAgo(60),
      expiresAt: daysAgo(30), // Already expired
    },
  ];

  await db.insert(apiKeys).values(apiKeysData);
  console.log(`  Inserted ${apiKeysData.length} API keys`);

  // Seed usage events
  console.log("Seeding usage events...");
  const eventTypes = [
    "item.created",
    "item.updated",
    "item.deleted",
    "api.request",
    "auth.login",
    "auth.logout",
    "export.requested",
    "settings.updated",
  ];

  const usageEventsData: Array<{
    userId: string;
    event: string;
    metadata: Record<string, unknown>;
    createdAt: Date;
  }> = [];

  // Generate events for both users over the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = daysAgo(i);

    // Admin events (more active)
    if (Math.random() > 0.3) {
      usageEventsData.push({
        userId: TEST_USERS.admin,
        event: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        metadata: {
          source: "web",
          duration_ms: Math.floor(Math.random() * 500) + 50,
          success: Math.random() > 0.1,
        },
        createdAt: date,
      });
    }

    // User1 events (less active)
    if (Math.random() > 0.6) {
      usageEventsData.push({
        userId: TEST_USERS.user1,
        event: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        metadata: {
          source: Math.random() > 0.5 ? "web" : "api",
          duration_ms: Math.floor(Math.random() * 300) + 100,
          success: Math.random() > 0.05,
        },
        createdAt: date,
      });
    }
  }

  // Add some specific events for testing
  usageEventsData.push(
    {
      userId: TEST_USERS.admin,
      event: "api.request",
      metadata: {
        endpoint: "/api/v1/items",
        method: "GET",
        status: 200,
        duration_ms: 45,
      },
      createdAt: daysAgo(0),
    },
    {
      userId: TEST_USERS.admin,
      event: "export.requested",
      metadata: {
        format: "csv",
        records: 150,
        size_kb: 24,
      },
      createdAt: daysAgo(2),
    },
    {
      userId: TEST_USERS.user1,
      event: "auth.login",
      metadata: {
        provider: "clerk",
        ip: "192.168.1.1",
        userAgent: "Mozilla/5.0",
      },
      createdAt: daysAgo(1),
    }
  );

  await db.insert(usageEvents).values(usageEventsData);
  console.log(`  Inserted ${usageEventsData.length} usage events`);

  console.log("\nSeeding complete!");
  console.log("\nTest Users:");
  console.log(`  Admin: ${TEST_USERS.admin}`);
  console.log(`  User1: ${TEST_USERS.user1}`);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
