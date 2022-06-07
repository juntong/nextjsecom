/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: ['fakestoreapi.com', 'tailwindui.com', 'localhost'],
  },
}

module.exports = nextConfig
