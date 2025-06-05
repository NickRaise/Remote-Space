"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import Loader from "@/components/custom/loader";
import { GetAllAvatars, UpdateUserAvatar } from "@/lib/apis";
import { Avatar } from "@/lib/types/apiTypes";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";

const Page = () => {
  const [avatars, setAvatars] = useState<Avatar[] | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const token = useUserStore((state) => state.userToken);

  const fetchAvatars = async () => {
    const allAvatars = await GetAllAvatars();
    setAvatars(allAvatars);
  };

  const handleUpdateAvatar = async () => {
    if (!token || !selectedAvatarId) return;
    try {
      setLoading(true);
      const response = await UpdateUserAvatar(token, selectedAvatarId);
      if (response.status === 200) {
        toast("Avatar updated successfully!");
      }
    } catch (err) {
      console.log(err);
      toast("Avatar update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-custom-bg-dark-1 to-custom-bg-dark-2 text-custom-text-primary flex flex-col items-center">
      <div className="mt-12 mb-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-custom-primary to-custom-accent text-transparent bg-clip-text">
          Choose Your Avatar
        </h1>
        <p className="text-custom-text-secondary mt-3 text-lg">
          Enter the world in style.
        </p>
      </div>

      {avatars && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-6 w-full max-w-6xl">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              onClick={() => setSelectedAvatarId(avatar.id)}
              className={clsx(
                "rounded-xl p-5 bg-custom-bg-dark-2 border-2 transition-all duration-300 cursor-pointer flex flex-col items-center shadow-md hover:shadow-custom-primary/60 hover:scale-105",
                avatar.id === selectedAvatarId
                  ? "border-custom-border-highlight ring-2 ring-custom-border-highlight"
                  : "border-transparent"
              )}
            >
              <img
                src={avatar.imageUrl.standingDown}
                alt="avatar"
                className="w-24 h-24 object-contain mb-3"
              />
              <span>{avatar.name}</span>
            </div>
          ))}
        </div>
      )}

      {avatars ? (
        <div className="mt-8 mb-12">
          <button
            disabled={!selectedAvatarId || loading}
            onClick={handleUpdateAvatar}
            className={clsx(
              "px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300 shadow-md",
              selectedAvatarId
                ? "bg-gradient-to-r from-custom-primary to-custom-accent text-white hover:scale-105 cursor-pointer"
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
