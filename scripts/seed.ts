/**
 * Login for user: Password123!
 */
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma, prismaPool } from "../src/config/prisma.ts";

const SEED_PASSWORD = "Password123!";
const YEAR = new Date().getFullYear();
const DAY = 86_400_000;

const daysAgo = (n: number) => new Date(Date.now() - n * DAY);
const daysFromNow = (n: number) => new Date(Date.now() + n * DAY);
const pad = (n: number, len = 4) => String(n).padStart(len, "0");
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function must<T>(v: T | undefined | null): T {
  if (v === undefined || v === null) throw new Error("Seed data reference missing");
  return v;
}

/** Haversine distance in meters */
function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// ---------------------------------------------------------------------------
// Wipe (children first)
// ---------------------------------------------------------------------------
async function wipe() {
  await prisma.notifikasi.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.penawaran.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.buktiKunjungan.deleteMany();
  await prisma.aktivitas.deleteMany();
  await prisma.riwayatTahap.deleteMany();
  await prisma.tiket.deleteMany();
  await prisma.kontak.deleteMany();
  await prisma.pelanggan.deleteMany();
  await prisma.tahapKanban.deleteMany();
  await prisma.user.deleteMany();
  await prisma.squad.deleteMany();
}

// ---------------------------------------------------------------------------
// Static reference data
// ---------------------------------------------------------------------------
const tahapDefs = [
  { nama_tahap: "Visit", jenis_tahap: "visit", dot_color: "#94a3b8" },
  { nama_tahap: "Kebutuhan", jenis_tahap: "kebutuhan", dot_color: "#3b82f6" },
  { nama_tahap: "Opportunity", jenis_tahap: "opportunity", dot_color: "#8b5cf6" },
  { nama_tahap: "Follow Up", jenis_tahap: "follow_up", dot_color: "#f59e0b" },
  { nama_tahap: "Quotation", jenis_tahap: "quotation", dot_color: "#06b6d4" },
  { nama_tahap: "PO", jenis_tahap: "po", dot_color: "#10b981" },
  { nama_tahap: "Revenue", jenis_tahap: "revenue", dot_color: "#22c55e" },
] as const;

const catatanByJenis: Record<string, string> = {
  visit: "Kunjungan awal ke lokasi, perkenalan produk dan company profile.",
  kebutuhan: "Menggali kebutuhan alat, jumlah unit, dan spesifikasi yang diminta.",
  opportunity: "Peluang terkonfirmasi, anggaran tersedia pada periode berjalan.",
  follow_up: "Follow up progres internal pelanggan dan jadwal presentasi demo.",
  quotation: "Penawaran harga resmi dikirimkan beserta brosur dan spesifikasi.",
  po: "Purchase order diterima dari pelanggan, proses pengiriman dijadwalkan.",
  revenue: "Barang diterima, instalasi selesai, invoice diterbitkan dan dibayar.",
};

