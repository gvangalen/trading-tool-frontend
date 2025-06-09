module.exports = {
  apps: [
    {
      name: 'frontend',
      script: '.next/standalone/server.js',  // ✅ Geen 'node' + args nodig, doe direct het pad
      cwd: '/home/ubuntu/trading-tool-frontend',
      exec_mode: 'fork',                     // ✅ Expliciet, tenzij je 'cluster' wilt
      interpreter: 'node',                   // ✅ Zekerheid over gebruikte interpreter
      watch: false,                          // ✅ Geen automatische herstart bij file changes (voor productie)
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
