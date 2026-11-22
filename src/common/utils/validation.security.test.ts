import { describe, expect, it } from "vitest";
import { createAktivitasSchema, updateAktivitasSchema } from "../../modules/aktivitas/aktivitas.validation.ts";
import { changePasswordSchema, loginSchema } from "../../modules/auth/auth.validation.ts";
import { createBuktiKunjunganSchema } from "../../modules/bukti-kunjungan/bukti-kunjungan.validation.ts";
import { createEvidenceSchema } from "../../modules/evidence/evidence.validation.ts";
import { createKontakSchema, updateKontakSchema } from "../../modules/kontak/kontak.validation.ts";
import { createNotifikasiSchema, updateNotifikasiSchema } from "../../modules/notifikasi/notifikasi.validation.ts";
import { createPelangganSchema } from "../../modules/pelanggan/pelanggan.validation.ts";
import { createPenawaranSchema, updatePenawaranSchema } from "../../modules/penawaran/penawaran.validation.ts";
import { createPurchaseOrderSchema, updatePurchaseOrderSchema } from "../../modules/purchase-order/purchase-order.validation.ts";
import { createRiwayatTahapSchema, updateRiwayatTahapSchema } from "../../modules/riwayat-tahap/riwayat-tahap.validation.ts";
import { createSquadSchema, updateSquadSchema } from "../../modules/squads/squad.validation.ts";
import { createTahapKanbanSchema, updateTahapKanbanSchema } from "../../modules/tahap-kanban/tahap-kanban.validation.ts";
import { createTiketSchema, updateTiketSchema } from "../../modules/tiket/tiket.validation.ts";
import { createUserSchema, resetPasswordSchema, updateUserSchema } from "../../modules/users/users.validation.ts";
import { createPusherMessageSchema } from "../../routes/pusher.validation.ts";
import {
  hasDangerousXssPattern,
  isSafeAudioFile,
  isSafeDocumentFile,
  isSafeHttpUrl,
  isSafeImageFile,
  sanitizeFilename,
} from "./validation.ts";

