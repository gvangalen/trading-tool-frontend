/** @type {import('next').NextConfig} */
const path = require('path');

try {
  const chartPath = require.resolve('chart.js');
  console.log('✅ chart.js gevonden in:', chartPath);
} catch (err) {
  console.error('❌ chart.js NIET gevonden!', err);
}

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
    return config;
  },
};

module.exports = nextConfig;
