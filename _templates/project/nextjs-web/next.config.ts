import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Disable telemetry
  telemetry: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
}

export default nextConfig

// - Image domains
// - Redirects if needed
