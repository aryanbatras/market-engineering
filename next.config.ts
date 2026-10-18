import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["react-icons", "lucide-react", "motion", "gsap"],
  },
}

export default nextConfig
