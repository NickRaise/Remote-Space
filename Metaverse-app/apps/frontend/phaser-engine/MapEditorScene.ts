import { TILE_SIZE } from "@/lib/constant";
import * as Phaser from "phaser";
import { Element } from "@repo/common/schema-types";

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 1000;

interface MapElement {
  id: string;
  sprite: Phaser.GameObjects.Image;
  background: Phaser.GameObjects.Rectangle;
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

  private selectedSprite: Phaser.GameObjects.Image | null = null;
  private selectedElement: MapElement | null = null;

  constructor() {
    super("MapEditor");
  }

  create() {
    this.drawGrid(); // Draw initial grid on map

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

    const clickedElement = this.getClickedElement(pointer);
    if (clickedElement) {
      this.selectElement(clickedElement);
    }
  }

  handlePointerUp(pointer: Phaser.Input.Pointer) {
    if (this.selectedSprite && this.selectedElement) {
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      const gridX = Math.floor(worldPoint.x / TILE_SIZE);
      const gridY = Math.floor(worldPoint.y / TILE_SIZE);

      const newX = gridX * TILE_SIZE;
      const newY = gridY * TILE_SIZE;

      const elemWidth = this.selectedSprite.displayWidth;
      const elemHeight = this.selectedSprite.displayHeight;

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

  getClickedElement(pointer: Phaser.Input.Pointer): MapElement | undefined {
    const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
    return this.mapElements.find((elem) =>
      elem.sprite.getBounds().contains(worldPoint.x, worldPoint.y)
    );
  }

  selectElement(elem: MapElement) {
    // Highlight and set element as selected
    this.selectedElement = elem;
    this.selectedSprite = elem.sprite;
    this.children.bringToTop(elem.background);
    this.children.bringToTop(elem.sprite);
    this.input.setDefaultCursor("grabbing");
  }

  updateElementPosition(elem: MapElement, x: number, y: number) {
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
      x < 0 || y < 0 || x + width > MAP_WIDTH || y + height > MAP_HEIGHT;

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

      this.mapElements.push({
        id: key,
        sprite,
        background: bg,
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
