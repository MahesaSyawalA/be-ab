-- CreateTable
CREATE TABLE `squad` (
    `id_squad` VARCHAR(36) NOT NULL,
    `id_supervisor` VARCHAR(36) NULL,
    `nama_squad` VARCHAR(100) NOT NULL,
    `kode_squad` VARCHAR(50) NOT NULL,
    `wilayah` VARCHAR(100) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `squad_kode_squad_key`(`kode_squad`),
    PRIMARY KEY (`id_squad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id_user` VARCHAR(36) NOT NULL,
    `id_squad` VARCHAR(36) NULL,
    `nama` VARCHAR(150) NOT NULL,
    `role` ENUM('sales', 'sales_manager', 'director') NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `no_telp` VARCHAR(20) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelanggan` (
    `id_pelanggan` VARCHAR(36) NOT NULL,
    `nama_faskes` VARCHAR(150) NOT NULL,
    `tipe_faskes` VARCHAR(50) NOT NULL,
    `alamat` TEXT NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `radius_kunjungan` DOUBLE NOT NULL,
    `img_url` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_pelanggan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kontak` (
    `id_kontak` VARCHAR(36) NOT NULL,
    `id_pelanggan` VARCHAR(36) NOT NULL,
    `nama` VARCHAR(150) NOT NULL,
    `jabatan` VARCHAR(100) NOT NULL,
    `no_telp` VARCHAR(20) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_kontak`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tahap_kanban` (
    `id_tahap` VARCHAR(36) NOT NULL,
    `nama_tahap` VARCHAR(100) NOT NULL,
    `urutan` INTEGER NOT NULL,
    `jenis_tahap` ENUM('visit', 'kebutuhan', 'opportunity', 'follow_up', 'quotation', 'po', 'revenue') NOT NULL,
    `is_tahap_akhir` BOOLEAN NOT NULL DEFAULT false,
    `is_aktif` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id_tahap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tiket` (
    `id_tiket` VARCHAR(36) NOT NULL,
    `id_pelanggan` VARCHAR(36) NOT NULL,
    `id_user` VARCHAR(36) NOT NULL,
    `id_tahap` VARCHAR(36) NOT NULL,
    `id_kontak` VARCHAR(36) NULL,
    `judul` VARCHAR(200) NOT NULL,
    `estimasi_nilai` DOUBLE NOT NULL,
    `estimasi_closing` DATETIME(3) NOT NULL,
    `status` ENUM('open', 'won', 'lost') NOT NULL,
    `kebutuhan_pelanggan` TEXT NOT NULL,
    `prioritas` ENUM('rendah', 'sedang', 'tinggi') NOT NULL,
    `posisi` INTEGER NOT NULL,
    `tanggal_penawaran_awal` DATETIME(3) NULL,
    `tanggal_closing` DATETIME(3) NULL,
    `alasan_lost` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_tiket`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat_tahap` (
    `id_riwayat` VARCHAR(36) NOT NULL,
    `id_tiket` VARCHAR(36) NOT NULL,
    `id_tahap_asal` VARCHAR(36) NULL,
    `id_tahap_tujuan` VARCHAR(36) NOT NULL,
    `id_user` VARCHAR(36) NOT NULL,
    `waktu_pindah` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_riwayat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aktivitas` (
    `id_aktivitas` VARCHAR(36) NOT NULL,
    `id_user` VARCHAR(36) NOT NULL,
    `id_tiket` VARCHAR(36) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `catatan` TEXT NOT NULL,
    `jenis_kegiatan` ENUM('kunjungan', 'follow_up', 'penawaran', 'closing') NOT NULL,
    `jadwal_follow_up` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_aktivitas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bukti_kunjungan` (
    `id_bukti` VARCHAR(36) NOT NULL,
    `id_aktivitas` VARCHAR(36) NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `jarak_klien` DOUBLE NOT NULL,
    `dalam_radius` BOOLEAN NOT NULL,
    `img_url` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_bukti`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penawaran` (
    `id_penawaran` VARCHAR(36) NOT NULL,
    `id_tiket` VARCHAR(36) NOT NULL,
    `id_aktivitas` VARCHAR(36) NULL,
    `no_penawaran` VARCHAR(100) NOT NULL,
    `revisi_ke` INTEGER NOT NULL DEFAULT 0,
    `tanggal_penawaran` DATETIME(3) NOT NULL,
    `total_nilai` DOUBLE NOT NULL,
    `status` ENUM('draft', 'dikirim', 'disetujui', 'ditolak') NOT NULL,
    `url_file_penawaran` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `penawaran_no_penawaran_key`(`no_penawaran`),
    PRIMARY KEY (`id_penawaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_order` (
    `id_po` VARCHAR(36) NOT NULL,
    `id_penawaran` VARCHAR(36) NULL,
    `id_tiket` VARCHAR(36) NOT NULL,
    `no_po` VARCHAR(100) NOT NULL,
    `tanggal_po` DATETIME(3) NOT NULL,
    `nilai_po` DOUBLE NOT NULL,
    `status` ENUM('diterima', 'diproses', 'selesai', 'dibatalkan') NOT NULL,
    `url_file_po` TEXT NOT NULL,
    `nilai_revenue` DOUBLE NOT NULL,
    `tanggal_revenue` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `purchase_order_no_po_key`(`no_po`),
    PRIMARY KEY (`id_po`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifikasi` (
    `id_notifikasi` VARCHAR(36) NOT NULL,
    `id_tiket` VARCHAR(36) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `message` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_notifikasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `squad` ADD CONSTRAINT `squad_id_supervisor_fkey` FOREIGN KEY (`id_supervisor`) REFERENCES `user`(`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_id_squad_fkey` FOREIGN KEY (`id_squad`) REFERENCES `squad`(`id_squad`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kontak` ADD CONSTRAINT `kontak_id_pelanggan_fkey` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan`(`id_pelanggan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tiket` ADD CONSTRAINT `tiket_id_pelanggan_fkey` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan`(`id_pelanggan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tiket` ADD CONSTRAINT `tiket_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tiket` ADD CONSTRAINT `tiket_id_tahap_fkey` FOREIGN KEY (`id_tahap`) REFERENCES `tahap_kanban`(`id_tahap`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tiket` ADD CONSTRAINT `tiket_id_kontak_fkey` FOREIGN KEY (`id_kontak`) REFERENCES `kontak`(`id_kontak`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_tahap` ADD CONSTRAINT `riwayat_tahap_id_tiket_fkey` FOREIGN KEY (`id_tiket`) REFERENCES `tiket`(`id_tiket`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_tahap` ADD CONSTRAINT `riwayat_tahap_id_tahap_asal_fkey` FOREIGN KEY (`id_tahap_asal`) REFERENCES `tahap_kanban`(`id_tahap`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_tahap` ADD CONSTRAINT `riwayat_tahap_id_tahap_tujuan_fkey` FOREIGN KEY (`id_tahap_tujuan`) REFERENCES `tahap_kanban`(`id_tahap`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_tahap` ADD CONSTRAINT `riwayat_tahap_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aktivitas` ADD CONSTRAINT `aktivitas_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `aktivitas` ADD CONSTRAINT `aktivitas_id_tiket_fkey` FOREIGN KEY (`id_tiket`) REFERENCES `tiket`(`id_tiket`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bukti_kunjungan` ADD CONSTRAINT `bukti_kunjungan_id_aktivitas_fkey` FOREIGN KEY (`id_aktivitas`) REFERENCES `aktivitas`(`id_aktivitas`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penawaran` ADD CONSTRAINT `penawaran_id_tiket_fkey` FOREIGN KEY (`id_tiket`) REFERENCES `tiket`(`id_tiket`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penawaran` ADD CONSTRAINT `penawaran_id_aktivitas_fkey` FOREIGN KEY (`id_aktivitas`) REFERENCES `aktivitas`(`id_aktivitas`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order` ADD CONSTRAINT `purchase_order_id_penawaran_fkey` FOREIGN KEY (`id_penawaran`) REFERENCES `penawaran`(`id_penawaran`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `purchase_order` ADD CONSTRAINT `purchase_order_id_tiket_fkey` FOREIGN KEY (`id_tiket`) REFERENCES `tiket`(`id_tiket`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasi` ADD CONSTRAINT `notifikasi_id_tiket_fkey` FOREIGN KEY (`id_tiket`) REFERENCES `tiket`(`id_tiket`) ON DELETE CASCADE ON UPDATE CASCADE;
