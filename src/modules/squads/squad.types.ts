export interface Squad {
    id_squad: string;
    id_supervisor: string;
    nama_squad: string;
    kode_squad: string;
    wilayah: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateSquadInput {
    id_supervisor: string;
    nama_squad: string;
    kode_squad: string;
    wilayah: string;
    is_active: boolean;
}