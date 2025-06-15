"use client";

import React, { useEffect, useRef, useState } from "react";
import AllElementsMenu from "@/components/custom/element-sidebar";
import { Element } from "@repo/common/schema-types";
import { Game } from "phaser";
import { MapEditorScene } from "@/phaser-engine/MapEditorScene";

export default function MapEditorGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);

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
    <div className="w-screen h-screen flex overflow-scroll scrollbar-hide">
      <AllElementsMenu />
      <div ref={containerRef} className="flex-1" />
    </div>
  );
}
