import app from "./app.ts";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`AB Medical Sales Tracking BE running on port ${PORT}`);
});
