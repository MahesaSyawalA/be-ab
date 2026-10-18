import { prisma } from "../../config/prisma.ts";
import type { User } from "../users/users.types.ts";

export const authRepository = {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findById(idUser: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id_user: idUser },
    });
  },
};
