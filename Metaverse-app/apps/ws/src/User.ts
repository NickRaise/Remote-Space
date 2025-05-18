import { WebSocket } from "ws";
import { generateUserId } from "./utils";
import { userJoinEvent, userMoveEvent } from "./controllers/userControllers";

export class User {
  ws: WebSocket;
  id: string;
  x?: number;
  y?: number;
  spaceId?: string

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.id = generateUserId();
  }

  initHandlers() {
    this.ws.on("message", async (data) => {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join":
          await userJoinEvent(parsedData.payload, this);

        case "move":
            await userMoveEvent(parsedData.payload, this)
        
      }
    });
  }

  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
}
