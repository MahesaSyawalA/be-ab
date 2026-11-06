// src/routes/messages.ts
import { Router, type Request, type Response } from "express";
import { pusher } from "../lib/pusher.ts";

const router = Router();

interface CreateMessageBody {
  roomId: string;
  text: string;
  user: string;
  socketId?: string;
}

interface NewMessageEvent {
  text: string;
  user: string;
  createdAt: string;
}

router.post(
  "/messages",
  async (req: Request<{}, {}, CreateMessageBody>, res: Response) => {
    const { roomId, text, user, socketId } = req.body;

    const payload: NewMessageEvent = {
      text,
      user,
      createdAt: new Date().toISOString(),
    };

    try {
      await pusher.trigger(`chat-${roomId}`, "new-message", payload, {
        socket_id: socketId,
      });
      res.status(201).json({ success: true });
    } catch (err) {
      console.error("Pusher error:", err);
      res.status(500).json({ error: "Failed to send event" });
    }
  }
);

router.get("/health", async (_req, res) => {
  try {
    const result = await pusher.get({ path: "/channels" });
    res.status(result.status).json(await result.json());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot reach Pusher" });
  }
});

export default router;