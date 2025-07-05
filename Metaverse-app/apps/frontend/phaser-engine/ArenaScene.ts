import {
  DEFAULT_AVATAR_IMAGES,
  JOIN,
  MOVEMENT,
  MOVEMENT_REJECTED,
  SPACE_JOINED,
  TILE_IMAGE_URL,
  TILE_SIZE,
  WS_SERVER_URL,
} from "@/lib/constant";
import * as Phaser from "phaser";
import { IRawSpaceElements, IReceivedElement } from "./SpaceEditorScene";
import { IAvatarImages, IGetSpaceByIdResponse } from "@/lib/types";
import { GetUsersMetadataAPI } from "@/lib/apis";
import { ISpaceJoinedResponse } from "@repo/common/ws-types";

interface ISpaceData extends IGetSpaceByIdResponse {
  id: string;
}

interface IPosition {
  x: number;
  y: number;
}

interface IUsersMetaData {
  userId: string | undefined;
  avatar?: IAvatarImages;
  position?: IPosition;
  avatarSprite?: { [key in keyof IAvatarImages]?: Phaser.GameObjects.Image };
}

interface ICurrentUserMetadata extends IUsersMetaData {
  token: string | undefined;
}

const AVATAR_SIZE = TILE_SIZE * 2;

export class ArenaScene extends Phaser.Scene {
  private MAP_WIDTH = 40 * TILE_SIZE;
  private MAP_HEIGHT = 25 * TILE_SIZE;
  private spaceId: string | undefined;
  private arenaElements: IRawSpaceElements[] = [];
  private socket: WebSocket | undefined;

  private currentUserMetaData: ICurrentUserMetadata = {
    avatar: undefined,
    position: undefined,
    token: undefined,
    userId: undefined,
  };

  private users: IUsersMetaData[] = [];

  // Avatar controller variables
  private keys: {
    W?: Phaser.Input.Keyboard.Key;
    A?: Phaser.Input.Keyboard.Key;
    S?: Phaser.Input.Keyboard.Key;
    D?: Phaser.Input.Keyboard.Key;
  } = {};
  private lastDirection: "Up" | "Down" | "Left" | "Right" | null = null;
  private animationTick: number = 0;
  private animationSpeed: number = 10;

  private lastSendPosition: IPosition = { x: 0, y: 0 };

  private followSprite?: Phaser.GameObjects.Rectangle;

