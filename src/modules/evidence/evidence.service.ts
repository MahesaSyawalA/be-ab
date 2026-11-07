import { deleteFromR2, uploadToR2 } from "../../config/storage.ts";
import { HttpError } from "../../common/utils/http-error.ts";
import { evidenceRepository } from "./evidence.repository.ts";
import type {
    CreateEvidenceInput,
    Evidence,
    EvidenceFileFields,
    EvidenceFilters,
    JenisEvidence,
    UpdateEvidenceInput,
    UploadedFile,
} from "./evidence.types.ts";

const DOCUMENT_MIMES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
]);

const MIME_RULES: Record<Exclude<JenisEvidence, "teks">, (mime: string) => boolean> = {
    foto: (mime) => mime.startsWith("image/"),
    audio: (mime) => mime.startsWith("audio/"),
    dokumen: (mime) => DOCUMENT_MIMES.has(mime),
};

const CLEARED_FILE: EvidenceFileFields = {
    nama_file: null,
    ukuran_file: null,
    url_file: null,
    url_preview: null,
};

async function guardAktivitasExists<T>(action: () => Promise<T>): Promise<T> {
    try {
        return await action();
    } catch (error) {
        if ((error as { code?: string }).code === "P2003") {
            throw new HttpError(404, "Aktivitas tidak ditemukan.");
        }
        throw error;
    }
}

function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function storeFile(idAktivitas: string, tipe: JenisEvidence, file: UploadedFile): Promise<EvidenceFileFields> {
    if (tipe === "teks") {
        throw new HttpError(400, "Evidence bertipe teks tidak boleh disertai file.");
    }
    if (!MIME_RULES[tipe](file.mimetype)) {
        throw new HttpError(400, `Format file tidak sesuai untuk tipe ${tipe}.`);
    }

    const url = await uploadToR2(file, `evidence/${idAktivitas}`);

    return {
        nama_file: file.originalname.slice(0, 255),
        ukuran_file: formatBytes(file.size),
        url_file: url,
        url_preview: tipe === "foto" ? url : null,
        waktu_upload: new Date(),
    };
}

async function removeFileQuietly(url: string | null | undefined): Promise<void> {
    try {
        await deleteFromR2(url);
    } catch (error) {
        console.error(`Gagal menghapus file R2 (${url}):`, error);
    }
}

export const evidenceService = {
    async create(data: CreateEvidenceInput, file?: UploadedFile): Promise<Evidence> {
        if (data.tipe !== "teks" && !file) {
            throw new HttpError(400, `File wajib diunggah untuk tipe ${data.tipe}.`);
        }

        const fileData: EvidenceFileFields = file
            ? await storeFile(data.id_aktivitas, data.tipe, file)
            : { waktu_upload: new Date() };

        try {
            return await guardAktivitasExists(() => evidenceRepository.create({ ...data, ...fileData }));
        } catch (error) {
            await removeFileQuietly(fileData.url_file);
            throw error;
        }
    },

    getAll: (filters?: EvidenceFilters): Promise<Evidence[]> => evidenceRepository.getAll(filters),

    getById: (id: string): Promise<Evidence | null> => evidenceRepository.getById(id),

    getByAktivitasId: (idAktivitas: string): Promise<Evidence[]> =>
        evidenceRepository.getByAktivitasId(idAktivitas),

    async update(id: string, data: UpdateEvidenceInput, file?: UploadedFile): Promise<Evidence | null> {
        const existing = await evidenceRepository.getById(id);
        if (!existing) return null;

        const tipe = data.tipe ?? existing.tipe;
        const idAktivitas = data.id_aktivitas ?? existing.id_aktivitas;
        const tipeChanged = data.tipe !== undefined && data.tipe !== existing.tipe;

        let fileData: EvidenceFileFields = {};
        if (file) {
            fileData = await storeFile(idAktivitas, tipe, file);
        } else if (tipe === "teks") {
            fileData = CLEARED_FILE;
        } else if (tipeChanged) {
            throw new HttpError(400, `Unggah file baru saat mengubah tipe menjadi ${tipe}.`);
        }

        let updated: Evidence | null;
        try {
            updated = await guardAktivitasExists(() => evidenceRepository.update(id, { ...data, ...fileData }));
        } catch (error) {
            if (file) await removeFileQuietly(fileData.url_file);
            throw error;
        }

        if (!updated) {
            if (file) await removeFileQuietly(fileData.url_file);
            return null;
        }

        if (existing.url_file && existing.url_file !== updated.url_file) {
            await removeFileQuietly(existing.url_file);
        }
        return updated;
    },

    async delete(id: string): Promise<boolean> {
        const existing = await evidenceRepository.getById(id);
        if (!existing) return false;

        const deleted = await evidenceRepository.delete(id);
        if (deleted) await removeFileQuietly(existing.url_file);
        return deleted;
    },
};