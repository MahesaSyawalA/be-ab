-- AlterTable: tambah kolom is_active dan must_change_password di tabel user
ALTER TABLE `user`
    ADD COLUMN `is_active`           BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `must_change_password` BOOLEAN NOT NULL DEFAULT false;