  constructor(space: ISpaceData, userToken: string) {
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
    this.currentUserMetaData.token = userToken;
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
    this.cameras.main.setBounds(0, 0, this.MAP_WIDTH, this.MAP_HEIGHT);
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

      // Key mapping
      this.keys.W = this.input.keyboard?.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      );
      this.keys.A = this.input.keyboard?.addKey(
        Phaser.Input.Keyboard.KeyCodes.A
      );
      this.keys.S = this.input.keyboard?.addKey(
        Phaser.Input.Keyboard.KeyCodes.S
      );
      this.keys.D = this.input.keyboard?.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
      );
    });

    this.events.on("destroy", () => {
      this.destroyAllAvatars();
    });
  }

  update(): void {
    if (
      !this.currentUserMetaData.avatarSprite ||
      !this.currentUserMetaData.position
    )
      return;

    const spriteMap = this.currentUserMetaData.avatarSprite;
    const speed = 5;

    let direction: "Up" | "Down" | "Left" | "Right" | null = null;
    let moved = false;

    // Movement Logic
    if (this.keys.W?.isDown) {
      direction = "Up";
      this.currentUserMetaData.position.y -= speed / TILE_SIZE;
      moved = true;
    } else if (this.keys.S?.isDown) {
      direction = "Down";
      this.currentUserMetaData.position.y += speed / TILE_SIZE;
      moved = true;
    } else if (this.keys.A?.isDown) {
      direction = "Left";
      this.currentUserMetaData.position.x -= speed / TILE_SIZE;
      moved = true;
    } else if (this.keys.D?.isDown) {
      direction = "Right";
      this.currentUserMetaData.position.x += speed / TILE_SIZE;
      moved = true;
    }

    let currentTileX = Math.floor(this.currentUserMetaData.position.x);
    let currentTileY = Math.floor(this.currentUserMetaData.position.y);

    let sendX = currentTileX;
    let sendY = currentTileY;

    switch (this.lastDirection) {
      case "Up":
        sendY = Math.floor(this.currentUserMetaData.position.y);
        break;
      case "Down":
        // Set y coordinates to bottom of image
        sendY = Math.floor(this.currentUserMetaData.position.y) + 1;
        break;
      case "Left":
        sendX = Math.floor(this.currentUserMetaData.position.x);
        break;
      case "Right":
        // Set x coordinates to bottom of image
        sendX = Math.floor(this.currentUserMetaData.position.x) + 1;
        break;
    }

    // Check if user moved
    if (
      sendX !== this.lastSendPosition.x ||
      sendY !== this.lastSendPosition.y
    ) {
      this.lastSendPosition = { x: sendX, y: sendY };
      this.sendUserMovementEvent(this.lastSendPosition);
      console.log("Movement send:", this.lastSendPosition);
    }

    const position = this.currentUserMetaData.position;

    // TILE_SIZE / 2 is added to center the image
    const posX = position.x * TILE_SIZE + TILE_SIZE / 2;
    const posY = position.y * TILE_SIZE + TILE_SIZE / 2;

    // Hide all frames
    Object.values(spriteMap).forEach((sprite) => {
      sprite?.setVisible(false);
      sprite?.setPosition(posX, posY);
    });

    this.followSprite?.setPosition(posX, posY);
    if (moved && direction) {
      this.lastDirection = direction;

      // Animate walking
      const walkFrame =
        this.animationTick < this.animationSpeed
          ? `walking${direction}1`
          : `walking${direction}2`;

      const sprite = spriteMap[walkFrame as keyof IAvatarImages];
      if (sprite) sprite.setVisible(true);

      // Update tick
      this.animationTick++;
      if (this.animationTick > this.animationSpeed * 2) {
        this.animationTick = 0;
      }
    } else if (this.lastDirection) {
      // Show standing frame when idle
      const standKey = `standing${this.lastDirection}` as keyof IAvatarImages;
      spriteMap[standKey]?.setVisible(true);
    }
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

  sendJoinEvent() {
    const message = {
      type: JOIN,
      payload: {
        spaceId: this.spaceId,
        token: this.currentUserMetaData.token,
      },
    };

    this.socket?.send(JSON.stringify(message));
  }

  setUpWebSocketConnection() {
    const socket = new WebSocket(WS_SERVER_URL);
    this.socket = socket;

    socket.onopen = () => {
      this.sendJoinEvent();
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case SPACE_JOINED:
          this.onSpaceJoinedEvent(message);
          break;

        case MOVEMENT_REJECTED:
          console.log("Movement rejected", message);
          const position: IPosition = message.payload;
          this.currentUserMetaData.position = position;
      }
    };
  }

  sendUserMovementEvent(position: IPosition) {
    const message = {
      type: MOVEMENT,
      payload: position,
    };
    this.socket?.send(JSON.stringify(message));
  }

  async onSpaceJoinedEvent(spaceJoinedMessage: ISpaceJoinedResponse) {
    this.currentUserMetaData.position = {
      x: spaceJoinedMessage.payload.spawn.x,
      y: spaceJoinedMessage.payload.spawn.y,
    };

    this.lastSendPosition = this.currentUserMetaData.position;

    this.currentUserMetaData.userId = spaceJoinedMessage.payload.userId;
    this.setUpCurrentUserAvatars();

    const userData = spaceJoinedMessage.payload.users;
    userData.forEach((user) => {
      this.users.push({
        userId: user.id,
        avatar: DEFAULT_AVATAR_IMAGES,
        position: user.position,
      });
    });

    await this.getOtherUsersAvatar(this.users.map((e) => e.userId!));

    // Render other user's on the scene
    // this.users.forEach((user) => {
    //   user.avatarSprite = this.renderUserAvatar(user.position!, user.avatar!);
    // });
  }

  async getUsersMetaData(ids: string[]) {
    try {
      const response = await GetUsersMetadataAPI(ids);
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async setUpCurrentUserAvatars() {
    try {
      const response = await this.getUsersMetaData([
        this.currentUserMetaData.userId as string,
      ]);

      this.currentUserMetaData.avatar =
        response?.data.avatars[0].avatarId || DEFAULT_AVATAR_IMAGES;

      // render current user avatar
      this.currentUserMetaData.avatarSprite = this.renderUserAvatar(
        this.currentUserMetaData.position!,
        this.currentUserMetaData.avatar
      );

      const pos = this.currentUserMetaData.position!;
      const posX = pos.x * TILE_SIZE + TILE_SIZE / 2;
      const posY = pos.y * TILE_SIZE + TILE_SIZE / 2;

      this.followSprite = this.add
        .rectangle(posX, posY, 1, 1, 0xffffff, 0) // invisible 1x1 object
        .setOrigin(0.5);

      this.cameras.main.startFollow(this.followSprite, true, 0.1, 0.1);

      // Made the initial avatar position visible
      this.lastDirection = "Down";
      this.currentUserMetaData.avatarSprite.standingDown?.setVisible(true);
    } catch (err) {
      console.log(err);
    }
  }

  async getOtherUsersAvatar(users: string[]) {
    try {
      const response = await this.getUsersMetaData(users);
      if (!response) return;

      this.users.forEach((user) => {
        const avatarData = response.data.avatars.find(
          (avatar) => avatar.userId === user.userId
        );

        if (avatarData) {
          user.avatar = avatarData.avatarId || DEFAULT_AVATAR_IMAGES;
        }
      });
    } catch (err) {
      console.log("Error fetching avatar data:", err);
    }
  }

  renderUserAvatar(
    position: IPosition,
    avatars: IAvatarImages
  ): { [key in keyof IAvatarImages]?: Phaser.GameObjects.Image } {
    if (!position || !avatars) {
      console.warn("Position or Avatar not set for user");
      return {};
    }

    const posX = position.x * TILE_SIZE + TILE_SIZE / 2;
    const posY = position.y * TILE_SIZE + TILE_SIZE / 2;

    const avatarSprites: {
      [key in keyof IAvatarImages]?: Phaser.GameObjects.Image;
    } = {};

    for (const frame in avatars) {
      if (frame === "id") continue;

      const key = `avatar-${avatars.id}-${frame}`;
      const url = avatars[frame as keyof IAvatarImages] as string;

      const createSprite = () => {
        const sprite = this.add
          .sprite(posX, posY, key)
          .setOrigin(0.5, 0.5)
          .setDisplaySize(AVATAR_SIZE, AVATAR_SIZE)
          .setVisible(frame === "standingDown");

        avatarSprites[frame as keyof IAvatarImages] = sprite;
        return sprite;
      };

      if (!this.textures.exists(key)) {
        this.load.image(key, url);

        this.load.once(`filecomplete-image-${key}`, () => {
          createSprite();
        });

        this.load.start();
      } else {
        createSprite();
      }
    }

    return avatarSprites;
  }

  // remove all sprites on shutdown
  destroyAllAvatars() {
    this.destroyAvatarSprites(this.currentUserMetaData.avatarSprite);
    this.currentUserMetaData.avatarSprite = undefined;

    this.users.forEach((user) => {
      this.destroyAvatarSprites(user.avatarSprite);
      user.avatarSprite = undefined;
    });

    this.users = [];
  }

  destroyAvatarSprites(avatarSprites?: {
    [key in keyof IAvatarImages]?: Phaser.GameObjects.Image;
  }) {
    if (!avatarSprites) return;

    Object.values(avatarSprites).forEach((sprite) => {
      sprite?.destroy();
    });
  }
}
