import { TILE_SIZE } from "@/lib/constant";
import { MapEditorScene } from "./MapEditorScene";
import { Element } from "@repo/common/schema-types";

export interface IReceivedElement extends Element {
  elementId: string;
}

interface IRawSpaceElements {
  id: string;
  element: {
    id: string;
    imageUrl: string;
    height: number;
    width: number;
    static: boolean;
  };
  x: number;
  y: number;
}

export class SpaceEditorScene extends MapEditorScene {
  private rawSpaceElements: IRawSpaceElements[] = [];

  constructor(
    sceneKey: string,
    dimensions: { width: number; height: number } = { width: 40, height: 25 },
    elements: IRawSpaceElements[] = []
  ) {
    super(sceneKey, dimensions);
    this.rawSpaceElements = elements;
  }

  preload(): void {
    super.preload();
    this.rawSpaceElements.forEach((e) => {
      const spriteId = e.element.id;
      if (!this.textures.exists(spriteId))
        this.load.image(spriteId, e.element.imageUrl);
    });
  }

  create(): void {
    super.create();
    this.rawSpaceElements.forEach((e) => {
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

    // Draw background highlight
    const bg = this.add
      .rectangle(
        posX + spriteWidth / 2,
        posY + spriteHeight / 2,
        spriteWidth,
        spriteHeight,
        0x3a3a3c,
        0.4
      )
      .setOrigin(0.5, 0.5);

    // Render element image
    const sprite = this.add
      .image(posX, posY, key)
      .setOrigin(0, 0)
      .setDisplaySize(spriteWidth, spriteHeight);

    const newElement = {
      id: key,
      elementId: element.elementId,
      sprite,
      background: bg,
      x: gridX,
      y: gridY,
    };

    this.mapElements.push(newElement);
  }
}
