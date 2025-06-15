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
      posX + spriteWidth > MAP_WIDTH ||
      posY + spriteHeight > MAP_HEIGHT
    ) {
      console.warn("Out of bounds drop");
      return;
    }

    const isOverlapping = this.mapElements.some((elem) => {
      const otherWidth = elem.sprite.displayWidth / TILE_SIZE;
      const otherHeight = elem.sprite.displayHeight / TILE_SIZE;

      return !(
        gridX + elemWidth <= elem.x || // to the left
        gridX >= elem.x + otherWidth || // to the right
        gridY + elemHeight <= elem.y || // below
        gridY >= elem.y + otherHeight // above
      );
    });

    if (isOverlapping) {
      console.warn("Drop overlaps existing element");
      return;
    }

    // Ensure texture is loaded
    const key = element.id;
    const handlePlace = () => {
      // Background for visualizing
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

      // Image
      const sprite = this.add
        .image(posX, posY, key)
        .setOrigin(0, 0)
        .setDisplaySize(spriteWidth, spriteHeight);

      this.mapElements.push({
        id: key,
        sprite,
        x: gridX,
        y: gridY,
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
}
