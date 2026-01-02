# Code Patterns

> How we write code in Launchpad projects. Follow these patterns exactly.

**Last Updated:** 2025-12-28

---

## Project Structure

```
project-name/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth-required routes (grouped)
│   ├── (marketing)/         # Public marketing pages
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles + Tailwind
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── forms/               # Form components
│   ├── layouts/             # Layout components
│   └── [feature]/           # Feature-specific components
├── lib/
│   ├── db/                  # Database (Drizzle schema, queries)
│   ├── auth/                # Auth utilities
│   ├── schemas/             # Zod schemas
│   ├── utils.ts             # Utility functions (cn, etc.)
│   └── constants.ts         # App constants
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
├── public/                  # Static assets
└── drizzle/                 # Drizzle migrations
```

---

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Pages/Routes | lowercase | `app/dashboard/page.tsx` |
| Utilities | camelCase | `formatDate.ts` |
| Hooks | camelCase with use | `useUser.ts` |
| Types | PascalCase | `User.ts` |
| Schemas | camelCase | `userSchema.ts` |
| API routes | lowercase | `app/api/users/route.ts` |

---

## Component Patterns

### Basic Component

```tsx
// components/ui/user-card.tsx
import { cn } from "@/lib/utils"

interface UserCardProps {
  name: string
  email: string
  className?: string
}

export function UserCard({ name, email, className }: UserCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>
  )
}
```

**Rules:**
- Named exports (not default)
- Props interface above component
- `className` prop for customization
- Use `cn()` for conditional classes

### Client Component

```tsx
// components/forms/contact-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactInput } from "@/lib/schemas/contact"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(data: ContactInput) {
    setIsSubmitting(true)
    try {
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(data),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

**Rules:**
- `"use client"` at top
- Zod schema for validation
- Loading state management
- Error handling with try/catch

### Server Component (default)

```tsx
// app/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/db/queries"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const user = await getUser(userId)

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
    </div>
  )
}
```

**Rules:**
- No `"use client"` (server by default)
- Async function for data fetching
- Auth check at top
- Redirect for unauthorized

---

## Database Patterns

### Schema Definition

```ts
// lib/db/schema.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### Database Client

```ts
// lib/db/index.ts
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema"

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

### Query Functions

```ts
// lib/db/queries.ts
import { eq } from "drizzle-orm"
import { db } from "."
import { users, type User, type NewUser } from "./schema"

export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1)

  return result[0] ?? null
}

export async function createUser(data: NewUser): Promise<User> {
  const result = await db.insert(users).values(data).returning()
  return result[0]
}

export async function updateUser(
  clerkId: string,
  data: Partial<NewUser>
): Promise<User | null> {
  const result = await db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.clerkId, clerkId))
    .returning()

  return result[0] ?? null
}
```

**Rules:**
- Queries in `/lib/db/queries.ts`
- Return types explicit
- Use `returning()` for insert/update
- Null checks for optional results

---

## API Route Patterns

### Basic Route Handler

```ts
// app/api/users/route.ts
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createUser } from "@/lib/db/queries"

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function POST(request: Request) {
  try {
    // Auth check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const data = createUserSchema.parse(body)

    // Execute
    const user = await createUser({ ...data, clerkId: userId })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Failed to create user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

**Rules:**
- Auth check first
- Zod validation for input
- Proper error handling
- Consistent response format
- Log errors server-side

---

## Zod Schema Patterns

```ts
// lib/schemas/user.ts
import { z } from "zod"

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500).optional(),
})

export type UserInput = z.infer<typeof userSchema>

// Partial for updates
export const updateUserSchema = userSchema.partial()
export type UpdateUserInput = z.infer<typeof updateUserSchema>
```

**Rules:**
- Schema and type in same file
- Export both schema and inferred type
- Use `.partial()` for update schemas
- Include error messages

---

## Hook Patterns

```ts
// hooks/use-user.ts
"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/db/schema"

export function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) throw new Error("Failed to fetch user")
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { user, isLoading, error }
}
```

**Rules:**
- Return object with data, loading, error
- Handle all states
- Proper error typing
- Dependency array complete

---

## Utility Patterns

### Class Name Utility

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Format Utilities

```ts
// lib/utils/format.ts
import { format, formatDistanceToNow } from "date-fns"

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy")
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100) // Stripe uses cents
}
```

---

## Error Handling Patterns

### API Error Response

```ts
// lib/errors.ts
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = "APIError"
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  console.error("Unexpected error:", error)
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  )
}
```

---

## Import Order

Always follow this import order:

```ts
// 1. React/Next
import { useState } from "react"
import { NextResponse } from "next/server"

// 2. External packages
import { z } from "zod"
import { format } from "date-fns"

// 3. Internal absolute imports
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"

// 4. Relative imports
import { UserCard } from "./user-card"

// 5. Types (if separate)
import type { User } from "@/types"
```

---

## Environment Variables

```ts
// lib/env.ts
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
})

export const env = envSchema.parse(process.env)
```

**Rules:**
- Validate env vars at startup
- Type-safe access
- Fail fast if missing

---

*Follow these patterns exactly. Consistency is speed.*
