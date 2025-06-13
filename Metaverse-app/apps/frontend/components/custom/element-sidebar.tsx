import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
import { Element } from "@repo/common/schema-types";
import { GetAllAvatarsAPI } from "@/lib/apis";
import Image from "next/image";
import clsx from "clsx";
import { ChevronDown, ChevronLeft, X } from "lucide-react";
import { TILE_SIZE } from "@/lib/constant";

const AllElementsMenu = ({
  element,
  setElement,
}: {
  element: Element | null;
  setElement: Dispatch<SetStateAction<Element | null>>;
}) => {
  const [allElements, setAllElements] = useState<Element[]>();
  const [isOpen, setIsOpen] = useState(true);

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
      <div
        className={clsx(
          " h-screen bg-custom-bg-dark-2 overflow-y-scroll transition-all duration-300 relative",
          isOpen ? "w-36" : "w-0"
        )}
      >
        {isOpen && (
          <>
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
                      onClick={() =>
                        setElement((state) => (state?.id !== e.id ? e : null))
                      }
                      alt="element image"
                      className={clsx(
                        "p-2 bg-custom-bg-dark-1 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-[rgba(0,173,181,0.6)] shadow-sm max-h-[90px] object-contain",
                        element?.id === e.id
                          ? "border-2 border-custom-border-highlight"
                          : "border-2 border-transparent"
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {/* <div className="w-full flex justify-center">
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-28 h-16 text-custom-text-primary bg-custom-bg-dark-2 transition-all duration-200 flex items-center justify-center cursor-pointer -mt-5 hover:bg-gradient-to-b hover:from-custom-bg-dark-2 hover:to-custom-bg-dark-1 border border-custom-bg-dark-2"
          style={{
            clipPath: "polygon(0.87% 31.21%, 99.13% 31.21%, 75% 75%, 25% 75%)",
          }}
        >
          {isOpen ? (
            <X className="w-4 h-4 mt-1" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div> */}
    </div>
  );
};

export default AllElementsMenu;
