import React, { useEffect, useState } from "react";
import { Element } from "@repo/common/schema-types";
import { GetAllAvatarsAPI } from "@/lib/apis";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
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
      <div className="text-center py-3 z-10  bg-gradient-to-b from-custom-bg-dark-1 to-custom-bg-dark-2 shadow-xl">
        <Link
          href="/"
          className="text-custom-highlight hover:underline cursor-pointer hover:text-custom-accent transition duration-150 font-semibold text-md"
        >
          ← Go Back
        </Link>
      </div>
      <div className="h-screen w-40 bg-custom-bg-dark-2 overflow-y-scroll overflow-x-hidden transition-all duration-300 relative scrollbar-hide">
        <div className="flex items-center">
          <div className="flex gap-3 px-4 flex-wrap items-center justify-center">
            {allElements?.map((e) => (
              <div className="flex-shrink-0" key={e.id}>
                <Image
                  src={e.imageUrl}
                  width={e.width * 20}
                  height={e.height * 20}
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
