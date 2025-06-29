"use client";
import { GetSpaceByIdAPI } from "@/lib/apis";
import { IGetSpaceByIdResponse } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import { Game } from "phaser";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const JoinArena = () => {
  const spaceRef = useRef<IGetSpaceByIdResponse>(null);
  const params = useParams();
  const userToken = useUserStore((state) => state.userToken);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);

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
    if (!userToken) return;
    const space = (await fetchSpaceData()) as IGetSpaceByIdResponse;

    const Phaser = await import("phaser");

    const { ArenaScene } = await import("@/phaser-engine/ArenaScene");

    const dimensionValues = space.dimensions.split("x");

    const dimensions = {
      width: Number(dimensionValues[0]),
      height: Number(dimensionValues[1]),
    };

    const scene = new ArenaScene(dimensions, space.spaceElements);

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

    return () => {
      if (gameRef.current?.isRunning) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [userToken]);

  return (
    <div className="w-screen h-screen">
      <div ref={containerRef} />
    </div>
  );
};

export default JoinArena;
