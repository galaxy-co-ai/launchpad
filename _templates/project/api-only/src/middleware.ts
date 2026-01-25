import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/api/health",
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Allow public routes
  if (isPublicRoute(request)) {
    return;
  }

  // Protect all other API routes
  await auth.protect();
});

export const config = {
  matcher: [
    // Match all API routes except static files
    "/api/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
