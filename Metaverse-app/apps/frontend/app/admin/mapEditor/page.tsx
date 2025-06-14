"use client";

import React, { useEffect, useRef, useState } from "react";
import AllElementsMenu from "@/components/custom/element-sidebar";
import { Element } from "@repo/common/schema-types";
import { Game } from "phaser";

export default function MapEditorGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

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

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-screen h-screen flex overflow-scroll scrollbar-hide">
      <AllElementsMenu
        element={selectedElement}
        setElement={setSelectedElement}
        gameRef={gameRef}
      />
      <div ref={containerRef} className="flex-1" />
    </div>
  );
}
