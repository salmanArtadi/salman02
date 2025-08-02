// ================================================
// File: next.config.mjs
// ================================================
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This resolves the mysql2 module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'mysql2': false,
        'net': false,
        'tls': false,
        'crypto': false,
        'stream': false,
        'os': false,
      };
    }
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
