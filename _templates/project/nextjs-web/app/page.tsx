import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <main className="container flex max-w-3xl flex-col items-center gap-8 px-4 py-16 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Welcome to
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {" "}
              Launchpad
            </span>
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Your Micro-SaaS is ready to ship. Built with Next.js, Tailwind, and the Launchpad framework.
          </p>
        </div>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">TypeScript</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fully typed with strict mode
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Database</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Neon PostgreSQL + Drizzle
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold">Auth</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Clerk authentication
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

// - Marketing landing page
// - Hero section
// - Features
// - CTA
