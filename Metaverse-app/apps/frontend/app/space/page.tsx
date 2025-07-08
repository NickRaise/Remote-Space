"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import HorizontalCarousel from "@/components/sections/HorizontalCarousel";
import { useEffect, useState } from "react";
import { IAllSpaceResponse } from "@/lib/types";
import { DeleteSpaceByIdAPI, GetMySpacesAPI } from "@/lib/apis";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import Loader from "@/components/custom/loader";
import CreateSpaceMenu from "@/components/sections/CreateSpaceButton";
import BlankSpace from "@/public/blank-space.png";
import { useRouter } from "next/navigation";

export default function SpacesPage() {
  const [mySpaces, setMySpaces] = useState<IAllSpaceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const userToken = useUserStore((state) => state.userToken);
  const router = useRouter();

  const fetchMySpaces = async () => {
    if (!userToken) return;
    try {
      setLoading(true);
      const response = await GetMySpacesAPI(userToken);
      setMySpaces(response.data.spaces);
    } catch (err) {
      console.log(err);
      toast("Failed to fetch spaces.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySpaces();
  }, [userToken]);

  const deleteSpace = (spaceId: string) => {
    if (!userToken) return;
    try {
      const response = DeleteSpaceByIdAPI(userToken, spaceId);
      setMySpaces((prevSpaces) =>
        prevSpaces.filter((space) => space.id !== spaceId)
      );
      toast("Deleted space successfully...");
    } catch (err) {
      console.log(err);
      toast("Space deletion failed. Try again...");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-custom-bg-dark-1 to-custom-bg-dark-2 text-white px-6 py-4 space-y-6">
      <div className="w-full">
        <HorizontalCarousel />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-custom-text-primary">
          Your Spaces
        </h2>
        <CreateSpaceMenu />
      </div>

      {loading ? (
        <div className="w-full flex items-center justify-center h-60">
          <Loader />
        </div>
      ) : mySpaces.length === 0 ? (
        <div className="w-full italic pl-10">
          No spaces found. Please create one...
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mySpaces.map((space) => (
          <Card
            key={space.id}
            className="bg-[#2a2a2a] border-none border-[#3a3a3a] rounded-2xl overflow-hidden relative group hover:shadow-md ring-2 ring-transparent hover:scale-105 hover:ring-custom-border-highlight transition-all duration-300 cursor-pointer"
            onClick={() => router.push("/join")}
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
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontal className="w-5 h-5 text-white cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#2a2a2a] border border-[#444] text-white">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/space/${space.id}`;
                      }}
                      className="cursor-pointer"
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSpace(space.id);
                      }}
                      className="cursor-pointer"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
