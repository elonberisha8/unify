/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    // Stripe nuk bundle-ohet nga Next.js (server-side only)
    serverComponentsExternalPackages: ["stripe"],
  },

  images: {
    remotePatterns: [
      {
        // Cloudinary — imazhet e Unify (cloud: dyimfvnv3)
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dyimfvnv3/**",
      },
      {
        // Clerk — avatar e userave
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        // Unsplash — placeholder images gjatë development
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

module.exports = nextConfig
