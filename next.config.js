/** @type {import('next').NextConfig} */
const path = require('path');

// Force-redirect home directory to project root to stop EPERM scans on Windows system junctions.
process.env.HOME = process.cwd();
process.env.USERPROFILE = process.cwd();
process.env.TEMP = path.join(process.cwd(), '.tmp');
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
  // Disabling standalone mode on Windows to prevent recursive trace-led EPERM scans across drives
  // output: 'standalone',
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
    serverComponentsExternalPackages: ['winston-loki', 'snappy', 'pdf-parse', '@napi-rs/canvas'],
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
  webpack: (config, { isServer }) => {
    // Force the context to the current project directory to prevent cross-drive scanning on Windows.
    config.context = __dirname;

    if (config.resolve) {
      // Disable symlink following to prevent walking into Windows junctions like 'Cookies'
      config.resolve.symlinks = false;
    }

    // This prevents the dev server from restarting when the local JSON database is modified
    // and explicitly ignores system folders outside the project root.
    if (config.watchOptions) {
        config.watchOptions.ignored = [
            '**/.next/**',
            '**/node_modules/**',
            '**/*.json',
            'C:/Users/**',
            'C:\\Users\\**',
            '**/Application Data/**',
            '**/Cookies/**',
            '**/Local Settings/**',
            '**/.git/**',
        ];
    }

    // Strict resolution scoping for Windows stability
    if (config.resolve) {
        config.resolve.symlinks = false;
        config.resolve.modules = [path.resolve(__dirname, 'node_modules'), 'node_modules'];
        
        // Prevent scaling up the directory tree on Windows - force root to project directory
        config.resolve.alias = {
            ...config.resolve.alias,
            '@prisma/client/auth': path.join(__dirname, '.prisma-runtime/auth'),
            '@prisma/client/ops': path.join(__dirname, '.prisma-runtime/ops'),
            '@prisma/client/ai': path.join(__dirname, '.prisma-runtime/ai'),
            '@prisma/client/metro': path.join(__dirname, '.prisma-runtime/metro'),
        };
    }

    // Force Webpack to ignore any file system snapshots outside of the project root.
    // This is the definitive fix for EPERM on Windows system junctions.
    config.snapshot = {
        ...(config.snapshot || {}),
        managedPaths: [path.resolve(__dirname, 'node_modules')],
        immutablePaths: [],
        buildDependencies: {
            hash: true,
            timestamp: true,
        },
        module: { timestamp: true },
        resolve: { timestamp: true },
        resolveBuildDependencies: { timestamp: true },
    };

    // Extreme isolation: prevent Webpack from even knowing about other drives
    if (config.externals) {
      if (Array.isArray(config.externals)) {
        config.externals.push({ 'C:': 'commonjs C:', 'C:/Users': 'commonjs C:/Users' });
      }
    }

    return config;
  },
  env: {
    NEXT_PUBLIC_SETUP_COMPLETE: process.env.NEXT_PUBLIC_SETUP_COMPLETE === 'true' ? 'true' : 'false',
  }
};

module.exports = nextConfig;
