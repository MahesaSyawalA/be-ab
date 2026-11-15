-- AlterTable: tambah nilai 'admin' pada enum UserRole di tabel user
ALTER TABLE `user`
    MODIFY COLUMN `role` ENUM('sales', 'sales_manager', 'director', 'admin') NOT NULL;
