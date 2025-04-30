/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    // This will completely skip ESLint during builds
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com', // For Google profile pics if you're using Google auth
      'storage.googleapis.com'     // Alternative Firebase Storage domain
    ]
  }
  env: {
    NEXT_PUBLIC_ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    NEXT_PUBLIC_ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
