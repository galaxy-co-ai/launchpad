import { currentUser } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || "there"}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's what's happening with your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Quick Stats</h3>
          <p className="mt-4 text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground">Total items</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Activity</h3>
          <p className="mt-4 text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Status</h3>
          <p className="mt-4 text-3xl font-bold">✓</p>
          <p className="text-sm text-muted-foreground">All systems go</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold">Getting Started</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>✓ Project scaffolded with Launchpad</li>
          <li>✓ Authentication configured with Clerk</li>
          <li>✓ Database connected to Neon PostgreSQL</li>
          <li>→ Start building your features!</li>
        </ul>
      </div>
    </div>
  )
}

// - Protected route
// - User greeting
// - Key metrics/cards
