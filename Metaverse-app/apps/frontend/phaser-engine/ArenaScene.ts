import { TILE_SIZE } from "@/lib/constant";
import * as Phaser from "phaser";
import { IRawSpaceElements, IReceivedElement } from "./SpaceEditorScene";
export class ArenaScene extends Phaser.Scene {
  private MAP_WIDTH = 40 * TILE_SIZE;
  private MAP_HEIGHT = 25 * TILE_SIZE;

  private arenaElements: IRawSpaceElements[] = [];

  constructor(
    dimensions: { width: number; height: number },
    arenaElements: IRawSpaceElements[]
  ) {
    super("Arena");
    this.MAP_WIDTH = dimensions.width;
    this.MAP_HEIGHT = dimensions.height;
    this.arenaElements = arenaElements;
  }

  preload(): void {
    this.arenaElements.forEach((e) => {
      const spriteId = e.element.id;
      if (!this.textures.exists(spriteId))
        this.load.image(spriteId, e.element.imageUrl);
    });
  }

  create(): void {
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

    // Render element image
    const sprite = this.add
      .image(posX, posY, key)
      .setOrigin(0, 0)
      .setDisplaySize(spriteWidth, spriteHeight);
  }
}
