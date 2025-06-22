"use client";

import React, { useEffect, useRef, useState } from "react";
import AllElementsMenu from "@/components/custom/element-sidebar";
import { Element } from "@repo/common/schema-types";
import { Game } from "phaser";
import { MapEditorScene } from "@/phaser-engine/MapEditorScene";
import { UploadToCloudinary } from "@/cloudinary";
import { CLOUDINARY_MAP_FOLDER } from "@/lib/constant";
import { useUserStore } from "@/store/userStore";
import { CreateMapAPI } from "@/lib/apis";
import { z } from "zod";
import { CreateMapSchema } from "@repo/common/api-types";
import EditMapMetaData from "@/components/custom/EditMapMetaData";
import MapDimensionSetting from "@/components/custom/map-dimension-setting";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";

export default function MapEditorGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);
  const [mapName, setMapName] = useState<string>("New Map");
  const [mapWidth, setMapWidth] = useState<number>(1600);
  const [mapHeight, setMapHeight] = useState<number>(1000);
  const token = useUserStore().userToken;

  const createMap = async () => {
    if (!token) return;
    const mapObject = gameRef.current?.scene.keys[
      "MapEditor"
    ] as MapEditorScene;
    const image = await mapObject.generateThumbnail();
    const imageUrl = await UploadToCloudinary(image, CLOUDINARY_MAP_FOLDER);
    const mapElements = mapObject.mapElements;
    if (!imageUrl) return;
    const mapMetaData: z.infer<typeof CreateMapSchema> = {
      thumbnail: imageUrl,
      dimensions: "100x100", // work on this, use custom dimensions for map
      name: "Temp Name",
      defaultElements: mapElements.map((e) => ({
        elementId: e.id,
        x: e.x,
        y: e.y,
      })),
    };
    const response = await CreateMapAPI(token, mapMetaData);
  };

  const initGame = async () => {
    if (
      typeof window === "undefined" ||
      !containerRef.current ||
      gameRef.current
    )
      return;

    const Phaser = await import("phaser");

    const { MapEditorScene } = await import("@/phaser-engine/MapEditorScene");

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1600,
      height: 1000,
      parent: containerRef.current,
      backgroundColor: "#1a1a1a",
      scene: MapEditorScene,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
  };

  useEffect(() => {
    initGame();

    const container = containerRef.current;
    if (!container) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      const data = e.dataTransfer?.getData("application/json");
      if (!data) return;

      const element: Element = JSON.parse(data);

      const rect = container.getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropY = e.clientY - rect.top;

      const scene = gameRef.current?.scene.keys["MapEditor"] as MapEditorScene;
      if (scene) {
        scene.placeElementAt(element, dropX, dropY);
      }
    };

    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      if (container) {
        container.removeEventListener("dragover", handleDragOver);
        container.removeEventListener("drop", handleDrop);
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen flex overflow-hidden scrollbar-hide relative">
      <AllElementsMenu />
      <div ref={containerRef} className="flex-1 overflow-hidden" />
      <EditMapMetaData mapName={mapName} setMapName={setMapName} />
      <div className="absolute right-8 top-4 pointer-events-auto flex gap-2">
        <div>
          <Button
            type="button"
            className="cursor-pointer bg-custom-primary hover:bg-custom-accent flex items-center justify-center"
          >
            Save <CloudUpload />
          </Button>
        </div>
        <MapDimensionSetting />
      </div>
    </div>
  );
}
