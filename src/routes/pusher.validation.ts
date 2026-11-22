import { z } from "zod";
import { optionalString, requiredString } from "../common/utils/validation.ts";

export const createPusherMessageSchema = z.object({
  roomId: requiredString("Room ID", 100),
  text: requiredString("Pesan", 2000),
  user: requiredString("User", 150),
  socketId: optionalString("Socket ID", 100),
});

export type CreatePusherMessageBody = z.infer<typeof createPusherMessageSchema>;
