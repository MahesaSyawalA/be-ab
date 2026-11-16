-- AlterTable: tambah kolom token_version di tabel user
ALTER TABLE `user`
    ADD COLUMN `token_version` INT NOT NULL DEFAULT 0;
