"use client";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";
import HorizontalCarousel from "@/components/sections/HorizontalCarousel";
import { useEffect, useState } from "react";
import {
  DeleteSpaceByIdAPI,
  GetAllAvailableSpaces,
  GetMySpacesAPI,
} from "@/lib/apis";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import Loader from "@/components/custom/loader";
import BlankSpace from "@/public/blank-space.png";
import { useRouter } from "next/navigation";
import { Space } from "@repo/common/schema-types";

const JoinSpacePage = () => {
  const [allSpaces, setAllSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>();
  const router = useRouter();

  const fetchAllSpaces = async () => {
    try {
      const response = await GetAllAvailableSpaces();
      setAllSpaces(response.data.spaces);
    } catch (err) {
      console.log(err);
      toast("Cannot fetch spaces...");
    }
  };

  useEffect(() => {
    fetchAllSpaces();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-custom-bg-dark-1 to-custom-bg-dark-2 text-white px-6 py-4 space-y-6">
      <div className="w-full">
        <HorizontalCarousel />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-custom-text-primary">
          Spaces Available to Join
        </h2>
      </div>

      {loading ? (
        <div className="w-full flex items-center justify-center h-60">
          <Loader />
        </div>
      ) : allSpaces.length === 0 ? (
        <div className="w-full italic pl-10">
          No spaces found. Please create one...
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allSpaces.map((space) => (
          <Card
            key={space.id}
            className="bg-[#2a2a2a] border-none border-[#3a3a3a] rounded-2xl overflow-hidden relative group hover:shadow-md ring-2 ring-transparent hover:scale-105 hover:ring-custom-border-highlight transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/join/${space.id}`)}
          >
            <div className="w-full h-[160px] relative">
              <Image
                src={space.thumbnail || BlankSpace}
                alt={space.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium truncate max-w-[80%] text-custom-text-primary">
                  {space.name}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JoinSpacePage;
