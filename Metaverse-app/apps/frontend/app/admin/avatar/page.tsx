"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/custom/loader";
import { GetAllAvatars } from "@/lib/apis";
import { Avatar } from "@/lib/types/frontendApiTypes";
import { useRouter } from "next/navigation";

const Page = () => {
  const [avatars, setAvatars] = useState<Avatar[] | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAvatars = async () => {
    const allAvatars = await GetAllAvatars();
    setAvatars(allAvatars);
  };

  const sendToAvatarCreationPage = () => {
    setLoading(true);
    router.push(`${window.location.pathname}/create`);
  };

  useEffect(() => {
    fetchAvatars();
  }, []);

  return (
    <>
      <div className="mt-12 mb-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-custom-primary to-custom-accent text-transparent bg-clip-text">
          Update Avatar's
        </h1>
        <p className="text-custom-text-secondary mt-3 text-lg">
          Customize to suit your style.
        </p>
      </div>

      {avatars && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-6 w-full max-w-6xl">
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              onClick={() =>
                router.push(`${window.location.pathname}/${avatar.id}`)
              }
              className="rounded-xl p-5 bg-custom-bg-dark-2 border-2 transition-all duration-300 cursor-pointer flex flex-col items-center shadow-md hover:shadow-custom-primary/60 hover:scale-105 border-transparent"
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

      {!avatars && <Loader classname="my-28" />}

      <div className="mt-8 mb-12">
        <button
          disabled={loading}
          onClick={sendToAvatarCreationPage}
          className="px-8 py-4 text-lg rounded-full font-semibold transition-all duration-300 shadow-md bg-gradient-to-r from-custom-primary to-custom-accent text-white hover:scale-105 cursor-pointer disabled:cursor-not-allowed"
        >
          Create an Avatar
        </button>
      </div>
    </>
  );
};

export default Page;
