import cors from "cors";
import express from "express";
import { checkOrigin } from "./common/middleware/check-origin.ts";
import { errorHandler } from "./common/middleware/error-handler.ts";
import { requireAuth } from "./common/middleware/require-auth.ts";
import { env } from "./config/env.ts";
import authRoutes from "./modules/auth/auth.routes.ts";
import userRoutes from "./modules/users/users.routes.ts";
import squadRoutes from "./modules/squads/squad.routes.ts";
import pelangganRoutes from "./modules/pelanggan/pelanggan.routes.ts";
import kontakRoutes from "./modules/kontak/kontak.routes.ts";
import tahapKanbanRoutes from "./modules/tahap-kanban/tahap-kanban.routes.ts";
import tiketRoutes from "./modules/tiket/tiket.routes.ts";
import riwayatTahapRoutes from "./modules/riwayat-tahap/riwayat-tahap.routes.ts";
import aktivitasRoutes from "./modules/aktivitas/aktivitas.routes.ts";
import buktiKunjunganRoutes from "./modules/bukti-kunjungan/bukti-kunjungan.routes.ts";
import penawaranRoutes from "./modules/penawaran/penawaran.routes.ts";
import purchaseOrderRoutes from "./modules/purchase-order/purchase-order.routes.ts";
import notifikasiRoutes from "./modules/notifikasi/notifikasi.routes.ts";
import evidenceRoutes from "./modules/evidence/evidence.routes.ts";
import generalRoutes from "./routes/general-routes.ts";
import messagesRouter from "./routes/pusher.ts";

const app = express();

app.set("trust proxy", env.trustProxy);

const corsOptions: cors.CorsOptions = {
  origin: env.corsOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "ngrok-skip-browser-warning"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(checkOrigin);

app.use("/api", generalRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/pusher", requireAuth, messagesRouter);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/squads", requireAuth, squadRoutes);
app.use("/api/pelanggan", requireAuth, pelangganRoutes);
app.use("/api/kontak", requireAuth, kontakRoutes);
app.use("/api/tahap-kanban", requireAuth, tahapKanbanRoutes);
app.use("/api/tiket", requireAuth, tiketRoutes);
app.use("/api/riwayat-tahap", requireAuth, riwayatTahapRoutes);
app.use("/api/aktivitas", requireAuth, aktivitasRoutes);
app.use("/api/bukti-kunjungan", requireAuth, buktiKunjunganRoutes);
app.use("/api/penawaran", requireAuth, penawaranRoutes);
app.use("/api/purchase-order", requireAuth, purchaseOrderRoutes);
app.use("/api/notifikasi", requireAuth, notifikasiRoutes);
app.use("/api/evidence", requireAuth, evidenceRoutes);
app.use(errorHandler);

export default app;
