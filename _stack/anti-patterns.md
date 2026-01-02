# Anti-Patterns

> What NOT to do. If you see these patterns, fix them immediately.

**Last Updated:** 2025-12-28

---

## TypeScript Anti-Patterns

### Using `any`

```ts
// ❌ NEVER
function processData(data: any) {
  return data.something
}

// ✅ ALWAYS
function processData(data: { something: string }) {
  return data.something
}

// ✅ If truly unknown, use unknown and narrow
function processData(data: unknown) {
  if (typeof data === "object" && data !== null && "something" in data) {
    return (data as { something: string }).something
  }
  throw new Error("Invalid data")
}
```

### Using `@ts-ignore`

```ts
// ❌ NEVER
// @ts-ignore
const value = someUntypedThing.property

// ✅ ALWAYS — Fix the type
const value = (someUntypedThing as ProperType).property
```

### Non-Null Assertions Everywhere

```ts
// ❌ AVOID
const user = users.find(u => u.id === id)!
const name = user!.name!

// ✅ ALWAYS — Handle the null case
const user = users.find(u => u.id === id)
if (!user) throw new Error("User not found")
const name = user.name ?? "Anonymous"
```

---

## React Anti-Patterns

### Using `useEffect` for Derived State

```tsx
// ❌ NEVER
const [fullName, setFullName] = useState("")
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// ✅ ALWAYS — Compute directly
const fullName = `${firstName} ${lastName}`
```

### Fetching in useEffect Without Cleanup

```tsx
// ❌ NEVER
useEffect(() => {
  fetch("/api/data")
    .then(res => res.json())
    .then(setData)
}, [])

// ✅ ALWAYS — Handle cleanup and race conditions
useEffect(() => {
  let cancelled = false

  async function fetchData() {
    const res = await fetch("/api/data")
    const data = await res.json()
    if (!cancelled) setData(data)
  }

  fetchData()
  return () => { cancelled = true }
}, [])

// ✅ BETTER — Use React Query or server components
```

### Prop Drilling Through Many Levels

```tsx
// ❌ AVOID — Passing props through 5+ components
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user}>
      <Nav user={user}>
        <UserMenu user={user} />

// ✅ BETTER — Use context for truly global state
const UserContext = createContext<User | null>(null)

// ✅ BEST — Use server components and fetch where needed
```

### Putting Everything in State

```tsx
// ❌ NEVER — Derived values in state
const [items, setItems] = useState([])
const [total, setTotal] = useState(0)
const [average, setAverage] = useState(0)

// ✅ ALWAYS — Compute derived values
const [items, setItems] = useState([])
const total = items.reduce((sum, item) => sum + item.value, 0)
const average = items.length ? total / items.length : 0
```

---

## Next.js Anti-Patterns

### Using Pages Router in New Projects

```tsx
// ❌ NEVER — Don't create pages/ directory
pages/
  index.tsx
  about.tsx

// ✅ ALWAYS — Use App Router
app/
  page.tsx
  about/page.tsx
```

### Client Components for Everything

```tsx
// ❌ AVOID — Don't make everything a client component
"use client"

export default function StaticPage() {
  return <div>This could be a server component</div>
}

// ✅ ALWAYS — Server components by default
export default function StaticPage() {
  return <div>Server rendered, zero JS shipped</div>
}

// ✅ ONLY use client when you need:
// - useState, useEffect
// - Event handlers (onClick, onChange)
// - Browser APIs
```

### Fetching in Client Components When Server Would Work

```tsx
// ❌ AVOID
"use client"
import { useState, useEffect } from "react"

export default function UserPage({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetch(`/api/users/${userId}`).then(r => r.json()).then(setUser)
  }, [userId])
  // ...
}

// ✅ BETTER — Fetch in server component
export default async function UserPage({ userId }: { userId: string }) {
  const user = await getUser(userId)
  return <UserProfile user={user} />
}
```

---

## Database Anti-Patterns

### N+1 Queries

```ts
// ❌ NEVER — Fetching in a loop
const posts = await db.select().from(posts)
for (const post of posts) {
  post.author = await db.select().from(users).where(eq(users.id, post.authorId))
}

// ✅ ALWAYS — Join or batch fetch
const postsWithAuthors = await db
  .select()
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
```

### Raw SQL in Components

```tsx
// ❌ NEVER
export default async function Page() {
  const result = await sql`SELECT * FROM users WHERE id = ${userId}`
  // ...
}

// ✅ ALWAYS — Use query functions
export default async function Page() {
  const user = await getUser(userId)
  // ...
}
```

### No Input Validation on Database Operations

```ts
// ❌ NEVER — Trust user input
export async function POST(request: Request) {
  const body = await request.json()
  await db.insert(users).values(body) // Could insert anything!
}

// ✅ ALWAYS — Validate with Zod
export async function POST(request: Request) {
  const body = await request.json()
  const data = createUserSchema.parse(body)
  await db.insert(users).values(data)
}
```

---

## API Anti-Patterns

### No Error Handling

```ts
// ❌ NEVER — Unhandled errors crash the server
export async function GET() {
  const users = await db.select().from(users)
  return NextResponse.json(users)
}

// ✅ ALWAYS — Wrap in try/catch
export async function GET() {
  try {
    const users = await db.select().from(users)
    return NextResponse.json(users)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}
```

