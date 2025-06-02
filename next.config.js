/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // ✅ App-directory gebruiken (voor nieuwe routerstructuur)
  experimental: {
    appDir: true,
  },

  // ✅ Standalone build (handig voor server deployment)
  output: 'standalone',

  // ✅ Webpack aliases (voor nette imports zoals @components etc.)
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
      '@components': path.resolve(__dirname, 'components'),
      '@app': path.resolve(__dirname, 'app'),
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@styles': path.resolve(__dirname, 'styles'),
    };
    return config;
  },

  // 🚫 Geen redirects hier — gebruik <redirect> component in app/page.tsx
};

module.exports = nextConfig;
