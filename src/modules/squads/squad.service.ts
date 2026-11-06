import { HttpError } from "../../common/utils/http-error.ts";
import { squadRepository } from "./squad.repository.ts";
import type { CreateSquadInput, SquadWithDetails, UpdateSquadInput } from "./squad.types.ts";

/** Prisma P2002 = unique constraint (`kode_squad`) dilanggar. */
async function guardUniqueKode<T>(action: () => Promise<T>): Promise<T> {
    try {
        return await action();
    } catch (error) {
        if ((error as { code?: string }).code === "P2002") {
            throw new HttpError(409, "Kode squad sudah digunakan.");
        }
        throw error;
    }
}

export const squadService = {
    create: (data: CreateSquadInput): Promise<SquadWithDetails> =>
        guardUniqueKode(() => squadRepository.create(data)),

    getAll: (): Promise<SquadWithDetails[]> => squadRepository.getAll(),

    getById: (id: string): Promise<SquadWithDetails | null> => squadRepository.getById(id),

    getBySupervisorId: (idSupervisor: string): Promise<SquadWithDetails[]> =>
        squadRepository.getBySupervisorId(idSupervisor),

    update: (id: string, data: UpdateSquadInput): Promise<SquadWithDetails | null> =>
        guardUniqueKode(() => squadRepository.update(id, data)),

    delete: (id: string): Promise<boolean> => squadRepository.delete(id),
};
