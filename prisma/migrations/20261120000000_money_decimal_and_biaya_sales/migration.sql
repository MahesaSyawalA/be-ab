-- Uang disimpan sebagai DECIMAL agar kalkulasi revenue/ROI tidak kena error pembulatan float.
ALTER TABLE `tiket` MODIFY `estimasi_nilai` DECIMAL(18, 2) NOT NULL;
ALTER TABLE `penawaran` MODIFY `total_nilai` DECIMAL(18, 2) NOT NULL;
ALTER TABLE `purchase_order` MODIFY `nilai_po` DECIMAL(18, 2) NOT NULL,
    MODIFY `nilai_revenue` DECIMAL(18, 2) NOT NULL;

-- Gaji/biaya bulanan sales, dasar perhitungan ROI di dashboard direktur.
ALTER TABLE `user` ADD COLUMN `biaya_bulanan` DECIMAL(18, 2) NULL;
