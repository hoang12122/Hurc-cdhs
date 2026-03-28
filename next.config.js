/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];


const nextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
  },
   async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config) => {
    // This prevents the dev server from restarting when the local JSON database is modified.
    if (config.watchOptions) {
        config.watchOptions.ignored = [
            ...(Array.isArray(config.watchOptions.ignored) ? config.watchOptions.ignored : []),
            '**/.next/**',
            '**/node_modules/**',
            '**/*.json',
        ];
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_SETUP_COMPLETE: process.env.NEXT_PUBLIC_SETUP_COMPLETE === 'true' ? 'true' : 'false',
  }
};

module.exports = nextConfig;
