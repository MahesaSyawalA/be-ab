import "dotenv/config";
import { env } from "./config/env.ts";
import app from "./app.ts";

app.listen(env.port, () => {
  console.log(`AB Medical Sales Tracking BE running on port ${env.port}`);
});