describe("Security & Validation Audit Suite (BE)", () => {
  const createSchemas = [
    { name: "loginSchema", schema: loginSchema, minErrors: 2 },
    { name: "changePasswordSchema", schema: changePasswordSchema, minErrors: 2 },
    { name: "createUserSchema", schema: createUserSchema, minErrors: 5 },
    { name: "resetPasswordSchema", schema: resetPasswordSchema, minErrors: 1 },
    { name: "createAktivitasSchema", schema: createAktivitasSchema, minErrors: 5 },
    { name: "createBuktiKunjunganSchema", schema: createBuktiKunjunganSchema, minErrors: 5 },
    { name: "createEvidenceSchema", schema: createEvidenceSchema, minErrors: 3 },
    { name: "createKontakSchema", schema: createKontakSchema, minErrors: 5 },
    { name: "createNotifikasiSchema", schema: createNotifikasiSchema, minErrors: 3 },
    { name: "createPelangganSchema", schema: createPelangganSchema, minErrors: 6 },
    { name: "createPenawaranSchema", schema: createPenawaranSchema, minErrors: 7 },
    { name: "createPurchaseOrderSchema", schema: createPurchaseOrderSchema, minErrors: 7 },
    { name: "createRiwayatTahapSchema", schema: createRiwayatTahapSchema, minErrors: 3 },
    { name: "createSquadSchema", schema: createSquadSchema, minErrors: 4 },
    { name: "createTahapKanbanSchema", schema: createTahapKanbanSchema, minErrors: 5 },
    { name: "createTiketSchema", schema: createTiketSchema, minErrors: 9 },
    { name: "createPusherMessageSchema", schema: createPusherMessageSchema, minErrors: 3 },
  ];

  describe("Payload kosong ({}) wajib ditolak dengan notifikasi per-field", () => {
    for (const { name, schema, minErrors } of createSchemas) {
      it(`${name} menolak payload {} dengan minimal ${minErrors} error field`, () => {
        const result = schema.safeParse({});
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.length).toBeGreaterThanOrEqual(minErrors);
          for (const issue of result.error.issues) {
            expect(issue.message).not.toMatch(/expected .+, received undefined/i);
          }
        }
      });
    }
  });

  describe("Update payload kosong ({}) pada JSON PUT/PATCH ditolak", () => {
    const updateSchemas = [
      { name: "updateUserSchema", schema: updateUserSchema },
      { name: "updateAktivitasSchema", schema: updateAktivitasSchema },
      { name: "updateKontakSchema", schema: updateKontakSchema },
      { name: "updateNotifikasiSchema", schema: updateNotifikasiSchema },
      { name: "updatePenawaranSchema", schema: updatePenawaranSchema },
      { name: "updatePurchaseOrderSchema", schema: updatePurchaseOrderSchema },
      { name: "updateRiwayatTahapSchema", schema: updateRiwayatTahapSchema },
      { name: "updateSquadSchema", schema: updateSquadSchema },
      { name: "updateTahapKanbanSchema", schema: updateTahapKanbanSchema },
      { name: "updateTiketSchema", schema: updateTiketSchema },
    ];

    for (const { name, schema } of updateSchemas) {
      it(`${name} menolak {}`, () => {
        const result = schema.safeParse({});
        expect(result.success).toBe(false);
      });
    }
  });

  describe("Perlindungan XSS & URL berbahaya", () => {
    it("mendeteksi pola XSS umum dan membiarkan teks medis/bisnis normal", () => {
      expect(hasDangerousXssPattern("<script>alert(1)</script>")).toBe(true);
      expect(hasDangerousXssPattern('<img src=x onerror="alert(1)">')).toBe(true);
      expect(hasDangerousXssPattern("javascript:alert(1)")).toBe(true);
      expect(hasDangerousXssPattern("<svg onload=alert(1)>")).toBe(true);
      expect(hasDangerousXssPattern("data:text/html,<script>alert(1)</script>")).toBe(true);

      // Teks normal dengan simbol perbandingan tetap diizinkan
      expect(hasDangerousXssPattern("Diskon < 10% untuk RS A & B")).toBe(false);
      expect(hasDangerousXssPattern("RS Harapan Kita - Jl. S. Parman No. 87")).toBe(false);
    });

    it("memvalidasi protokol URL hanya http/https", () => {
      expect(isSafeHttpUrl("https://cdn.example.com/file.pdf")).toBe(true);
      expect(isSafeHttpUrl("http://localhost:3000/doc.pdf")).toBe(true);
      expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
      expect(isSafeHttpUrl("data:text/html;base64,PHNjcmlwdD4=")).toBe(false);
      expect(isSafeHttpUrl("not-a-url")).toBe(false);
    });

    it("menolak url_file_penawaran dengan skema javascript:", () => {
      const result = createPenawaranSchema.safeParse({
        id_tiket: "550e8400-e29b-41d4-a716-446655440000",
        no_penawaran: "QT-001",
        revisi_ke: 0,
        tanggal_penawaran: "2026-11-22",
        total_nilai: 1000000,
        status: "draft",
        url_file_penawaran: "javascript:alert(1)",
      });
      expect(result.success).toBe(false);
    });

    it("menolak string kosong pada nama & no_telp di createUserSchema", () => {
      const result = createUserSchema.safeParse({
        nama: "   ",
        role: "sales",
        email: "sales@example.com",
        no_telp: "",
        password: "Password123!",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Validasi File Upload (Blokir SVG/HTML/JS)", () => {
    it("menolak SVG & HTML pada upload gambar dan dokumen", () => {
      expect(isSafeImageFile("image/svg+xml", "payload.svg")).toBe(false);
      expect(isSafeImageFile("image/png", "fake.svg")).toBe(false);
      expect(isSafeImageFile("text/html", "index.html")).toBe(false);
      expect(isSafeImageFile("image/jpeg", "foto.jpg")).toBe(true);
      expect(isSafeImageFile("image/png", "foto.png")).toBe(true);

      expect(isSafeDocumentFile("text/html", "doc.html")).toBe(false);
      expect(isSafeDocumentFile("application/javascript", "script.js")).toBe(false);
      expect(isSafeDocumentFile("application/pdf", "penawaran.pdf")).toBe(true);

      expect(isSafeAudioFile("audio/mpeg", "rekaman.mp3")).toBe(true);
      expect(isSafeAudioFile("text/html", "fake.html")).toBe(false);
    });

    it("mensanitasi nama file dari karakter berbahaya", () => {
      expect(sanitizeFilename('<script>evil.pdf\u0000')).toBe("scriptevil.pdf");
    });
  });
});
