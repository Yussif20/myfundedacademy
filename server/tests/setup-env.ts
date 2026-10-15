// Minimal env so src/env.ts validates. Tests never reach a real database.
Object.assign(process.env, {
  NODE_ENV: "test",
  BASE_URL_SERVER_DEV: "http://localhost:5000",
  BASE_URL_SERVER: "http://localhost:5000",
  BASE_URL_CLIENT: "http://localhost:3000",
  DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  JWT_ACCESS_SECRET: "test-access-secret",
  JWT_REFRESH_SECRET: "test-refresh-secret",
  INVITE_TOKEN_SECRET: "test-invite-secret",
  ADMIN_EMAIL: "admin@example.com",
  ADMIN_PASSWORD: "test-password",
  DEMO_RESET_SECRET: "test-reset-secret",
});
