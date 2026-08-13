module.exports = {
  apps: [
    {
      name: "bangalicon-frontend",
      cwd: "./bangalicon-frontend",
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${process.env.BANGALICON_FRONTEND_PORT || 3100} -H 127.0.0.1`,
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "bangalicon-admin",
      cwd: "./bangalicon-admin",
      script: "node_modules/next/dist/bin/next",
      args: `start -p ${process.env.BANGALICON_ADMIN_PORT || 3101} -H 127.0.0.1`,
      interpreter: "node",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "bangalicon-backend",
      cwd: "./bangalicon-backend",
      script: "server.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: process.env.BANGALICON_BACKEND_PORT || 5100,
      },
    },
  ],
};
