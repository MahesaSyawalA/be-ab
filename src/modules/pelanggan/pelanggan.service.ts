import { HttpError } from "../../common/utils/http-error.ts";
import { isSafeImageFile } from "../../common/utils/validation.ts";
import { buildMeta } from "../../common/pagination/pagination.utils.ts";
import type { PaginationParams } from "../../common/pagination/pagination.types.ts";
import { deleteFromR2, uploadToR2 } from "../../config/storage.ts";
import { pelangganRepository } from "./pelanggan.repository.ts";
import type {
  Pelanggan,
  PelangganFilters,
  PelangganWithDetails,
  CreatePelangganInput,
  UpdatePelangganInput,
} from "./pelanggan.types.ts";

const IMAGE_FOLDER = "pelanggan";

async function storeImage(file: Express.Multer.File): Promise<string> {
  if (!isSafeImageFile(file.mimetype, file.originalname)) {
    throw new HttpError(
      400,
      "File harus berupa gambar JPG, PNG, WebP, atau GIF (SVG tidak diperbolehkan)."
    );
  }
  return uploadToR2(file, IMAGE_FOLDER);
}

async function removeImageQuietly(url: string | null | undefined): Promise<void> {
  try {
    await deleteFromR2(url);
  } catch (error) {
    console.error(`Gagal menghapus gambar R2 (${url}):`, error);
  }
}

export const pelangganService = {
  async create(
    data: CreatePelangganInput,
    file?: Express.Multer.File,
  ): Promise<PelangganWithDetails> {
    if (!file) {
      throw new HttpError(400, "Gambar outlet/faskes wajib diunggah.");
    }

    const img_url = await storeImage(file);

    try {
      return await pelangganRepository.create({ ...data, img_url });
    } catch (error) {
      await removeImageQuietly(img_url);
      throw error;
    }
  },

  async getAll(filters: PelangganFilters, pagination: PaginationParams) {
    const { items, total } = await pelangganRepository.getAll(filters, pagination);
    return { data: items, meta: buildMeta(total, pagination) };
  },

  async getById(id: string): Promise<PelangganWithDetails | null> {
    return pelangganRepository.getById(id);
  },

  async update(
    id: string,
    data: UpdatePelangganInput,
    file?: Express.Multer.File,
  ): Promise<Pelanggan | null> {
    const existing = await pelangganRepository.getById(id);
    if (!existing) return null;

    const img_url = file ? await storeImage(file) : undefined;

    let updated: Pelanggan | null;
    try {
      updated = await pelangganRepository.update(id, { ...data, img_url });
    } catch (error) {
      await removeImageQuietly(img_url);
      throw error;
    }

    if (!updated) {
      await removeImageQuietly(img_url);
      return null;
    }

    if (img_url) await removeImageQuietly(existing.img_url);
    return updated;
  },

  async delete(id: string): Promise<Pelanggan | null> {
    const deleted = await pelangganRepository.delete(id);
    if (deleted) await removeImageQuietly(deleted.img_url);
    return deleted;
  },
};