import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // Nilai ini menimpa .env (dotenv tidak menimpa env yang sudah ada), sehingga
    // tes tidak bergantung pada isi .env lokal.
    env: {
      NODE_ENV: "test",
      // Cost lebih rendah khusus tes agar suite tetap cepat.
      BCRYPT_COST: "10",
      JWT_ACCESS_SECRET: "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90",
      JWT_REFRESH_SECRET: "f0e1d2c3b4a596870910203040506070f0e1d2c3b4a596870910203040506070",
      JWT_ISSUER: "be-ab-medical",
      JWT_AUDIENCE: "ab-medical-web",
      ACCESS_TOKEN_TTL: "15m",
      REFRESH_TOKEN_TTL: "7d",
      SESSION_MAX_AGE: "30d",
      LOGIN_RATE_WINDOW: "15m",
      LOGIN_RATE_MAX: "10",
      CORS_ORIGIN: "http://localhost:5173",
    },
  },
});
