import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Element } from "@repo/common/schema-types";
import { GetAllAvatarsAPI } from "@/lib/apis";
import Image from "next/image";
import clsx from "clsx";

const AllElementsSidebar = ({
  element,
  setElement,
}: {
  element: Element | null;
  setElement: Dispatch<SetStateAction<Element | null>>;
}) => {
  const [allElements, setAllElements] = useState<Element[]>();

  const fetchAllElements = async () => {
    try {
      const response = await GetAllAvatarsAPI();
      setAllElements(response.data);
      console.log(allElements);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllElements();
  }, []);

  return (
    <div className="h-screen overflow-y-scroll w-[10vw] bg-custom-bg-dark-2 z-10 relative">
      <div className="py-2">
        <div className="mb-6 text-center text-custom-text-primary font-semibold text-lg">
          <button className="text-custom-accent hover:underline cursor-pointer hover:text-custom-highlight transition duration-150">
            ← Go Back
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {allElements?.map((e) => (
            <div className="flex items-center justify-center" key={e.id}>
              <Image
                src={e.imageUrl}
                width={100}
                height={100}
                onClick={() =>
                  setElement((state) => {
                    console.log(state?.id)
                    return state?.id !== e.id ? e : null
                  })
                }
                alt="element image"
                className={clsx(
                  "p-2 border-2 bg-custom-bg-dark-1 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-custom-shadow-hover shadow-sm",
                  element?.id === e.id
                    ? "border-2 border-custom-border-highlight"
                    : "border-transparent"
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllElementsSidebar;
