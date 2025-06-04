"use client";
import Loader from "@/components/custom/loader";
import Logo from "@/components/custom/logo";
import { GetAllAvatars } from "@/lib/apis";
import { Avatar } from "@/lib/types/apiTypes";
import clsx from "clsx";
import { useEffect, useState } from "react";

const page = () => {
  const [avatars, setAvatars] = useState<Avatar[] | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);

  const fetchAvatars = async () => {
    const allAvatars = await GetAllAvatars();
    setAvatars(allAvatars);
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <div className="h-screen w-[100vw] bg-purple-100">
      <nav className="p-5 w-full bg-purple-200">
        <Logo />
      </nav>
      <div className="my-6 mx-20 font-bold text-6xl">
        <h1>Choose your avatar</h1>
        <div className="flex p-8 py-20 justify-around">
          {avatars ? (
            avatars.map((e) => (
              <div
                key={e.id}
                className={clsx(
                  "border-4 rounded-2xl p-4 cursor-pointer",
                  e.id === selectedAvatarId
                    ? "border-purple-800"
                    : "border-purple-400"
                )}
                onClick={() => setSelectedAvatarId(e.id)}
              >
                <img
                  src={e.imageUrl.standingDown}
                  alt="avatar img"
                  width={150}
                />
              </div>
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
