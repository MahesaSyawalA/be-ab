-- Penerima notifikasi. Nullable: baris lama tidak punya penerima.
ALTER TABLE `notifikasi` ADD COLUMN `id_user` VARCHAR(36) NULL;

CREATE INDEX `notifikasi_id_user_created_at_idx` ON `notifikasi`(`id_user`, `created_at`);

ALTER TABLE `notifikasi` ADD CONSTRAINT `notifikasi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
