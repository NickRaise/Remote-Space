"use client";
import AllElementsSidebar from "@/components/custom/element-sidebar";
import React, { useRef, useEffect, useState } from "react";
import { Element } from "@repo/common/schema-types";

const TILE_SIZE = 40;
const TILE_IMAGE_SRC = "/assests/objects/tile.png";

export default function FullScreenGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedElementId, setSelectedElementId] = useState<Element | null>(
    null
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set actual canvas size in pixels
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Make sure the canvas is still styled to its CSS size
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Scale the context so 1 unit in drawing = 1 CSS pixel
    ctx.scale(dpr, dpr);

    // Clear before drawing
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

    // const tileImg = new Image();
    // tileImg.src = TILE_IMAGE_SRC;

    // tileImg.onload = () => {
    //   for (let y = 0; y <= rect.height; y += TILE_SIZE) {
    //     for (let x = 0; x <= rect.width; x += TILE_SIZE) {
    //       ctx.drawImage(tileImg, x, y, TILE_SIZE, TILE_SIZE);
    //     }
    //   }
    // };

    // Click event handler to log grid cell
    function handleClick(event: MouseEvent) {
      if (!canvas) return;

      const boundingRect = canvas.getBoundingClientRect();

      // Calculate click coordinates relative to canvas top-left
      const clickX = event.clientX - boundingRect.left;
      const clickY = event.clientY - boundingRect.top;

      // Find grid cell indices
      const gridX = Math.floor(clickX / TILE_SIZE);
      const gridY = Math.floor(clickY / TILE_SIZE);

      console.log(`Grid cell clicked: (${gridX}, ${gridY})`);
    }

    canvas.addEventListener("click", handleClick);

    // Cleanup
    return () => {
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="bg-slate-800 relative h-screen w-screen">
      <AllElementsSidebar setElementId={setSelectedElementId} />
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-1/2 -translate-x-1/2 z-0 md:w-[80vw] h-screen overflow-hidden"
      />
    </div>
  );
}
