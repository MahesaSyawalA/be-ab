import { z } from "zod";

export const createSquadSchema =  z.object({
    id_supervisor: z.uuidv4(),
    nama_squad: z.string(),
    kode_squad: z.string(),
    wilayah: z.string(),
    is_active: z.boolean(),
})