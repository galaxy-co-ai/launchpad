import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="text-xl font-bold">
            Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Settings
              </Link>
            </nav>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main className="container flex-1 px-4 py-8">{children}</main>
    </div>
  )
}

// - Sidebar navigation
// - Header with user menu
// - Main content area
