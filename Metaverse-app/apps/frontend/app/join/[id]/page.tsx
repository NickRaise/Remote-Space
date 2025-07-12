"use client";
import LoadingScreen from "@/components/sections/LoadingScreen";
import { GetSpaceByIdAPI } from "@/lib/apis";
import { IGetSpaceByIdResponse } from "@/lib/types";
import { useUserStore } from "@/store/userStore";
import { useParams, useRouter } from "next/navigation";
import { Game } from "phaser";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const JoinArena = () => {
  const spaceRef = useRef<IGetSpaceByIdResponse>(null);
  const params = useParams();
  const userToken = useUserStore((state) => state.userToken);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>(null);
  const [ready, setReady] = useState(false);

  const fetchSpaceData = async (): Promise<
    IGetSpaceByIdResponse | undefined
  > => {
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

    const id = params.id as string;

    const scene = new ArenaScene({ ...space, id }, userToken);

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: containerRef.current,
      backgroundColor: "#1a1a1a",
      scene: scene,
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;
    setReady(true);
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
    <>
      {!ready && <LoadingScreen />}
      <div className="w-screen h-screen flex relative scrollbar-hide">
        <div ref={containerRef} />
      </div>
    </>
  );
};

export default JoinArena;
