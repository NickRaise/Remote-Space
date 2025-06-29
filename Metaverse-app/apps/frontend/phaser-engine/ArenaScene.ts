import {
  JOIN,
  SPACE_JOINED,
  TILE_IMAGE_URL,
  TILE_SIZE,
  WS_SERVER_URL,
} from "@/lib/constant";
import * as Phaser from "phaser";
import { IRawSpaceElements, IReceivedElement } from "./SpaceEditorScene";
import { IGetSpaceByIdResponse } from "@/lib/types";

interface ISpaceData extends IGetSpaceByIdResponse {
  id: string;
}

interface IPosition {
  x: number;
  y: number;
}

export class ArenaScene extends Phaser.Scene {
  private MAP_WIDTH = 40 * TILE_SIZE;
  private MAP_HEIGHT = 25 * TILE_SIZE;
  private spaceId: string | undefined;
  private arenaElements: IRawSpaceElements[] = [];
  private socket: WebSocket | undefined;

  private playerPosition: IPosition | undefined;
  private users: { id: string; avatar: any; position: IPosition }[] = [];

  constructor(space: ISpaceData) {
    super("Arena");

    const dimensionValues = space.dimensions.split("x");
    const dimensions = {
      width: Number(dimensionValues[0]),
      height: Number(dimensionValues[1]),
    };

    this.MAP_WIDTH = dimensions.width * TILE_SIZE;
    this.MAP_HEIGHT = dimensions.height * TILE_SIZE;
    this.spaceId = space.id;
    this.arenaElements = space.spaceElements;
    this.setUpWebSocketConnection();
  }

  preload(): void {
    this.load.image("grid-tile", TILE_IMAGE_URL);
    this.arenaElements.forEach((e) => {
      const spriteId = e.element.id;
      if (!this.textures.exists(spriteId))
        this.load.image(spriteId, e.element.imageUrl);
    });
  }

  create(): void {
    this.drawGrid();
    this.arenaElements.forEach((e) => {
      const element: IReceivedElement = {
        id: e.element.id,
        elementId: e.id,
        width: e.element.width,
        height: e.element.height,
        static: e.element.static,
        imageUrl: e.element.imageUrl,
      };

      this.placeExistingElementsOnGrid(element, e.x, e.y);
    });
  }

  placeExistingElementsOnGrid(
    element: IReceivedElement,
    gridX: number,
    gridY: number
  ): void {
    const posX = gridX * TILE_SIZE;
    const posY = gridY * TILE_SIZE;
    const elemWidth = element.width;
    const elemHeight = element.height;

    const spriteWidth = elemWidth * TILE_SIZE;
    const spriteHeight = elemHeight * TILE_SIZE;

    const key = element.id;

    const sprite = this.add
      .image(posX, posY, key)
      .setOrigin(0, 0)
      .setDisplaySize(spriteWidth, spriteHeight);
  }

  drawGrid() {
    for (let x = 0; x < this.MAP_WIDTH; x += TILE_SIZE) {
      for (let y = 0; y < this.MAP_HEIGHT; y += TILE_SIZE) {
        this.add
          .image(x, y, "grid-tile")
          .setOrigin(0)
          .setDisplaySize(TILE_SIZE, TILE_SIZE);
      }
    }
  }

  setUpWebSocketConnection = () => {
    const socket = new WebSocket(WS_SERVER_URL);
    this.socket = socket;

    socket.onopen = () => {
      this.sendJoinEvent();
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case SPACE_JOINED:
          this.playerPosition = {
            x: message.payload.spawn.x,
            y: message.payload.spawn.y,
          };

          this.users = message.payload.users;
          break;
      }
    };
  };

  sendJoinEvent = () => {
    const message = {
      type: JOIN,
      payload: {
        spaceId: this.spaceId,
        token: "token_received_during_login",
      },
    };

    this.socket?.send(JSON.stringify(message));
  };
}
