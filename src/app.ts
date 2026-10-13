import express from "express";
import userRoutes from "./modules/users/users.routes.ts";
import squadRoutes from "./modules/squads/squad.routes.ts"

const app = express();

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/squad", squadRoutes);

export default app;



