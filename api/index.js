// UJI INTERNAL SAJA: entrypoint serverless Vercel. Jangan dipakai untuk produksi.
// Dibangun oleh `vercel-build` (esbuild) supaya Vercel tidak mengompilasi TypeScript sendiri.
// Lokal & Docker tetap memakai src/server.ts (app.listen).
export { default } from "../dist/app.mjs";
