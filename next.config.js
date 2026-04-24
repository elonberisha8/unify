/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Stripe nuk bundle-ohet nga Next.js (server-side only)
  // Në Next.js 14.2+, kjo është top-level (jo brenda experimental)
  serverExternalPackages: ["stripe"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

module.exports = nextConfig
