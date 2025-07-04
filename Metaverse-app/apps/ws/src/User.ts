import { WebSocket } from "ws";
import { generateUserId } from "./utils";
import {
  removeUser,
  userJoinEvent,
  userMoveEvent,
} from "./controllers/userControllers";
import { Space } from "@repo/common/schema-types";

export class User {
  ws: WebSocket;
  id: string;
  x?: number;
  y?: number;
  spaceId?: string;
  userId?: string;
  joinedSpace?: Space;
  validPositionsSet?: Set<string>;

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
          break;

        case "movement":
          await userMoveEvent(parsedData.payload, this);
          break;

        default:
          this.send({ message: "Invalid event" });
      }
    });
  }

  destroy() {
    removeUser(this);
  }

  send(payload: any) {
    this.ws.send(JSON.stringify(payload));
  }
}