const pelangganDefs = [
  {
    nama_outlet: "RS Sehat Sentosa", tipe_outlet: "Rumah Sakit", status: "Aktif",
    alamat: "Jl. Dr. Otten No. 12, Bandung, Jawa Barat",
    latitude: -6.9175, longitude: 107.6191,
    kontak: [
      { nama: "dr. Agus Hermawan", jabatan: "Direktur Utama", kategori_peran: "Decision Maker" },
      { nama: "Lilis Suryani", jabatan: "Kepala Pengadaan", kategori_peran: "Influencer" },
    ],
  },
  {
    nama_outlet: "Klinik Pratama Harapan", tipe_outlet: "Klinik", status: "Aktif",
    alamat: "Jl. Cihampelas No. 88, Bandung, Jawa Barat",
    latitude: -6.8932, longitude: 107.6046,
    kontak: [
      { nama: "dr. Fitri Anggraini", jabatan: "Pemilik Klinik", kategori_peran: "Decision Maker" },
      { nama: "Rudi Hartono", jabatan: "Staf Administrasi", kategori_peran: "Gatekeeper" },
    ],
  },
  {
    nama_outlet: "Laboratorium Medika Prima", tipe_outlet: "Laboratorium", status: "Prospek",
    alamat: "Jl. Asia Afrika No. 45, Bandung, Jawa Barat",
    latitude: -6.9211, longitude: 107.6098,
    kontak: [
      { nama: "Yanti Kusumawati", jabatan: "Kepala Laboratorium", kategori_peran: "User" },
      { nama: "Teguh Prasetyo", jabatan: "Manajer Operasional", kategori_peran: "Decision Maker" },
    ],
  },
  {
    nama_outlet: "RSIA Bunda Kasih", tipe_outlet: "Rumah Sakit", status: "Aktif",
    alamat: "Jl. Soekarno Hatta No. 301, Bandung, Jawa Barat",
    latitude: -6.9461, longitude: 107.6377,
    kontak: [
      { nama: "dr. Maya Puspita", jabatan: "Direktur", kategori_peran: "Decision Maker" },
      { nama: "Nanda Wijayanti", jabatan: "Kepala Keperawatan", kategori_peran: "User" },
    ],
  },
  {
    nama_outlet: "RS Medika Utama Jakarta", tipe_outlet: "Rumah Sakit", status: "Aktif",
    alamat: "Jl. Jend. Sudirman Kav. 21, Jakarta Selatan",
    latitude: -6.2253, longitude: 106.8095,
    kontak: [
      { nama: "dr. Bambang Susilo", jabatan: "Direktur Medik", kategori_peran: "Decision Maker" },
      { nama: "Ratna Dewi", jabatan: "Purchasing Manager", kategori_peran: "Influencer" },
    ],
  },
  {
    nama_outlet: "Klinik Sehat Keluarga", tipe_outlet: "Klinik", status: "Prospek",
    alamat: "Jl. Kemang Raya No. 17, Jakarta Selatan",
    latitude: -6.2615, longitude: 106.8133,
    kontak: [
      { nama: "dr. Hendri Gunawan", jabatan: "Dokter Penanggung Jawab", kategori_peran: "Decision Maker" },
      { nama: "Sari Melati", jabatan: "Koordinator Klinik", kategori_peran: "User" },
    ],
  },
  {
    nama_outlet: "Apotek & Alkes Farma Jaya", tipe_outlet: "Apotek", status: "Nonaktif",
    alamat: "Jl. Raya Bekasi KM 18, Jakarta Timur",
    latitude: -6.2149, longitude: 106.9022,
    kontak: [
      { nama: "Joko Widodo Putra", jabatan: "Pemilik", kategori_peran: "Decision Maker" },
      { nama: "Dewi Anjani", jabatan: "Apoteker Penanggung Jawab", kategori_peran: "Influencer" },
    ],
  },
  {
    nama_outlet: "Laboratorium Klinik Nusantara", tipe_outlet: "Laboratorium", status: "Aktif",
    alamat: "Jl. Gatot Subroto No. 64, Jakarta Pusat",
    latitude: -6.2297, longitude: 106.8226,
    kontak: [
      { nama: "dr. Citra Larasati", jabatan: "Kepala Laboratorium", kategori_peran: "Decision Maker" },
      { nama: "Eko Prabowo", jabatan: "Staf Pengadaan", kategori_peran: "Gatekeeper" },
    ],
  },
] as const;

