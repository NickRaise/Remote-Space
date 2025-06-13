import { TILE_SIZE } from "@/lib/constant";
import * as Phaser from "phaser";

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1000;

interface ElementData {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
}

interface MapElement {
  id: string;
  sprite: Phaser.GameObjects.Image;
  x: number;
  y: number;
}

export class MapEditorScene extends Phaser.Scene {
  selectedElement: ElementData | null = null;
  allElements: ElementData[] = [];
  mapElements: MapElement[] = [];

  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private cameraStart = { x: 0, y: 0 };
  private isSpacePressed = false;

  constructor() {
    super("MapEditor");
  }

  create() {
    this.drawGrid();

    // Setup the values when the space bar is pressed
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

      const sprite = this.add
        .image(posX, posY, this.selectedElement.id)
        .setOrigin(0, 0)
        .setDisplaySize(
          this.selectedElement.width * TILE_SIZE,
          this.selectedElement.height * TILE_SIZE
        );

      this.mapElements.push({
        id: this.selectedElement.id,
        sprite,
        x: gridX,
        y: gridY,
      });
    });

    // Release cursor
    this.input.on("pointerup", () => {
      this.isDragging = false;
      this.input.setDefaultCursor("default");
    });

    // Move the canvas when dragging
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging && this.isSpacePressed) {
        const dx = pointer.x - this.dragStart.x;
        const dy = pointer.y - this.dragStart.y;

        this.cameras.main.scrollX = this.cameraStart.x - dx;
        this.cameras.main.scrollY = this.cameraStart.y - dy;
      }
    });

    // Set space bar to pressed
    this.input.keyboard?.on("keydown-SPACE", () => {
      this.isSpacePressed = true;
      this.input.setDefaultCursor("grab");
    });

    // Set space bar to released
    this.input.keyboard?.on("keyup-SPACE", () => {
      this.isSpacePressed = false;
      this.isDragging = false;
      this.input.setDefaultCursor("default");
    });
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

  setElements(elements: ElementData[]) {
    this.allElements = elements;
  }
}
