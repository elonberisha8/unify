/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Stripe dhe librari tjera server-side nuk bundle-ohen nga Next.js
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
    ],
  },
}

module.exports = nextConfig