// [pelangganIdx, kontakIdx, salesIdx, stageIdx, status, judul, nilai, prioritas, alasan_lost?]
type TiketSpec = readonly [
  number, number, number, number, "open" | "won" | "lost",
  string, number, "rendah" | "sedang" | "tinggi", string?,
];
const tiketSpecs: TiketSpec[] = [
  [0, 0, 0, 0, "open", "Pengadaan Patient Monitor", 185_000_000, "sedang"],
  [1, 0, 1, 1, "open", "Pengadaan USG 4D", 320_000_000, "tinggi"],
  [2, 0, 0, 2, "open", "Pengadaan Analyzer Hematologi", 275_000_000, "tinggi"],
  [3, 0, 1, 3, "open", "Pengadaan Ventilator ICU", 540_000_000, "tinggi"],
  [4, 1, 2, 4, "open", "Pengadaan Syringe Pump 20 Unit", 160_000_000, "sedang"],
  [5, 0, 3, 5, "open", "Pengadaan Tensimeter Digital 50 Unit", 75_000_000, "rendah"],
  [7, 0, 3, 6, "won", "Pengadaan Autoclave Steril", 210_000_000, "sedang"],
  [0, 1, 0, 6, "won", "Pengadaan ECG 12 Channel", 95_000_000, "rendah"],
  [4, 0, 2, 3, "lost", "Pengadaan X-Ray Mobile", 690_000_000, "tinggi", "Pelanggan memilih kompetitor dengan harga lebih rendah."],
  [3, 1, 1, 4, "lost", "Pengadaan Bed Pasien Elektrik", 380_000_000, "sedang", "Anggaran pelanggan dibekukan sampai tahun depan."],
  [6, 0, 2, 2, "open", "Pengadaan Defibrillator", 145_000_000, "tinggi"],
  [1, 1, 1, 5, "open", "Pengadaan Oksimeter Portable", 48_000_000, "rendah"],
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  if (process.env.NODE_ENV === "production" && !process.argv.includes("--force")) {
    throw new Error("Refusing to wipe a production database. Pass --force to override.");
  }

  console.log("Wiping existing data...");
  await wipe();

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  // ---- Squad & User ------------------------------------------------------
  const squadBandung = randomUUID();
  const squadJakarta = randomUUID();

  const squads: Prisma.SquadCreateManyInput[] = [
    { id_squad: squadBandung, nama_squad: "Squad Bandung", kode_squad: "SQ-BDG", wilayah: "Bandung & Jawa Barat" },
    { id_squad: squadJakarta, nama_squad: "Squad Jakarta", kode_squad: "SQ-JKT", wilayah: "Jabodetabek" },
  ];

  const idDirector = randomUUID();
  const idMgrBdg = randomUUID();
  const idMgrJkt = randomUUID();
  const salesIds = [randomUUID(), randomUUID(), randomUUID(), randomUUID()];

  const users: Prisma.UserCreateManyInput[] = [
    { id_user: idDirector, nama: "Hendra Wijaya", role: "director", email: "director@abmedical.test", no_telp: "081200000001", password_hash: passwordHash },
    { id_user: idMgrBdg, id_squad: squadBandung, nama: "Rina Kusuma", role: "sales_manager", email: "manager.bandung@abmedical.test", no_telp: "081200000002", password_hash: passwordHash },
    { id_user: idMgrJkt, id_squad: squadJakarta, nama: "Dimas Pratama", role: "sales_manager", email: "manager.jakarta@abmedical.test", no_telp: "081200000003", password_hash: passwordHash },
    { id_user: salesIds[0]!, id_squad: squadBandung, nama: "Andi Saputra", role: "sales", email: "andi@abmedical.test", no_telp: "081200000011", password_hash: passwordHash },
    { id_user: salesIds[1]!, id_squad: squadBandung, nama: "Siti Rahma", role: "sales", email: "siti@abmedical.test", no_telp: "081200000012", password_hash: passwordHash },
    { id_user: salesIds[2]!, id_squad: squadJakarta, nama: "Budi Santoso", role: "sales", email: "budi@abmedical.test", no_telp: "081200000013", password_hash: passwordHash },
    { id_user: salesIds[3]!, id_squad: squadJakarta, nama: "Maya Lestari", role: "sales", email: "maya@abmedical.test", no_telp: "081200000014", password_hash: passwordHash },
  ];

  // ---- Tahap Kanban ------------------------------------------------------
  const tahap: Prisma.TahapKanbanCreateManyInput[] = tahapDefs.map((t, i) => ({
    id_tahap: randomUUID(),
    nama_tahap: t.nama_tahap,
    urutan: i + 1,
    jenis_tahap: t.jenis_tahap,
    is_tahap_akhir: i === tahapDefs.length - 1,
    is_aktif: true,
    dot_color: t.dot_color,
  }));

  // ---- Pelanggan & Kontak ------------------------------------------------
  const pelanggan: Prisma.PelangganCreateManyInput[] = [];
  const kontak: Prisma.KontakCreateManyInput[] = [];
  const kontakIdsByPelanggan: string[][] = [];

  pelangganDefs.forEach((p, i) => {
    const idPelanggan = randomUUID();
    pelanggan.push({
      id_pelanggan: idPelanggan,
      nama_outlet: p.nama_outlet,
      tipe_outlet: p.tipe_outlet,
      alamat: p.alamat,
      latitude: p.latitude,
      longitude: p.longitude,
      radius_kunjungan: 200, // meters (adjust if your app uses km)
      img_url: `https://placehold.co/600x400?text=${encodeURIComponent(p.nama_outlet)}`,
      status: p.status,
    });
    const ids: string[] = [];
    p.kontak.forEach((k, j) => {
      const id = randomUUID();
      ids.push(id);
      kontak.push({
        id_kontak: id,
        id_pelanggan: idPelanggan,
        nama: k.nama,
        jabatan: k.jabatan,
        no_telp: `0812${pad(i * 10 + j + 1000, 8)}`,
        email: `${k.nama.toLowerCase().replace(/[^a-z]+/g, ".").replace(/^\.|\.$/g, "")}@example.test`,
        kategori_peran: k.kategori_peran,
        inisial: initials(k.nama.replace(/^dr\.\s*/i, "")),
      });
    });
    kontakIdsByPelanggan.push(ids);
  });

  // ---- Tiket + children --------------------------------------------------
  const tiket: Prisma.TiketCreateManyInput[] = [];
  const riwayat: Prisma.RiwayatTahapCreateManyInput[] = [];
  const aktivitas: Prisma.AktivitasCreateManyInput[] = [];
  const evidence: Prisma.EvidenceCreateManyInput[] = [];
  const bukti: Prisma.BuktiKunjunganCreateManyInput[] = [];
  const penawaran: Prisma.PenawaranCreateManyInput[] = [];
  const purchaseOrder: Prisma.PurchaseOrderCreateManyInput[] = [];
  const notifikasi: Prisma.NotifikasiCreateManyInput[] = [];

  const posisiCounter: number[] = tahap.map(() => 0);
  let penawaranNo = 1;
  let poNo = 1;

  tiketSpecs.forEach((spec, i) => {
    const [pIdx, kIdx, sIdx, stageIdx, status, judul, nilai, prioritas, alasanLost] = spec;
    const pel = must(pelanggan[pIdx]);
    const pelDef = must(pelangganDefs[pIdx]);
    const idTiket = randomUUID();
    const idUser = must(salesIds[sIdx]);
    const idKontak = must(kontakIdsByPelanggan[pIdx]?.[kIdx]);
    const currentTahap = must(tahap[stageIdx]);

    // timeline: ticket created `start` days ago, each stage `step` days apart
    const start = 75 - i * 5;
    const step = Math.max(1, Math.floor(start / 8));
    const at = (k: number) => daysAgo(start - k * step);

    posisiCounter[stageIdx] = (posisiCounter[stageIdx] ?? 0) + 1;

    const closed = status !== "open";
    tiket.push({
      id_tiket: idTiket,
      id_pelanggan: must(pel.id_pelanggan),
      id_user: idUser,
      id_tahap: must(currentTahap.id_tahap),
      id_kontak: idKontak,
      judul,
      estimasi_nilai: nilai,
      estimasi_closing: closed ? at(stageIdx) : daysFromNow(14 + i * 3),
      status,
      kebutuhan_pelanggan: `${judul} untuk ${pel.nama_outlet}.`,
      prioritas,
      posisi: posisiCounter[stageIdx]!,
      tanggal_penawaran_awal: stageIdx >= 4 ? at(4) : null,
      tanggal_closing: closed ? at(stageIdx) : null,
      alasan_lost: status === "lost" ? (alasanLost ?? "Tidak ada alasan tercatat.") : null,
      created_at: at(0),
    });

    const aktivitasIdByStage: string[] = [];

    for (let k = 0; k <= stageIdx; k++) {
      const t = must(tahap[k]);
      const jenis = must(t.jenis_tahap);

      // Riwayat tahap
      riwayat.push({
        id_riwayat: randomUUID(),
        id_tiket: idTiket,
        id_tahap_asal: k === 0 ? null : must(tahap[k - 1]).id_tahap,
        id_tahap_tujuan: must(t.id_tahap),
        id_user: idUser,
        waktu_pindah: at(k),
      });

      // Aktivitas
      const idAkt = randomUUID();
      aktivitasIdByStage.push(idAkt);
      aktivitas.push({
        id_aktivitas: idAkt,
        id_user: idUser,
        id_tiket: idTiket,
        tanggal: at(k),
        catatan: catatanByJenis[jenis] ?? "",
        jenis_kegiatan: jenis,
        jadwal_follow_up: jenis === "follow_up" && status === "open" ? daysFromNow(3 + i) : null,
        created_at: at(k),
      });

      // Bukti kunjungan + evidence on visit
      if (jenis === "visit") {
        const outOfRadius = i % 5 === 4;
        const off = outOfRadius ? 0.003 : 0.0004;
        const lat = pelDef.latitude + off;
        const lon = pelDef.longitude + off;
        const jarak = distanceMeters(pelDef.latitude, pelDef.longitude, lat, lon);
        bukti.push({
          id_bukti: randomUUID(),
          id_aktivitas: idAkt,
          latitude: lat,
          longitude: lon,
          jarak_klien: Math.round(jarak * 10) / 10,
          dalam_radius: jarak <= 200,
          img_url: `https://placehold.co/800x600?text=Kunjungan+${pad(i + 1, 2)}`,
          file_url: null,
          created_at: at(k),
        });
        evidence.push(
          {
            id: randomUUID(), id_aktivitas: idAkt, tipe: "foto",
            nama_file: `kunjungan-${pad(i + 1, 2)}.jpg`, ukuran_file: "1.4 MB",
            deskripsi: "Foto lokasi pelanggan saat kunjungan.",
            url_file: `https://placehold.co/1200x900?text=Foto+${pad(i + 1, 2)}`,
            url_preview: `https://placehold.co/300x200?text=Foto+${pad(i + 1, 2)}`,
            waktu_upload: at(k),
          },
          {
            id: randomUUID(), id_aktivitas: idAkt, tipe: "teks",
            deskripsi: "Ringkasan hasil kunjungan.",
            catatan: "Pelanggan terbuka untuk demo produk pada kunjungan berikutnya.",
            waktu_upload: at(k),
          },
        );
      } else if (jenis === "kebutuhan" || jenis === "quotation") {
        evidence.push({
          id: randomUUID(), id_aktivitas: idAkt, tipe: "dokumen",
          nama_file: jenis === "kebutuhan" ? "spesifikasi-kebutuhan.pdf" : "surat-penawaran.pdf",
          ukuran_file: "820 KB",
          deskripsi: jenis === "kebutuhan" ? "Dokumen spesifikasi kebutuhan pelanggan." : "Salinan surat penawaran.",
          url_file: "https://example.test/files/dokumen.pdf",
          waktu_upload: at(k),
        });
      } else if (jenis === "follow_up") {
        evidence.push({
          id: randomUUID(), id_aktivitas: idAkt, tipe: "audio",
          nama_file: "rekaman-follow-up.m4a", ukuran_file: "2.1 MB", durasi_audio: "03:42",
          deskripsi: "Rekaman percakapan follow up dengan pelanggan.",
          url_file: "https://example.test/files/rekaman.m4a",
          waktu_upload: at(k),
        });
      }
    }

    // Penawaran (reached quotation stage)
    let idPenawaran: string | null = null;
    if (stageIdx >= 4) {
      idPenawaran = randomUUID();
      penawaran.push({
        id_penawaran: idPenawaran,
        id_tiket: idTiket,
        id_aktivitas: must(aktivitasIdByStage[4]),
        no_penawaran: `QT/${YEAR}/${pad(penawaranNo++)}`,
        revisi_ke: i % 3 === 0 ? 1 : 0,
        tanggal_penawaran: at(4),
        total_nilai: nilai,
        status: status === "lost" ? "ditolak" : stageIdx >= 5 ? "disetujui" : "dikirim",
        url_file_penawaran: `https://example.test/files/penawaran-${pad(i + 1, 2)}.pdf`,
        created_at: at(4),
      });
    }

    // Purchase order (reached PO stage)
    if (stageIdx >= 5) {
      const revenue = stageIdx === 6;
      purchaseOrder.push({
        id_po: randomUUID(),
        id_penawaran: idPenawaran,
        id_tiket: idTiket,
        no_po: `PO/${YEAR}/${pad(poNo++)}`,
        tanggal_po: at(5),
        nilai_po: nilai,
        status: revenue ? "selesai" : "diproses",
        url_file_po: `https://example.test/files/po-${pad(i + 1, 2)}.pdf`,
        nilai_revenue: revenue ? nilai : 0,
        tanggal_revenue: revenue ? at(6) : null,
        created_at: at(5),
      });
    }

    // Notifikasi
    notifikasi.push({
      id_notifikasi: randomUUID(),
      id_tiket: idTiket,
      title: `Tiket dipindahkan ke ${currentTahap.nama_tahap}`,
      message: `Tiket "${judul}" (${pel.nama_outlet}) kini berada di tahap ${currentTahap.nama_tahap}.`,
      isRead: i % 2 === 0,
      created_at: at(stageIdx),
    });
    if (status === "open" && stageIdx === 3) {
      notifikasi.push({
        id_notifikasi: randomUUID(),
        id_tiket: idTiket,
        title: "Pengingat follow up",
        message: `Jadwalkan follow up untuk tiket "${judul}".`,
        isRead: false,
      });
    }
  });

  // ---- Insert in FK-safe order ------------------------------------------
  console.log("Inserting...");
  await prisma.squad.createMany({ data: squads });
  await prisma.user.createMany({ data: users });
  await prisma.squad.update({ where: { id_squad: squadBandung }, data: { id_supervisor: idMgrBdg } });
  await prisma.squad.update({ where: { id_squad: squadJakarta }, data: { id_supervisor: idMgrJkt } });
  await prisma.tahapKanban.createMany({ data: tahap });
  await prisma.pelanggan.createMany({ data: pelanggan });
  await prisma.kontak.createMany({ data: kontak });
  await prisma.tiket.createMany({ data: tiket });
  await prisma.riwayatTahap.createMany({ data: riwayat });
  await prisma.aktivitas.createMany({ data: aktivitas });
  await prisma.evidence.createMany({ data: evidence });
  await prisma.buktiKunjungan.createMany({ data: bukti });
  await prisma.penawaran.createMany({ data: penawaran });
  await prisma.purchaseOrder.createMany({ data: purchaseOrder });
  await prisma.notifikasi.createMany({ data: notifikasi });

  console.table({
    squad: squads.length,
    user: users.length,
    tahap_kanban: tahap.length,
    pelanggan: pelanggan.length,
    kontak: kontak.length,
    tiket: tiket.length,
    riwayat_tahap: riwayat.length,
    aktivitas: aktivitas.length,
    evidence: evidence.length,
    bukti_kunjungan: bukti.length,
    penawaran: penawaran.length,
    purchase_order: purchaseOrder.length,
    notifikasi: notifikasi.length,
  });
  console.log(`Done. Login with any seeded email and password: ${SEED_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await prismaPool.end();
  });