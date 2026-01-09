module.exports = {
  apps: [{
    name: 'bishnupriya-dictionary',
    script: './backend/dist/index.js',
    instances: 'max', // Use all CPU cores for better performance
    exec_mode: 'cluster', // Cluster mode for load balancing
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    // Advanced PM2 settings
    autorestart: true,
    watch: false, // Don't watch in production
    max_memory_restart: '500M', // Restart if memory exceeds 500MB
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    // Environment specific settings
    node_args: '--max-old-space-size=512'
  }]
};
