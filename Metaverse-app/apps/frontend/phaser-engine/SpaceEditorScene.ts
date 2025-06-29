import { TILE_SIZE } from "@/lib/constant";
import { ISceneElement, MapEditorScene } from "./MapEditorScene";
import { Element } from "@repo/common/schema-types";

export interface IReceivedElement extends Element {
  elementId: string;
}

export interface IRawSpaceElements {
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

type IActionPerformed =
  | {
      type: "add";
      id: string;
      x: number;
      y: number;
    }
  | {
      type: "delete";
      elementId: string;
    };

export class SpaceEditorScene extends MapEditorScene {
  private rawSpaceElements: IRawSpaceElements[] = [];

  actionToBePerformed: IActionPerformed[] = [];

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

  placeElementAt(element: Element, clientX: number, clientY: number) {
    super.placeElementAt(element, clientX, clientY);

    const worldPoint = this.cameras.main.getWorldPoint(clientX, clientY);
    const gridX = Math.floor(worldPoint.x / TILE_SIZE);
    const gridY = Math.floor(worldPoint.y / TILE_SIZE);

    this.actionToBePerformed.push({
      type: "add",
      id: element.id,
      x: gridX,
      y: gridY,
    });
  }

  deleteElement(elem: ISceneElement) {
    super.deleteElement(elem);
    if (elem.elementId) {
      this.actionToBePerformed.push({
        type: "delete",
        elementId: elem.elementId,
      });
    }
  }

  updateElementPosition(elem: ISceneElement, x: number, y: number) {
    const oldX = elem.x;
    const oldY = elem.y;

    super.updateElementPosition(elem, x, y);

    const gridX = x / TILE_SIZE;
    const gridY = y / TILE_SIZE;

    if (!elem.elementId) {
      const index = this.actionToBePerformed.findIndex(
        (e) =>
          e.type === "add" && e.id === elem.id && e.x === oldX && e.y === oldY
      );

      const action = this.actionToBePerformed[index];
      if (action && action.type === "add") {
        action.x = gridX;
        action.y = gridY;
      }
    } else if (elem.elementId) {
      // remove old element
      this.actionToBePerformed.push({
        type: "delete",
        elementId: elem.elementId,
      });

      //add element at new position
      this.actionToBePerformed.push({
        type: "add",
        id: elem.id,
        x: gridX,
        y: gridY,
      });
    }
  }

  undoLastAction = () => {
    const lastAction = this.historyStack.pop();
    if (!lastAction) return;

    if (lastAction.type === "delete") {
      const { id, x, y, width, height, imageUrl } = lastAction.element;

      if (!this.textures.exists(id)) {
        this.load.image(id, imageUrl);
        this.load.once("complete", () => {
          this.restoreElement(id, x, y, width, height);
          this.actionToBePerformed.push({
            type: "add",
            id,
            x: x / TILE_SIZE,
            y: y / TILE_SIZE,
          });
        });
        this.load.start();
      } else {
        this.restoreElement(id, x, y, width, height);
        this.actionToBePerformed.push({
          type: "add",
          id,
          x: x / TILE_SIZE,
          y: y / TILE_SIZE,
        });
      }
    }

    if (lastAction.type === "add") {
      const index = this.mapElements.findIndex(
        (el) =>
          el.id === lastAction.element.id &&
          el.x === lastAction.element.x &&
          el.y === lastAction.element.y
      );

      if (index !== -1) {
        const element = this.mapElements[index];
        element.sprite.destroy();
        element.background.destroy();
        this.mapElements.splice(index, 1);

        if (element.elementId) {
          this.actionToBePerformed.push({
            type: "delete",
            elementId: element.elementId,
          });
        }
      }
    }
  };
}
