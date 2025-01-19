import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: ['./styles'],
  },
  experimental: {
  },
  images: {
    domains: ['localhost'],
  },
  webpack(config) {
    return config
  }
}

export default nextConfig