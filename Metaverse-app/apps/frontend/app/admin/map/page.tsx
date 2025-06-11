"use client";

import AllElementsSidebar from "@/components/custom/element-sidebar";
import React, { useRef, useEffect, useState } from "react";
import { Element } from "@repo/common/schema-types";
import { IMapElements } from "@/lib/types";

const TILE_SIZE = 40;

export default function FullScreenGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedElementInstance, setSelectedElementInstance] =
    useState<Element | null>(null);
  const [mapElements, setMapElements] = useState<IMapElements[]>([]);

  // Setup click handler to place elements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleAddElementInMap = (event: MouseEvent) => {
      if (!selectedElementInstance) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const gridX = Math.floor(clickX / TILE_SIZE);
      const gridY = Math.floor(clickY / TILE_SIZE);

      setMapElements((prev) => [
        ...prev,
        {
          element: selectedElementInstance,
          elementId: selectedElementInstance.id,
          x: gridX,
          y: gridY,
        },
      ]);

      console.log(`Placed at grid: (${gridX}, ${gridY})`);
    };

    canvas.addEventListener("click", handleAddElementInMap);
    return () => {
      canvas.removeEventListener("click", handleAddElementInMap);
    };
  }, [selectedElementInstance]);

  // Draw grid + elements
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid lines
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;

    for (let x = 0; x <= rect.width; x += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }

    for (let y = 0; y <= rect.height; y += TILE_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Draw all placed map elements
    mapElements.forEach((item) => {
      const img = new Image();
      img.src = item.element.imageUrl;

      img.onload = () => {
        ctx.drawImage(
          img,
          item.x * TILE_SIZE,
          item.y * TILE_SIZE,
          (item.element.width || 1) * TILE_SIZE,
          (item.element.height || 1) * TILE_SIZE
        );
      };
    });
  }, [mapElements]);

  return (
    <div className="bg-custom-bg-dark-1 relative h-screen w-screen">
      <AllElementsSidebar
        setElement={setSelectedElementInstance}
        element={selectedElementInstance}
      />
      <canvas
        ref={canvasRef}
        className="fixed top-0 right-10 z-0 md:w-[85vw] h-screen overflow-hidden"
      />
    </div>
  );
}
