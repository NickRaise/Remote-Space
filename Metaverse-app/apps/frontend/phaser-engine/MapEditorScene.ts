import { TILE_SIZE } from "@/lib/constant";
import * as Phaser from "phaser";
import { Element } from "@repo/common/schema-types";

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1000;

interface MapElement {
  id: string;
  sprite: Phaser.GameObjects.Image;
  x: number;
  y: number;
}

export class MapEditorScene extends Phaser.Scene {
  selectedElement: Element | null = null;
  mapElements: MapElement[] = [];

  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };
  private isSpacePressed = false;

  private targetZoom = 1;
  private zoomLerpSpeed = 0.1;

  constructor() {
    super("MapEditor");
  }

  create() {
    this.drawGrid();

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.isSpacePressed) {
        this.isDragging = true;
        this.dragStart.x = pointer.x;
        this.dragStart.y = pointer.y;
        this.cameraStart.x = this.cameras.main.scrollX;
        this.cameraStart.y = this.cameras.main.scrollY;
        this.input.setDefaultCursor("grabbing");
        return;
      }

      if (!this.selectedElement) return;

      const worldPoint = pointer.positionToCamera(
        this.cameras.main
      ) as Phaser.Math.Vector2;
      const gridX = Math.floor(worldPoint.x / TILE_SIZE);
      const gridY = Math.floor(worldPoint.y / TILE_SIZE);

      const posX = gridX * TILE_SIZE;
      const posY = gridY * TILE_SIZE;

      const elemWidth = this.selectedElement.width;
      const elemHeight = this.selectedElement.height;

      const spriteWidth = elemWidth * TILE_SIZE;
      const spriteHeight = elemHeight * TILE_SIZE;

      // Check if element is out of bounds
      if (
        posX < 0 ||
        posY < 0 ||
        posX + spriteWidth > MAP_WIDTH ||
        posY + spriteHeight > MAP_HEIGHT
      ) {
        console.warn("Cannot place element: would overflow map bounds.");
        return;
      }

      // Check for overlap
      const isOverlapping = this.mapElements.some((elem) => {
        const otherWidth = elem.sprite.displayWidth / TILE_SIZE;
        const otherHeight = elem.sprite.displayHeight / TILE_SIZE;

        return !(
          gridX + elemWidth <= elem.x || // right
          gridX >= elem.x + otherWidth || // left
          gridY + elemHeight <= elem.y || // below
          gridY >= elem.y + otherHeight // above
        );
      });

      if (isOverlapping) {
        console.warn("Cannot place element: overlaps another element.");
        return;
      }

      // Add pink background rectangle
      // const bg = this.add.rectangle(
      //   posX + spriteWidth / 2,
      //   posY + spriteHeight / 2,
      //   spriteWidth,
      //   spriteHeight,
      //   0xff69b4,
      //   0.4
      // );
      // bg.setOrigin(0.5, 0.5);

      // Add sprite on top
      const sprite = this.add
        .image(posX, posY, this.selectedElement.id)
        .setOrigin(0, 0)
        .setDisplaySize(spriteWidth, spriteHeight);

      this.mapElements.push({
        id: this.selectedElement.id,
        sprite,
        x: gridX,
        y: gridY,
      });

      console.log(this.mapElements);
    });

    this.input.on("pointerup", () => {
      this.isDragging = false;
      this.input.setDefaultCursor("default");
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging && this.isSpacePressed) {
        const dx = pointer.x - this.dragStart.x;
        const dy = pointer.y - this.dragStart.y;

        this.cameras.main.scrollX = this.cameraStart.x - dx;
        this.cameras.main.scrollY = this.cameraStart.y - dy;
      }
    });

    this.input.keyboard?.on("keydown-SPACE", () => {
      this.isSpacePressed = true;
      this.input.setDefaultCursor("grab");
    });

    this.input.keyboard?.on("keyup-SPACE", () => {
      this.isSpacePressed = false;
      this.isDragging = false;
      this.input.setDefaultCursor("default");
    });

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
    const currentZoom = this.cameras.main.zoom;
    const newZoom = Phaser.Math.Linear(
      currentZoom,
      this.targetZoom,
      this.zoomLerpSpeed
    );
    this.cameras.main.setZoom(newZoom);
  }

  drawGrid() {
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x444444, 1);

    for (let x = 0; x <= MAP_WIDTH; x += TILE_SIZE) {
      graphics.moveTo(x, 0);
      graphics.lineTo(x, MAP_HEIGHT);
    }

    for (let y = 0; y <= MAP_HEIGHT; y += TILE_SIZE) {
      graphics.moveTo(0, y);
      graphics.lineTo(MAP_WIDTH, y);
    }

    graphics.strokePath();
  }

  setElements(element: Element | null) {
    if (!element) {
      this.selectedElement = null;
      return;
    }

    const key = element.id;

    if (!this.textures.exists(key)) {
      this.load.image(key, element.imageUrl);
      this.load.once("complete", () => {
        this.selectedElement = element;
        console.log("Texture loaded and element set:", element);
      });
      this.load.start();
    } else {
      this.selectedElement = element;
      console.log("Texture already loaded, element set:", element);
    }
  }
}