### No Auth Check

```ts
// ❌ NEVER — Public access to sensitive data
export async function GET() {
  const users = await db.select().from(users)
  return NextResponse.json(users)
}

// ✅ ALWAYS — Check auth first
export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // ...
}
```

### Inconsistent Response Format

```ts
// ❌ AVOID — Different response shapes
return { user: data }           // Sometimes this
return { data: user }           // Sometimes that
return user                     // Sometimes just data
return { success: true, user }  // Sometimes with flags

// ✅ ALWAYS — Consistent format
// Success: return the data directly
return NextResponse.json(user)
return NextResponse.json({ users, total })

// Error: always { error, details? }
return NextResponse.json({ error: "Not found" }, { status: 404 })
```

---

## Styling Anti-Patterns

### Hardcoded Colors

```tsx
// ❌ NEVER
<div className="bg-gray-900 text-white">

// ✅ ALWAYS — Use semantic tokens
<div className="bg-background text-foreground">
```

### Mixing Icon Libraries

```tsx
// ❌ NEVER
import { FaHome } from "react-icons/fa"
import { AiOutlineUser } from "react-icons/ai"
import { Home } from "lucide-react"

// ✅ ALWAYS — Lucide only
import { Home, User } from "lucide-react"
```

### Arbitrary Values When Scale Exists

```tsx
// ❌ AVOID
<div className="p-[13px] w-[347px] text-[15px]">

// ✅ ALWAYS — Use the scale
<div className="p-3 w-80 text-sm">
```

### Inline Styles

```tsx
// ❌ NEVER (except for truly dynamic values)
<div style={{ backgroundColor: "red", padding: "20px" }}>

// ✅ ALWAYS
<div className="bg-red-500 p-5">

// ✅ EXCEPTION — Truly dynamic values
<div style={{ transform: `translateX(${position}px)` }}>
```

---

## Security Anti-Patterns

### Exposing Secrets in Client Code

```tsx
// ❌ NEVER — NEXT_PUBLIC_ exposes to browser
const apiKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY

// ✅ ALWAYS — Server-only secrets have no prefix
const apiKey = process.env.STRIPE_SECRET_KEY // Only on server
```

### No Input Sanitization

```tsx
// ❌ NEVER — XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ ALWAYS — Sanitize or avoid
import DOMPurify from "dompurify"
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ✅ BEST — Don't use dangerouslySetInnerHTML
<div>{userInput}</div>
```

### Trusting Client Data

```ts
// ❌ NEVER — Client can send anything
const { isAdmin } = await request.json()
if (isAdmin) grantAdminAccess()

// ✅ ALWAYS — Verify on server
const { userId } = await auth()
const user = await getUser(userId)
if (user.role === "admin") grantAdminAccess()
```

---

## Performance Anti-Patterns

### Importing Entire Libraries

```ts
// ❌ AVOID — Imports entire library
import _ from "lodash"
const result = _.pick(obj, ["a", "b"])

// ✅ BETTER — Import only what you need
import pick from "lodash/pick"
const result = pick(obj, ["a", "b"])

// ✅ BEST — Use native JS
const result = { a: obj.a, b: obj.b }
```

### No Loading States

```tsx
// ❌ NEVER — User sees nothing while loading
const { data } = useQuery()
return <div>{data.name}</div>

// ✅ ALWAYS — Handle loading state
const { data, isLoading } = useQuery()
if (isLoading) return <Skeleton />
return <div>{data.name}</div>
```

### Unnecessary Re-renders

```tsx
// ❌ AVOID — Object created every render
<Component style={{ color: "red" }} />
<Component data={{ items: [1, 2, 3] }} />

// ✅ BETTER — Memoize or define outside
const style = useMemo(() => ({ color: "red" }), [])
<Component style={style} />

// ✅ BEST — Use Tailwind classes
<Component className="text-red-500" />
```

---

## File Organization Anti-Patterns

### Giant Component Files

```tsx
// ❌ NEVER — 500+ line components
export function Dashboard() {
  // 50 lines of hooks
  // 100 lines of handlers
  // 300 lines of JSX
}

// ✅ ALWAYS — Split into smaller components
// components/dashboard/index.tsx
// components/dashboard/stats-grid.tsx
// components/dashboard/recent-activity.tsx
// components/dashboard/hooks/use-dashboard-data.ts
```

### Orphan Files

```
// ❌ NEVER — Random files at root
/SPRINT_PLAN_v2.md
/old-notes.txt
/temp-debug.ts

// ✅ ALWAYS — Everything has a home
/_archive/sprints/2025-01-15-sprint-plan.md
/_scratch/debug-notes.md
```

---

## Summary

When in doubt:
1. **Type everything** — No `any`, no `@ts-ignore`
2. **Server first** — Client components only when needed
3. **Validate inputs** — Zod for everything external
4. **Handle errors** — Try/catch, loading states, error boundaries
5. **Use the stack** — Don't invent alternatives
6. **Follow the patterns** — Consistency is speed

---

*If you see these anti-patterns in code, fix them. Don't work around them.*
