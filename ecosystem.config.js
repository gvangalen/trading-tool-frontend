module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'node',
      args: '.next/standalone/server.js',
      cwd: '/home/ubuntu/trading-tool-frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
