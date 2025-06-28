"use client";
import AllElementsMenu from "@/components/custom/element-sidebar";
import { GetSpaceByIdAPI } from "@/lib/apis";
import { SpaceEditorScene } from "@/phaser-engine/SpaceEditorScene";
import { useUserStore } from "@/store/userStore";
import { Element } from "@repo/common/schema-types";
import { useParams, useRouter } from "next/navigation";
import { Game } from "phaser";
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

const SpaceEditor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);
  const params = useParams();
  const router = useRouter();
  const userToken = useUserStore().userToken;

  const fetchSpaceData = async () => {
    const spaceId = params.id;
    try {
      const response = await GetSpaceByIdAPI(userToken!, spaceId as string);
      const spaceElements = response.data.spaceElements;
    } catch (err) {
      console.log(err);
      toast("Failed to fetch the space. Redirecting...");
      router.push("/space");
    }
  };

  const initGame = async () => {
    if (!userToken) return;
    // fetch space data
    const space = await fetchSpaceData();
    // populate elements in the map
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
    </div>
  );
};

export default SpaceEditor;
