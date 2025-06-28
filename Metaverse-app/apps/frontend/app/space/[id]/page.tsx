"use client";
import {
  DeleteSpaceThumbnailFromCloudinary,
  UploadToCloudinary,
} from "@/cloudinary";
import AllElementsMenu from "@/components/custom/element-sidebar";
import MapEditorHelpBox from "@/components/custom/map-editor-helpbox";
import { SaveButton } from "@/components/sections/SaveButton";
import {
  AddElementToSpaceIdAPI,
  DeleteElementInSpaceIdAPI,
  GetSpaceByIdAPI,
  UpdateSpaceThumbnailById,
} from "@/lib/apis";
import { CLOUDINARY_SPACE_FOLDER } from "@/lib/constant";
import { IGetSpaceByIdResponse } from "@/lib/types";
import { SpaceEditorScene } from "@/phaser-engine/SpaceEditorScene";
import { useUserStore } from "@/store/userStore";
import { Element, Space } from "@repo/common/schema-types";
import { useParams, useRouter } from "next/navigation";
import { Game } from "phaser";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SpaceEditor = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);
  const params = useParams();
  const router = useRouter();
  const userToken = useUserStore((state) => state.userToken);
  const spaceRef = useRef<IGetSpaceByIdResponse>(null);

  const fetchSpaceData = async (): Promise<
    IGetSpaceByIdResponse | undefined
  > => {
    console.log("Getting space");
    const spaceId = params.id;
    try {
      const response = await GetSpaceByIdAPI(userToken!, spaceId as string);
      const space = response.data;
      spaceRef.current = space;
      return space;
    } catch (err) {
      console.log(err);
      toast("Failed to fetch the space. Redirecting...");
      router.push("/space");
    }
  };

  const initGame = async () => {
    console.log("Getting space", userToken);
    if (!userToken) return;
    // fetch space data
    const space = (await fetchSpaceData()) as IGetSpaceByIdResponse;
    // populate elements in the map
    const Phaser = await import("phaser");
    const { SpaceEditorScene } = await import(
      "@/phaser-engine/SpaceEditorScene"
    );

    const dimensionValues = space.dimensions.split("x");

    const dimensions = {
      width: Number(dimensionValues[0]),
      height: Number(dimensionValues[1]),
    };

    const scene = new SpaceEditorScene(
      "SpaceEditor",
      dimensions,
      space.spaceElements
    );

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1600,
      height: 1000,
      parent: containerRef.current,
      backgroundColor: "#1a1a1a",
      scene: scene,
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

      const scene = gameRef.current?.scene.keys[
        "SpaceEditor"
      ] as SpaceEditorScene;
      if (scene) {
        scene.placeElementAt(element, dropX, dropY);
      }
    };

    container.addEventListener("dragover", handleDragOver);
    container.addEventListener("drop", handleDrop);

    return () => {
      if (gameRef.current?.isRunning) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
      if (container) {
        container.removeEventListener("dragover", handleDragOver);
        container.removeEventListener("drop", handleDrop);
      }
    };
  }, [userToken]);

  const updateSpace = async () => {
    if (!userToken) return;
    const spaceObject = gameRef.current?.scene.keys[
      "SpaceEditor"
    ] as SpaceEditorScene;
    console.log(spaceObject.actionToBePerformed);
    try {
      setLoading(true);

      const image = await spaceObject.generateThumbnail();
      const imageUrl = await UploadToCloudinary(image, CLOUDINARY_SPACE_FOLDER);

      if (!imageUrl) {
        throw new Error("Thumbnail image cannot be generated.");
      }

      if (spaceRef.current) {
        DeleteSpaceThumbnailFromCloudinary(spaceRef.current.thumbnail);
      }

      const updateThumbnailData = {
        spaceId: params.id as string,
        imageUrl,
      };

      UpdateSpaceThumbnailById(userToken, updateThumbnailData);

      await Promise.all(
        spaceObject.actionToBePerformed.map((action) => {
          if (action.type === "add") {
            const data = {
              elementId: action.id,
              spaceId: params.id as string,
              x: action.x,
              y: action.y,
            };
            return AddElementToSpaceIdAPI(userToken, data);
          } else {
            return DeleteElementInSpaceIdAPI(userToken, {
              id: action.elementId,
            });
          }
        })
      );

      toast("Updated successfully. Redirecting...");
      router.push("/space");
    } catch (err) {
      console.log(err);
      toast("Space saving failed. Try again...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex overflow-hidden scrollbar-hide relative">
      <AllElementsMenu />
      <div ref={containerRef} className="flex-1 overflow-hidden" />
      <MapEditorHelpBox />
      <div className="absolute right-8 top-4 pointer-events-auto flex gap-2">
        <SaveButton
          label="Confirm"
          loading={loading}
          onClick={updateSpace}
          className="w-30"
        />
      </div>
    </div>
  );
};

export default SpaceEditor;
