module.exports = {
  apps: [
    {
      name: 'frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/ubuntu/trading-tool-frontend',
      exec_mode: 'fork',
      interpreter: 'node',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
