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

const AllElementsSidebar = ({
  element,
  setElement,
}: {
  element: Element | null;
  setElement: Dispatch<SetStateAction<Element | null>>;
}) => {
  const [allElements, setAllElements] = useState<Element[]>();
  const [isOpen, setIsOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY * 2;
    };

    el.addEventListener("wheel", onWheel);
    return () => el.removeEventListener("wheel", onWheel);
  }, [isOpen]);

  return (
    <div className="fixed top-0 left-0 w-screen z-50">
      <div
        className={clsx(
          "w-full bg-custom-bg-dark-2 overflow-hidden transition-all duration-300 relative",
          isOpen ? "h-36" : "h-0"
        )}
      >
        {isOpen && (
          <>
            <div className="absolute left-4 z-20 flex items-center h-full ">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full 
                text-custom-text-primary border-2 border-custom-text-primary 
                hover:bg-custom-text-primary hover:text-custom-bg-dark-1 
                transition duration-200 cursor-pointer"
              >
                ←
              </div>
            </div>

            {/* Avatar Items */}
            <div className="h-full flex items-center pl-16">
              <div
                ref={scrollRef}
                className="flex gap-3 px-4 py-2 flex-nowrap overflow-x-auto scrollbar-hide scroll-smooth"
              >
                {allElements?.map((e) => (
                  <div className="flex-shrink-0" key={e.id}>
                    <Image
                      src={e.imageUrl}
                      width={100}
                      height={100}
                      onClick={() =>
                        setElement((state) => (state?.id !== e.id ? e : null))
                      }
                      alt="element image"
                      className={clsx(
                        "p-2 bg-custom-bg-dark-1 rounded-lg cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-[rgba(0,173,181,0.6)] shadow-sm w-[100px] h-auto max-h-[90px] object-contain",
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
      <div className="w-full flex justify-center">
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-28 h-16 bg-custom-text-primary text-custom-bg-dark-2 flex items-center justify-center cursor-pointer -mt-6"
          style={{
            clipPath: "polygon(0.87% 31.21%, 99.13% 31.21%, 75% 75%, 25% 75%)",
          }}
        >
          {isOpen ? "x" : "↓"}
        </div>
      </div>
    </div>
  );
};

export default AllElementsSidebar;
