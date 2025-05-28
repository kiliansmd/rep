/** @type {import('next').NextConfig} */
const nextConfig = {
  // Für Vercel Deployment optimiert
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // API-Routen Konfiguration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
  
  // Entwicklungshilfen
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Experimentelle Funktionen für bessere Performance
  serverExternalPackages: ['@vercel/kv']
}

export default nextConfig
