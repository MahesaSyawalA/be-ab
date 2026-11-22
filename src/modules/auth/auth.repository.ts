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

  async updatePassword(
    idUser: string,
    data: { password_hash: string; must_change_password: boolean },
  ): Promise<User> {
    return prisma.user.update({
      where: { id_user: idUser },
      data: {
        password_hash: data.password_hash,
        must_change_password: data.must_change_password,
        token_version: { increment: 1 },
      },
    });
  },
};