"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Loader from "@/components/custom/loader";
import Logo from "@/components/custom/logo";
import { GetAllAvatars } from "@/lib/apis";
import { Avatar } from "@/lib/types/apiTypes";

const Page = () => {
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#222831] to-[#393E46] text-[#EEEEEE] flex flex-col items-center">
      <nav className="w-full flex items-center justify-between px-6 py-4 bg-[#222831] shadow-md">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
      </nav>

      <div className="mt-12 mb-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#00ADB5] to-[#FF2E63] text-transparent bg-clip-text">
          Choose Your Avatar
        </h1>
        <p className="text-[#CCCCCC] mt-3 text-lg">Enter the world in style.</p>
      </div>

      {avatars && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-6 w-full max-w-6xl">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              onClick={() => setSelectedAvatarId(avatar.id)}
              className={clsx(
                "rounded-xl p-5 bg-[#393E46] border-2 transition-all duration-300 cursor-pointer flex flex-col items-center shadow-md hover:shadow-[#00ADB5]/60 hover:scale-105",
                avatar.id === selectedAvatarId
                  ? "border-[#FFD369] ring-2 ring-[#FFD369]"
                  : "border-transparent"
              )}
            >
              <img
                src={avatar.imageUrl.standingDown}
                alt="avatar"
                className="w-24 h-24 object-contain mb-3"
              />
            </div>
          ))}
        </div>
      )}

      {avatars ? (
        <div className="mt-8 mb-12">
          <button
            disabled={!selectedAvatarId}
            className={clsx(
              "px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300 shadow-md",
              selectedAvatarId
                ? "bg-gradient-to-r from-[#00ADB5] to-[#FF2E63] text-white hover:scale-105"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            )}
          >
            {selectedAvatarId ? "Confirm Avatar" : "Select an Avatar"}
          </button>
        </div>
      ) : (
        <Loader classname="my-28" />
      )}
    </div>
  );
};

export default Page;
