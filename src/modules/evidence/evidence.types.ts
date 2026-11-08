export type JenisEvidence = "foto" | "audio" | "dokumen" | "teks";

export interface Evidence {
    id: string;
    id_aktivitas: string;
    tipe: JenisEvidence;
    nama_file: string | null;
    ukuran_file: string | null;
    durasi_audio: string | null;
    deskripsi: string;
    catatan: string | null;
    url_file: string | null;
    url_preview: string | null;
    waktu_upload: Date | string | null;
}

export interface CreateEvidenceInput {
    id_aktivitas: string;
    tipe: JenisEvidence;
    durasi_audio?: string | null;
    deskripsi: string;
    catatan?: string | null;
}

export type UpdateEvidenceInput = Partial<CreateEvidenceInput>;

export interface EvidenceFileFields {
    nama_file?: string | null;
    ukuran_file?: string | null;
    url_file?: string | null;
    url_preview?: string | null;
    waktu_upload?: Date | null;
}

export type CreateEvidenceData = CreateEvidenceInput & EvidenceFileFields;
export type UpdateEvidenceData = UpdateEvidenceInput & EvidenceFileFields;

export type UploadedFile = Express.Multer.File;

export interface EvidenceFilters {
    id_aktivitas?: string;
    tipe?: JenisEvidence;
    search?: string;
}