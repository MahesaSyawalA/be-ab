import cors from "cors";
import express from "express";
import { checkOrigin } from "./common/middleware/check-origin.ts";
import { errorHandler } from "./common/middleware/error-handler.ts";
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
import generalRoutes from "./routes/general-routes.ts";

const app = express();

app.set("trust proxy", env.trustProxy);

app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(checkOrigin);

// Routes
app.use("/api", generalRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/squad", squadRoutes);
app.use("/api/squads", squadRoutes);
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/kontak", kontakRoutes);
app.use("/api/tahap-kanban", tahapKanbanRoutes);
app.use("/api/tahap_kanban", tahapKanbanRoutes);
app.use("/api/tiket", tiketRoutes);
app.use("/api/riwayat-tahap", riwayatTahapRoutes);
app.use("/api/aktivitas", aktivitasRoutes);
app.use("/api/bukti-kunjungan", buktiKunjunganRoutes);
app.use("/api/bukti_kunjungan", buktiKunjunganRoutes);
app.use("/api/penawaran", penawaranRoutes);
app.use("/api/purchase-order", purchaseOrderRoutes);
app.use("/api/notifikasi", notifikasiRoutes);
app.use(errorHandler);

export default app;
