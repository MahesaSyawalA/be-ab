import type { Request, Response } from "express";
import { buktiKunjunganService } from "./bukti-kunjungan.service.ts";
import { buktiKunjunganQuerySchema } from "./bukti-kunjungan.validation.ts";
import type {
  CreateBuktiKunjunganInput,
  UpdateBuktiKunjunganInput,
} from "./bukti-kunjungan.types.ts";

import { uploadToR2, deleteFromR2 } from "../../config/storage.ts";

type UploadedFiles = {
  img_url?: Express.Multer.File[];
  file_url?: Express.Multer.File[];
};

export const buktiKunjunganController = {
  async create(req: Request, res: Response) {
    const files = req.files as UploadedFiles | undefined;
    const image = files?.img_url?.[0];
    const doc = files?.file_url?.[0];

    if (!image) {
      res.status(400).json({ message: "image is required." });
      return;
    }

    const [img_url, file_url] = await Promise.all([
      uploadToR2(image, "bukti-kunjungan/images"),
      doc ? uploadToR2(doc, "bukti-kunjungan/files") : Promise.resolve(undefined),
    ]);

    const data: CreateBuktiKunjunganInput = {
      id_aktivitas: req.body.id_aktivitas,
      longitude: Number(req.body.longitude),
      latitude: Number(req.body.latitude),
      jarak_klien: Number(req.body.jarak_klien),
      dalam_radius: req.body.dalam_radius,
      img_url,
      file_url,
    };

    const bukti = await buktiKunjunganService.create(data);
    res.status(201).json({
      message: "Bukti Kunjungan created successfully.",
      data: bukti,
    });
  },

  async getAll(req: Request, res: Response) {
    const parsed = buktiKunjunganQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Query tidak valid",
      });
      return;
    }

    const { page, limit, order, ...filters } = parsed.data;
    const { data, meta } = await buktiKunjunganService.getAll(filters, { page, limit, order });

    res.status(200).json({ data, meta });
  },

  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const bukti = await buktiKunjunganService.getById(id);

    if (!bukti) {
      res.status(404).json({
        message: "Bukti Kunjungan not found.",
      });
      return;
    }

    res.status(200).json({
      data: bukti,
    });
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const files = req.files as UploadedFiles | undefined;
    const image = files?.img_url?.[0];
    const doc = files?.file_url?.[0];

    const existing = await buktiKunjunganService.getById(id);
    if (!existing) {
      res.status(404).json({ message: "Bukti Kunjungan not found." });
      return;
    }

    const data: UpdateBuktiKunjunganInput = {};
    const b = req.body;
    if (b.id_aktivitas !== undefined) data.id_aktivitas = b.id_aktivitas;
    if (b.longitude !== undefined) data.longitude = Number(b.longitude);
    if (b.latitude !== undefined) data.latitude = Number(b.latitude);
    if (b.jarak_klien !== undefined) data.jarak_klien = Number(b.jarak_klien);
    if (b.dalam_radius !== undefined) data.dalam_radius = b.dalam_radius;

    if (image) data.img_url = await uploadToR2(image, "bukti-kunjungan/images");
    if (doc) data.file_url = await uploadToR2(doc, "bukti-kunjungan/files");

    const bukti = await buktiKunjunganService.update(id, data);

    if (image) await deleteFromR2(existing.img_url);
    if (doc) await deleteFromR2(existing.file_url);

    res.status(200).json({
      message: "Bukti Kunjungan updated successfully.",
      data: bukti,
    });
  },

  async delete(req: Request, res: Response) {
    const id = req.params.id as string;
    const existing = await buktiKunjunganService.getById(id);
    if (!existing) {
      res.status(404).json({ message: "Bukti Kunjungan not found." });
      return;
    }

    await buktiKunjunganService.delete(id);
    await Promise.all([
      deleteFromR2(existing.img_url),
      deleteFromR2(existing.file_url),
    ]);

    res.status(200).json({ message: "Bukti Kunjungan deleted successfully." });
  },
};