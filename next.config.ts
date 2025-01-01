/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    APP_NAME: process.env.APP_NAME || 'Jobly',
    API_VERSION: process.env.API_VERSION || 'v1',
    ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS || 'false',
    ENABLE_REALTIME: process.env.ENABLE_REALTIME || 'false',
    ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS || 'false',
  },

  output: 'standalone',

  images: {
    domains: [
      'your-cdn.com',
      'your-s3-bucket.amazonaws.com',
      'marketplace-uploads.your-domain.com',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  experimental: {
    optimizeCss: true,
    modern: true,
    optimizeFonts: true,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  httpAgentOptions: {
    keepAlive: true,
  },

  // Define async rewrites
  async rewrites() {
    const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${API_BASE_URL}/api/v1/:path*`,
      },
      {
        source: '/ws',
        destination: 'http://localhost:8080/ws',
      },
    ];
  },

  // Define async headers
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
        ],
      },
    ];
  }
  
  
  
};

module.exports = nextConfig;
