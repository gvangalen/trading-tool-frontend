module.exports = {
  apps: [
    {
      name: 'frontend',
      cwd: '/home/ubuntu/trading-tool-frontend',
      script: 'npm',
      args: 'run start',              // 🔁 Start via npm script (dus `next start`)
      exec_mode: 'fork',
      interpreter: 'node',            // ✅ Wordt genegeerd bij npm-script maar mag blijven
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
