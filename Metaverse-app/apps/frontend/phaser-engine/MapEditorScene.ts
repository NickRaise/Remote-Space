import * as Phaser from 'phaser';

const TILE_SIZE = 40;
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
  infoText: Phaser.GameObjects.Text | null = null; // ✅ define the text property

  constructor() {
    console.log("nap editor initialized")
    super('MapEditor');
  }

  create() {
    this.drawGrid();

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.selectedElement) return;

      const gridX = Math.floor(pointer.x / TILE_SIZE);
      const gridY = Math.floor(pointer.y / TILE_SIZE);

      const posX = gridX * TILE_SIZE;
      const posY = gridY * TILE_SIZE;

      const sprite = this.add.image(
        posX,
        posY,
        // rendering the preloaded image using the id
        this.selectedElement.id
      ).setOrigin(0, 0).setDisplaySize(
        this.selectedElement.width * TILE_SIZE,
        this.selectedElement.height * TILE_SIZE
      );

      this.mapElements.push({
        id: this.selectedElement.id,
        sprite,
        x: gridX,
        y: gridY
      });
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
