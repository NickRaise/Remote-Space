"use client";

import React, { useEffect, useRef, useState } from "react";
import AllElementsMenu from "@/components/custom/element-sidebar";
import { Element } from "@repo/common/schema-types";
import { Game } from "phaser";
import { MapEditorScene } from "@/phaser-engine/MapEditorScene";
import { UploadToCloudinary } from "@/cloudinary";
import { CLOUDINARY_MAP_FOLDER, TILE_SIZE } from "@/lib/constant";
import { useUserStore } from "@/store/userStore";
import { CreateMapAPI } from "@/lib/apis";
import { z } from "zod";
import { CreateMapSchema } from "@repo/common/api-types";
import EditMapMetaData from "@/components/custom/EditMapMetaData";
import MapDimensionSetting from "@/components/custom/map-dimension-setting";
import { Button } from "@/components/ui/button";
import { CloudUpload, LucideLoader2 } from "lucide-react";
import { toast } from "sonner";

export default function MapEditorGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);
  const [mapName, setMapName] = useState<string>("New Map");
  const [mapWidth, setMapWidth] = useState<number>(80);
  const [mapHeight, setMapHeight] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(false);
  const token = useUserStore().userToken;

  const createMap = async () => {
    const mapObject = gameRef.current?.scene.keys[
      "MapEditor"
    ] as MapEditorScene;
    if (!token || !mapObject) return;
    try {
      setLoading(true);
      const image = await mapObject.generateThumbnail();
      const imageUrl = await UploadToCloudinary(image, CLOUDINARY_MAP_FOLDER);
      const mapElements = mapObject.mapElements;
      if (!imageUrl) throw Error("Error uploading image");
      const mapMetaData: z.infer<typeof CreateMapSchema> = {
        thumbnail: imageUrl,
        dimensions: `${mapWidth}x${mapHeight}`,
        name: mapName,
        defaultElements: mapElements.map((e) => ({
          elementId: e.id,
          x: e.x,
          y: e.y,
        })),
      };
      const response = await CreateMapAPI(token, mapMetaData);
      if (response.status !== 200 && response.data.id === undefined) {
        throw Error(response.data.message);
      } else {
        toast("Map Created Successfully");
      }
    } catch (err) {
      console.log(err);
      toast("Map Creation failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const reRenderMap = async () => {
    console.log("Trigger map rerender");
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const Phaser = await import("phaser");
    const { MapEditorScene } = await import("@/phaser-engine/MapEditorScene");

    const width = Math.max(10, mapWidth);
    const height = Math.max(10, mapHeight);

    const scene = new MapEditorScene(width, height);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1600,
      height: 1000,
      parent: containerRef.current!,
      backgroundColor: "#1a1a1a",
      scene,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
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
        <SaveButton onClick={createMap} loading={loading} />
        <MapDimensionSetting
          height={mapHeight}
          setHeight={setMapHeight}
          width={mapWidth}
          setWidth={setMapWidth}
          reRenderMap={reRenderMap}
        />
      </div>
    </div>
  );
}

const SaveButton = ({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading: boolean;
}) => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutsideInput = (e: MouseEvent) => {
      if (
        triggerButtonRef.current &&
        !triggerButtonRef.current.contains(e.target as Node)
      ) {
        triggerButtonRef.current.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutsideInput);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInput);
    };
  }, []);

  return (
    <div>
      <Button
        disabled={loading}
        onClick={onClick}
        ref={triggerButtonRef}
        type="button"
        className="w-24 cursor-pointer bg-custom-primary hover:bg-custom-accent flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LucideLoader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            <span>Save</span>
            <CloudUpload className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
