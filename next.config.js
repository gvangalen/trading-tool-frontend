/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
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

    // ✅ Voeg fallback op modules toe voor chart.js/auto compatibiliteit
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      "util": require.resolve("util/"),
      "path": require.resolve("path-browserify"),
    };

    return config;
  },
};

module.exports = nextConfig;
