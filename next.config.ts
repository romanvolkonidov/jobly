// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Core application settings
    APP_NAME: process.env.APP_NAME,
    API_VERSION: process.env.API_VERSION,
    
    // Feature flags for phased rollout
    ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS,
    ENABLE_REALTIME: process.env.ENABLE_REALTIME,
    ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS,
  },
  
  output: 'standalone',
  
  // Configure image optimization for task photos and user profiles
  images: {
    domains: [
      'your-cdn.com',
      'your-s3-bucket.amazonaws.com',
      'marketplace-uploads.your-domain.com'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Progressive Web App configuration
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  
  // API routes configuration
  rewrites: async () => {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${process.env.API_BASE_URL}/api/v1/:path*`,
      },
      {
        source: '/ws',
        destination: `${process.env.WEBSOCKET_URL}/ws`,
      },
    ];
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' wss: https:;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;