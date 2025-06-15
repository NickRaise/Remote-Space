import React, { useEffect, useState } from "react";
import { Element } from "@repo/common/schema-types";
import { GetAllAvatarsAPI } from "@/lib/apis";
import Image from "next/image";
import clsx from "clsx";
import { TILE_SIZE } from "@/lib/constant";

const AllElementsMenu = () => {
  const [allElements, setAllElements] = useState<Element[]>();
  const [draggingElementId, setDraggingElementId] = useState<string | null>(
    null
  );

  const fetchAllElements = async () => {
    try {
      const response = await GetAllAvatarsAPI();
      setAllElements(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllElements();
  }, []);

  return (
    <div className="sticky top-0 left-0 z-50">
      <div className="h-screen w-36 bg-custom-bg-dark-2 overflow-y-scroll overflow-x-hidden transition-all duration-300 relative">
        <div className="my-3 text-center text-custom-text-primary font-semibold text-md">
          <button className="text-custom-accent hover:underline cursor-pointer hover:text-custom-highlight transition duration-150">
            ← Go Back
          </button>
        </div>

        <div className="flex items-center">
          <div className="flex gap-3 px-4 flex-wrap items-center justify-center">
            {allElements?.map((e) => (
              <div className="flex-shrink-0" key={e.id}>
                <Image
                  src={e.imageUrl}
                  width={e.width * TILE_SIZE}
                  height={e.height * TILE_SIZE}
                  draggable
                  onDragStart={(event) => {
                    setDraggingElementId(e.id);
                    event.dataTransfer.setData(
                      "application/json",
                      JSON.stringify(e)
                    );
                  }}
                  onDragEnd={() => setDraggingElementId(null)}
                  alt="element image"
                  className={clsx(
                    "p-2 bg-custom-bg-dark-1 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-[rgba(0,173,181,0.6)] shadow-sm max-h-[90px] object-contain",
                    draggingElementId === e.id
                      ? "border-2 border-custom-border-highlight"
                      : "border-2 border-transparent"
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllElementsMenu;
