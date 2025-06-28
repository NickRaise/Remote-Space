import { TILE_IMAGE_URL, TILE_SIZE } from "@/lib/constant";
import * as Phaser from "phaser";
import { Element } from "@repo/common/schema-types";

export interface ISceneElement {
  id: string;
  elementId?: string;
  sprite: Phaser.GameObjects.Image;
  background: Phaser.GameObjects.Rectangle;
  x: number;
  y: number;
}

type Action =
  | { type: "add"; element: ISceneElement }
  | {
      type: "delete";
      element: Omit<ISceneElement, "sprite" | "background"> & {
        width: number;
        height: number;
        imageUrl: string;
      };
    };

export class MapEditorScene extends Phaser.Scene {
  mapElements: ISceneElement[] = [];

  private MAP_WIDTH = 40 * TILE_SIZE;
  private MAP_HEIGHT = 25 * TILE_SIZE;

  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };
  private isSpacePressed = false;
  historyStack: Action[] = [];

  private targetZoom = 1;
  private zoomLerpSpeed = 0.1;

  private selectedSprite: Phaser.GameObjects.Image | null = null;
  private selectedElement: ISceneElement | null = null;

  constructor(
    sceneKey: string,
    dimensions: { width: number; height: number } = { width: 40, height: 25 }
  ) {
    super(sceneKey);
    this.MAP_WIDTH = dimensions.width * TILE_SIZE;
    this.MAP_HEIGHT = dimensions.height * TILE_SIZE;
  }

  preload() {
    this.load.image("grid-tile", TILE_IMAGE_URL);
  }

  create() {
    this.drawGrid(); // Draw initial grid on map

    this.input.mouse?.disableContextMenu();
    this.input.on("pointerdown", this.handlePointerDown, this);
    this.input.on("pointerup", this.handlePointerUp, this);
    this.input.on("pointermove", this.handlePointerMove, this);

    // Handle panning
    this.input.keyboard?.on("keydown-SPACE", () => {
      this.isSpacePressed = true;
      this.input.setDefaultCursor("grab");
    });

    this.input.keyboard?.on("keyup-SPACE", () => {
      this.isSpacePressed = false;
      this.isDragging = false;
      this.input.setDefaultCursor("default");
    });

    this.input.keyboard?.on("keydown-Z", (event: KeyboardEvent) => {
      if (event.ctrlKey) {
        this.undoLastAction();
      }
    });

    // Zoom handling with Ctrl + Scroll
    window.addEventListener(
      "wheel",
      (event: WheelEvent) => {
        if (!event.ctrlKey) return;
        event.preventDefault();
        const zoomSpeed = 0.0015;
        this.targetZoom = Phaser.Math.Clamp(
          this.targetZoom - event.deltaY * zoomSpeed,
          0.3,
          3
        );
      },
      { passive: false }
    );
  }

  update() {
    // Smooth zoom transition
    const currentZoom = this.cameras.main.zoom;
    const newZoom = Phaser.Math.Linear(
      currentZoom,
      this.targetZoom,
      this.zoomLerpSpeed
    );
    this.cameras.main.setZoom(newZoom);
  }

  drawGrid() {
    // Draw tile image on each grid square first
    for (let x = 0; x < this.MAP_WIDTH; x += TILE_SIZE) {
      for (let y = 0; y < this.MAP_HEIGHT; y += TILE_SIZE) {
        this.add
          .image(x, y, "grid-tile")
          .setOrigin(0)
          .setDisplaySize(TILE_SIZE, TILE_SIZE);
      }
    }

    // Now draw grid lines *on top* of the tiles
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x8888aa, 1);

    // Vertical lines
    for (let x = 0; x <= this.MAP_WIDTH; x += TILE_SIZE) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, this.MAP_HEIGHT);
    }

    // Horizontal lines
    for (let y = 0; y <= this.MAP_HEIGHT; y += TILE_SIZE) {
      graphics.moveTo(0, y);
      graphics.lineTo(this.MAP_WIDTH, y);
    }

    graphics.strokePath();
  }

  handlePointerDown(pointer: Phaser.Input.Pointer) {
    if (this.isSpacePressed) {
      // Start camera drag
      this.isDragging = true;
      this.dragStart.x = pointer.x;
      this.dragStart.y = pointer.y;
      this.cameraStart.x = this.cameras.main.scrollX;
      this.cameraStart.y = this.cameras.main.scrollY;
      this.input.setDefaultCursor("grabbing");
      return;
    }

    if (pointer.rightButtonDown()) {
      const clickedElement = this.getClickedElement(pointer);
      if (clickedElement) {
        this.deleteElement(clickedElement);
      }
    }

    const clickedElement = this.getClickedElement(pointer);
    if (clickedElement) {
      this.selectElement(clickedElement);
    }
  }

  handlePointerUp(pointer: Phaser.Input.Pointer) {
    if (this.selectedSprite && this.selectedElement) {
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const elemWidth = this.selectedSprite.displayWidth;
      const elemHeight = this.selectedSprite.displayHeight;

      // Find the center point's grid cell
      const centerX = worldPoint.x;
      const centerY = worldPoint.y;

      const gridX = Math.floor((centerX - elemWidth / 2) / TILE_SIZE);
      const gridY = Math.floor((centerY - elemHeight / 2) / TILE_SIZE);

      const newX = gridX * TILE_SIZE;
      const newY = gridY * TILE_SIZE;

      if (this.isValidPlacement(newX, newY, elemWidth, elemHeight)) {
        this.updateElementPosition(this.selectedElement, newX, newY);
        this.selectedElement.x = gridX;
        this.selectedElement.y = gridY;
      } else {
        // revert back if not placed
        const revertX = this.selectedElement.x * TILE_SIZE;
        const revertY = this.selectedElement.y * TILE_SIZE;
        this.selectedSprite.setPosition(revertX, revertY);
        this.selectedElement.background.setPosition(
          revertX + elemWidth / 2,
          revertY + elemHeight / 2
        );
      }

      this.selectedElement = null;
      this.selectedSprite = null;
      this.input.setDefaultCursor("default");
    }

    this.isDragging = false;
    if (!this.isSpacePressed) {
      this.input.setDefaultCursor("default");
    }
  }

  handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (this.isDragging && this.isSpacePressed) {
      // Update camera position while dragging
      const dx = pointer.x - this.dragStart.x;
      const dy = pointer.y - this.dragStart.y;
      this.cameras.main.scrollX = this.cameraStart.x - dx;
      this.cameras.main.scrollY = this.cameraStart.y - dy;
    }

    // Dragging selected element
    if (this.selectedSprite && this.selectedElement) {
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const newX = worldPoint.x - this.selectedSprite.displayWidth / 2;
      const newY = worldPoint.y - this.selectedSprite.displayHeight / 2;
      this.selectedSprite.setPosition(newX, newY);
      this.selectedElement.background.setPosition(
        newX + this.selectedSprite.displayWidth / 2,
        newY + this.selectedSprite.displayHeight / 2
      );
    }
  }

  getClickedElement(pointer: Phaser.Input.Pointer): ISceneElement | undefined {
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    return this.mapElements.find((elem) =>
      elem.sprite.getBounds().contains(worldPoint.x, worldPoint.y)
    );
  }

  selectElement(elem: ISceneElement) {
    // Highlight and set element as selected
    this.selectedElement = elem;
    this.selectedSprite = elem.sprite;
    this.children.bringToTop(elem.background);
    this.children.bringToTop(elem.sprite);
    this.input.setDefaultCursor("grabbing");
  }

  updateElementPosition(elem: ISceneElement, x: number, y: number) {
    elem.sprite.setPosition(x, y);
    elem.background.setPosition(
      x + elem.sprite.displayWidth / 2,
      y + elem.sprite.displayHeight / 2
    );
  }

  isValidPlacement(
    x: number,
    y: number,
    width: number,
    height: number
  ): boolean {
    const outOfBounds =
      x < 0 ||
      y < 0 ||
      x + width > this.MAP_WIDTH ||
      y + height > this.MAP_HEIGHT;

    const isOverlapping = this.mapElements.some((elem) => {
      if (elem === this.selectedElement) return false;
      const otherWidth = elem.sprite.displayWidth;
      const otherHeight = elem.sprite.displayHeight;

      return !(
        x + width <= elem.sprite.x ||
        x >= elem.sprite.x + otherWidth ||
        y + height <= elem.sprite.y ||
        y >= elem.sprite.y + otherHeight
      );
    });

    return !outOfBounds && !isOverlapping;
  }

  placeElementAt(element: Element, clientX: number, clientY: number) {
    const worldPoint = this.cameras.main.getWorldPoint(clientX, clientY);
    const gridX = Math.floor(worldPoint.x / TILE_SIZE);
    const gridY = Math.floor(worldPoint.y / TILE_SIZE);

    const posX = gridX * TILE_SIZE;
    const posY = gridY * TILE_SIZE;
    const elemWidth = element.width;
    const elemHeight = element.height;

    const spriteWidth = elemWidth * TILE_SIZE;
    const spriteHeight = elemHeight * TILE_SIZE;

    if (
      posX < 0 ||
      posY < 0 ||
      posX + spriteWidth > this.MAP_WIDTH ||
      posY + spriteHeight > this.MAP_HEIGHT
    ) {
      console.warn("Out of bounds drop");
      return;
    }

    const isOverlapping = this.mapElements.some((elem) => {
      const otherWidth = elem.sprite.displayWidth / TILE_SIZE;
      const otherHeight = elem.sprite.displayHeight / TILE_SIZE;

      return !(
        gridX + elemWidth <= elem.x ||
        gridX >= elem.x + otherWidth ||
        gridY + elemHeight <= elem.y ||
        gridY >= elem.y + otherHeight
      );
    });

    if (isOverlapping) {
      console.warn("Drop overlaps existing element");
      return;
    }

    const key = element.id;
    const handlePlace = () => {
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
        sprite,
        background: bg,
        x: gridX,
        y: gridY,
      };

      this.mapElements.push(newElement);

      this.addToHistoryStack({
        type: "add",
        element: newElement,
      });
    };

    if (!this.textures.exists(key)) {
      this.load.image(key, element.imageUrl);
      this.load.once("complete", handlePlace);
      this.load.start();
    } else {
      handlePlace();
    }
  }

  deleteElement(elem: ISceneElement) {
    const elementMeta = {
      id: elem.id,
      x: elem.x,
      y: elem.y,
      width: elem.sprite.displayWidth,
      height: elem.sprite.displayHeight,
      imageUrl: this.textures.getBase64(elem.id),
    };

    elem.sprite.destroy();
    elem.background.destroy();

    this.mapElements = this.mapElements.filter((e) => e !== elem);

    this.addToHistoryStack({
      type: "delete",
      element: elementMeta,
    });
  }

  undoLastAction = () => {
    console.log("Before", this.historyStack);
    const lastAction = this.historyStack.pop();
    if (!lastAction) return;

    if (lastAction.type === "delete") {
      const { id, x, y, width, height, imageUrl } = lastAction.element;

      if (!this.textures.exists(id)) {
        this.load.image(id, imageUrl);
        this.load.once("complete", () => {
          this.restoreElement(id, x, y, width, height);
        });
        this.load.start();
      } else {
        this.restoreElement(id, x, y, width, height);
      }
    }

    if (lastAction.type === "add") {
      const index = this.mapElements.findIndex(
        (el) =>
          el.id === lastAction.element.id &&
          el.x === lastAction.element.x &&
          el.y === lastAction.element.y
      );
      console.log("index of element to be deleted", index, this.mapElements);
      if (index != -1) {
        const element = this.mapElements[index];
        element.sprite.destroy();
        element.background.destroy();
        this.mapElements.splice(index, 1);
      }
    }
    console.log("After", this.historyStack);
  };

  restoreElement(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const posX = x * TILE_SIZE;
    const posY = y * TILE_SIZE;

    const sprite = this.add
      .image(posX, posY, id)
      .setOrigin(0)
      .setDisplaySize(width, height);

    const background = this.add
      .rectangle(
        posX + width / 2,
        posY + height / 2,
        width,
        height,
        0x3a3a3c,
        0.4
      )
      .setOrigin(0.5);

    // Send background behind the image
    sprite.setDepth(1);
    background.setDepth(0);

    const restoredElement: ISceneElement = {
      id,
      x,
      y,
      sprite,
      background,
    };

    this.mapElements.push(restoredElement);
  }

  generateThumbnail = async (): Promise<string> => {
    return await new Promise((resolve) => {
      // Store the original camera state (optional, if you use scroll/zoom)
      const originalScrollX = this.cameras.main.scrollX;
      const originalScrollY = this.cameras.main.scrollY;
      const originalZoom = this.cameras.main.zoom;

      // Center camera to (0,0) and reset zoom to make sure full map is visible
      this.cameras.main.setScroll(0, 0);
      this.cameras.main.setZoom(1);
      this.game.renderer.snapshotArea(
        0,
        0,
        this.MAP_WIDTH - 1,
        this.MAP_HEIGHT - 1,
        (snapshot) => {
          // Restore camera state
          this.cameras.main.setScroll(originalScrollX, originalScrollY);
          this.cameras.main.setZoom(originalZoom);

          if (snapshot instanceof HTMLImageElement) {
            resolve(snapshot.src);
          } else {
            console.warn("Snapshot failed", snapshot);
            resolve("");
          }
        }
      );
    });
  };

  protected addToHistoryStack(value: Action) {
    this.historyStack.push(value);
    if (this.historyStack.length > 7) this.historyStack.shift();
  }
}
